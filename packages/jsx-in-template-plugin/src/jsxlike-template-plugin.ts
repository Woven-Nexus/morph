import * as parser from '@babel/parser';
import _traverse, { type NodePath } from '@babel/traverse';
import type { TaggedTemplateExpression } from '@babel/types';
import * as t from '@babel/types';
import MagicString from 'magic-string';
import { type Plugin, type ResolvedConfig } from 'vite';

const traverse = (_traverse as unknown as {default: typeof _traverse}).default;


/**
 * Enables using <Hello></Hello> and <Hello /> type JSX syntax to automatically
 * insert the directive function in its place, with related props and children.
 */
export const jsxlikeTemplatePlugin = (options?: {
	/** List of tags where jsx transformation will be applied */
	tag: string | string[]
}) => {
	let { tag = 'html' } = options ?? {};
	tag = Array.isArray(tag) ? tag : [ tag ];

	const validTagNames = new Set<string>();

	const findTagType = (quasis: t.TemplateElement[], initialString: number, initialChar: number) => {
		for (let i = initialString; i < quasis.length; i++) {
			const quasi = quasis[i]!;
			const value = quasi.value.raw;
			for (let j = i === initialString ? initialChar : 0; j < value.length; j++) {
				const char1 = value[j]!;
				const char2 = value[j + 1] ?? '';

				if (char1 + char2 === '/>')
					return { type: 'short', endIndex: quasi.start! + j + 2 };
				if (char1 === '>')
					return { type: 'long', endIndex: quasi.start! + j };
			}
		}
	};

	const findEndOfLongTag = (quasis: t.TemplateElement[], initialString: number, initialChar: number, tagName: string) => {
		for (let i = initialString; i < quasis.length; i++) {
			const quasi = quasis[i]!;
			const value = quasi.value.raw;

			for (let j = i === initialString ? initialChar : 0; j < value.length; j++) {
				const str = value.slice(j);

				const match = new RegExp('</' + tagName + '>').exec(str);
				if (!match)
					continue;

				const [ tag ] = match;
				const { index } = match;

				if (match) {
					return {
						startIndex: quasi.start! + j + index,
						endIndex:   quasi.start! + j + index + tag.length,
					};
				}
			}
		}
	};

	const parseToTemplateFn = (code: string) => {
		const ast = parser.parse(code, {
			sourceType: 'module',
			plugins:    [ 'importAttributes', 'typescript', 'decorators-legacy' ],
		});

		const magic = new MagicString(code);

		traverse(ast, {
			TaggedTemplateExpression({ node  }) {
				if (!t.isIdentifier(node.tag))
					return;
				if (!tag.includes(node.tag.name))
					return;

				const quasis = node.quasi.quasis;

				for (let i = 0; i < quasis.length; i++) {
					const quasi = quasis[i]!;
					const value = quasi.value.raw;

					for (let j = 0; j < value.length; j++) {
						const char1 = value[j]!;
						const char2 = value[j + 1] ?? '';

						// this means, we should search for what type of tag this is.
						if (!/<[A-Z]/.test(char1 + char2))
							continue;

						// We need to get the tagname, for use in the
						// next transform and also if the first condition does not match
						const [ , tagName ] = /<([A-Z][a-zA-Z]*)/.exec(value.slice(j)) ?? [];
						if (!tagName)
							continue;

						// We start another loop, and check if we find a /> or > first, this will determine our next step.
						const { type, endIndex } = findTagType(quasis, i, j) ?? {};
						if (!type || endIndex === undefined)
							throw new Error('Could not get tag type');

						magic.update(quasi.start! + j, quasi.start! + j + 1, '${');
						magic.appendRight(quasi.start! + j + 1 + tagName.length, '`');

						// If the tag ends with a /> we can convert it into a func immediatly.
						if (type === 'short')
							magic.update(endIndex - 2, endIndex, '`}');

						// If it instead give us a >, we need to now search for </Component>
						if (type === 'long') {
							const { startIndex, endIndex: realEnd } = findEndOfLongTag(quasis, i, j, tagName) ?? {};
							if (startIndex === undefined || realEnd === undefined)
								throw new Error('Could not find real end for long tag.');

							magic.update(startIndex, realEnd, '`}');
						}

						validTagNames.add(tagName);
					}
				}
			},
		});

		return magic;
	};

	const parseToObject = (code: string) => {
		const ast = parser.parse(code, {
			sourceType: 'module',
			plugins:    [ 'importAttributes', 'typescript', 'decorators-legacy' ],
		});

		const nodesToHandle: NodePath<TaggedTemplateExpression>[] = [];
		traverse(ast, {
			TaggedTemplateExpression(root) {
				const { node } = root;
				if (!t.isIdentifier(node.tag))
					return;
				if (!validTagNames.has(node.tag.name))
					return;

				nodesToHandle.unshift(root);
			},
		});

		const magic = new MagicString(code);
		const parseTaggedTemplateExpression = (root: NodePath<TaggedTemplateExpression>) => {
			const { node } = root;

			const expressions = node.quasi.expressions;
			const quasis = node.quasi.quasis;

			const tag: { strings: string[]; values: any[]; } = {
				strings: [],
				values:  [],
			};
			const child: { strings: string[]; values: any[]; } = {
				strings: [],
				values:  [],
			};

			let mode: 'tag' | 'child' = 'tag';
			for (let i = 0; i < quasis.length; i++) {
				const quasi = quasis[i]!;
				const expr = expressions[i];
				const value = quasi.value.raw;

				for (let j = 0; j < value.length; j++) {
					const char = value[j]!;

					if (mode === 'tag') {
						if (char === '>') {
							mode = 'child';
							continue;
						}

						tag.strings[0] ??= '';
						tag.strings[tag.strings.length - 1] += char;

						// last char, now we add accompanying expr.
						if (j === value.length - 1) {
							if (expr) {
								const val = magic.slice(expr.start!, expr.end!);
								tag.values.push(val);
							}

							if (i !== quasis.length - 1)
								tag.strings.push('');
						}
					}

					if (mode === 'child') {
						child.strings[0] ??= '';
						child.strings[child.strings.length - 1] += char;

						// last char, now we add accompanying expr.
						if (j === value.length - 1) {
							if (expr) {
								const val = magic.slice(expr.start!, expr.end!);
								child.values.push(val ?? '');
							}

							if (i !== quasis.length - 1)
								child.strings.push('');

							child.strings[child.strings.length - 1] =
								child.strings[child.strings.length - 1]!.trim();
						}
					}
				}
			}

			const trimInPlace = (...strings: string[][]) => {
				const whitespace = '(?: |(?:\t)|(?:\n))';
				const trimStartWhitespace  = new RegExp('^' + whitespace + '+');
				const trimEndWhitespace    = new RegExp(whitespace + '+$');
				const trimEqualsWhitespace = new RegExp(whitespace + '*=' + whitespace + '*', 'g');
				const trimAttrWhitespace   = new RegExp('(?!["\'])' + whitespace + '+', 'g');

				for (const arr of strings) {
					for (let i = 0; i < arr.length; i++) {
						arr[i] = arr[i]!
							.replace(trimStartWhitespace, '')
							.replace(trimEndWhitespace, '')
							.replaceAll(trimEqualsWhitespace, '=')
							.replaceAll(trimAttrWhitespace, ' ');
					}
				}
			};
			trimInPlace(tag.strings, child.strings);

			// With the tag and child info in hand, lets make the props.
			let propObj = '{';
			propObj += '';

			for (let i = 0; i < tag.strings.length; i++) {
				const string = tag.strings[i]!;
				const props = string.split(' ');

				for (let j = 0; j < props.length; j++) {
					const prop = props[j]!;

					// last prop, and also an assignment from the values array.
					if (j === props.length - 1 && string.endsWith('=')) {
						const key = '"' + prop.replaceAll(/(^\W+)|(\W+$)/g, '') + '"';
						const value = tag.values[i] + ',';

						propObj += key + ':' + value;
						continue;
					}

					const [ key, value ] = prop.split('=');

					// boolean attribute, set to true.
					if (key && value === undefined)
						propObj += '"' + key + '"' + ':true,';
					else if (key && value !== undefined)
						propObj += '"' + key + '"' + ':' + value + ',';
				}
			}

			let childrenProp = '';
			for (let i = 0; i < child.strings.length; i++) {
				const str = child.strings[i]!;
				const expr = child.values[i] ?? '';

				childrenProp += str;
				if (expr)
					childrenProp += '${' + expr + '}';
			}

			if (childrenProp)
				propObj += '"children": html`' + childrenProp + '`';

			propObj += '}';

			// Changes from Name`` to Name({}) with prop object.
			magic.update(node.tag.end!, node.end!, '(' + propObj + ')');
		};

		for (const root of nodesToHandle)
			parseTaggedTemplateExpression(root);

		return magic;
	};


	let cfg: ResolvedConfig;

	return {
		name: 'jsxlike-template-string',
		configResolved(config) {
			cfg = config;
			cfg;
		},
		async transform(code, id) {
			if (!/\.((?:ts)|(?:js)$)/.test(id))
				return;

			const stage1 = parseToTemplateFn(code);
			const stage2 = parseToObject(stage1.toString());

			return {
				code: stage2.toString(),
				map:  stage2.generateMap(),
			};
		},
	} as Plugin;
};
