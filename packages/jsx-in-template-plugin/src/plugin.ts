import * as parser from '@babel/parser';
import _traverse, { type NodePath } from '@babel/traverse';
import type { TaggedTemplateExpression } from '@babel/types';
import * as t from '@babel/types';
import MagicString from 'magic-string';
import { type Plugin, type ResolvedConfig } from 'vite';

import { splitAttributes, trimInPlace } from './attribute-handling.js';

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

	const tagStartExpr = /<[A-Z]/;
	const tagNameExpr = /<([A-Z][\w.]*)/;
	const tagRegexCache = new Map<string, RegExp>();

	const findEndTag = (quasis: t.TemplateElement[], initialString: number, initialChar: number, tagName: string) => {
		for (let i = initialString; i < quasis.length; i++) {
			const quasi = quasis[i]!;
			const value = quasi.value.raw;
			for (let j = i === initialString ? initialChar : 0; j < value.length; j++) {
				const char1 = value[j]!;
				const char2 = value[j + 1] ?? '';

				// This is a short tag, we know the start and end of this already.
				if (char1 + char2 === '/>') {
					return {
						endTagFirstIndex: quasi.start! + j,
						endTagLastIndex:  quasi.start! + j + 2,
					};
				}

				// This is a long tag, we do a different type of search to get the </tagname> tag info.
				if (char1 === '>')
					return findEndOfLongTag(quasis, i, j, tagName);
			}
		}
	};

	const findEndOfLongTag = (quasis: t.TemplateElement[], initialString: number, initialChar: number, tagName: string) => {
		for (let i = initialString; i < quasis.length; i++) {
			const quasi = quasis[i]!;
			const value = quasi.value.raw;

			for (let j = i === initialString ? initialChar : 0; j < value.length; j++) {
				const str = value.slice(j);

				const expr = tagRegexCache.get(tagName) ??
					tagRegexCache.set(tagName, new RegExp('</' + tagName + '>'))
						.get(tagName)!;

				const match = expr.exec(str);
				if (!match)
					continue;

				const [ tag ] = match;
				const { index } = match;

				if (match) {
					return {
						endTagFirstIndex: quasi.start! + j + index,
						endTagLastIndex:  quasi.start! + j + index + tag.length,
					};
				}
			}
		}
	};

	const getAndProccessNodes = (
		code: string,
		predicate: (root: NodePath<TaggedTemplateExpression>) => boolean,
		action: (root: NodePath<TaggedTemplateExpression>) => void,
		reverse = false,
	) => {
		const ast = parser.parse(code, {
			sourceType: 'module',
			plugins:    [ 'importAttributes', 'typescript', 'decorators-legacy' ],
		});

		const nodes: NodePath<TaggedTemplateExpression>[] = [];
		traverse(ast, {
			TaggedTemplateExpression(root) {
				if (!predicate(root))
					return;

				if (reverse)
					nodes.unshift(root);
				else
					nodes.push(root);
			},
		});

		for (const root of nodes)
			action(root);

		return nodes;
	};

	const parseToTemplateFn = (validTagNames: Set<string>, code: string, id: string) => {
		const magic = new MagicString(code);
		const parseTaggedTemplateExpression = (root: NodePath<TaggedTemplateExpression>) => {
			const quasis = root.node.quasi.quasis;

			for (let i = 0; i < quasis.length; i++) {
				const quasi = quasis[i]!;
				const value = quasi.value.raw;

				for (let j = 0; j < value.length; j++) {
					const char1 = value[j]!;
					const char2 = value[j + 1] ?? '';

					// this means, we should search for what type of tag this is.
					if (!tagStartExpr.test(char1 + char2))
						continue;

					// We need to get the tagname, for use in the
					// next transform and finding the end tag.
					const [ , tagName ] = tagNameExpr.exec(value.slice(j)) ?? [];
					if (!tagName)
						continue;

					// We get the first and last index of the end tag. This can either be a /> or </xxx>
					const endTag = findEndTag(quasis, i, j, tagName);
					if (!endTag) {
						console.error('jsxlike-template-plugin: '
							+ 'Could not get end tag. \ntag: ' + tagName
							+ '.\nfile: ' + id);

						continue;
					}

					magic.update(quasi.start! + j, quasi.start! + j + 1, '${');
					magic.appendRight(quasi.start! + j + 1 + tagName.length, '`');
					magic.update(endTag.endTagFirstIndex, endTag.endTagLastIndex, '`}');

					validTagNames.add(tagName);
				}
			}
		};

		getAndProccessNodes(code,
			({ node }) => t.isIdentifier(node.tag) && tag.includes(node.tag.name),
			parseTaggedTemplateExpression);

		return magic;
	};

	const parseToFunction = (validTagNames: Set<string>, code: string) => {
		const magic = new MagicString(code);
		const parseTaggedTemplateExpression = (root: NodePath<TaggedTemplateExpression>) => {
			const expressions = root.node.quasi.expressions;
			const quasis = root.node.quasi.quasis;

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
						}
					}
				}
			}

			trimInPlace(tag.strings, child.strings);

			let propObj = '{';
			for (let i = 0; i < tag.strings.length; i++) {
				const string = tag.strings[i]!;
				const props = splitAttributes(string);

				for (let j = 0; j < props.length; j++) {
					const prop = props[j]!;

					// last prop, and also an assignment from the values array.
					if (j === props.length - 1 && string.endsWith('=')) {
						const key = `"${ prop.replaceAll(/(^\W+)|(\W+$)/g, '') }"`;
						const value = `${ tag.values[i] },`;
						propObj += `${ key }:${ value }`;

						continue;
					}

					const [ key, value ] = prop.split('=');

					// boolean attribute, set to true.
					if (key && value === undefined)
						propObj += `"${ key }":true,`;
					else if (key && value !== undefined)
						propObj += `"${ key }":${ value },`;
				}
			}

			let childrenProp = '';
			for (let i = 0; i < child.strings.length; i++) {
				const str = child.strings[i]!;
				const expr = child.values[i] ?? '';

				childrenProp += str;
				if (expr)
					childrenProp += `\${${ expr }}`;
			}

			if (childrenProp)
				propObj += `"children":html\`${ childrenProp }\``;

			propObj += '}';

			// Changes from Name`` to Name({}) with prop object.
			magic.update(root.node.tag.end!, root.node.end!, '(' + propObj + ')');
		};

		getAndProccessNodes(code,
			({ node }) => {
				if ((node as any).tag.name === 'html')
					return false;

				if (t.isIdentifier(node.tag))
					return validTagNames.has(node.tag.name);

				if (t.isMemberExpression(node.tag)) {
					// TODO, this could go deeper we need a recursive traversal here
					// Too lazy to implement yet.

					let name = '';
					if (t.isIdentifier(node.tag.object))
						name = node.tag.object.name;
					if (t.isIdentifier(node.tag.property))
						name += '.' + node.tag.property.name;

					return validTagNames.has(name);
				}

				return false;
			},
			parseTaggedTemplateExpression,
			true);

		return magic;
	};

	let cfg: ResolvedConfig;
	const transformExpr = /\.((?:ts)|(?:js)$)/;

	return {
		name: 'jsxlike-template-string',
		configResolved(config) {
			cfg = config;
			cfg;
		},
		async transform(code, id) {
			if (!transformExpr.test(id))
				return;

			const validTagNames = new Set<string>();
			const stage1 = parseToTemplateFn(validTagNames, code, id);
			const stage2 = parseToFunction(validTagNames, stage1.toString());

			return {
				code: stage2.toString(),
				map:  stage2.generateMap(),
			};
		},
	} as Plugin;
};
