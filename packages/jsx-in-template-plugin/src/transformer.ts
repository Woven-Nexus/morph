import * as parser from '@babel/parser';
import _traverse, { type NodePath } from '@babel/traverse';
import type { TaggedTemplateExpression } from '@babel/types';
import * as t from '@babel/types';
import MagicString from 'magic-string';

import { splitAttributes, trimInPlace } from './attr-handling.js';

const traverse = (_traverse as unknown as {default: typeof _traverse}).default;


const startEndNonWord = /(^\W+)|(\W+$)/g;
const tagStartExpr = /<[A-Z]/;
const tagNameExpr = /<([A-Z][\w.]*)/;
const tagRegexCache = new Map<string, RegExp>();


export class KeystoneTemplateTransformer {

	constructor(
		/** List of tagged template literal expression names
		 * that will be parsed for Keystone components. */
		protected names: string[],
	) {}

	protected findEndTag(
		quasis: t.TemplateElement[],
		initialString: number,
		initialChar: number,
		tagName: string,
	) {
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
					return this.findEndOfLongTag(quasis, i, j, tagName);
			}
		}
	}

	protected findEndOfLongTag(
		quasis: t.TemplateElement[],
		initialString: number,
		initialChar: number,
		tagName: string,
	) {
		for (let i = initialString; i < quasis.length; i++) {
			const quasi = quasis[i]!;
			const value = quasi.value.raw;

			for (let j = i === initialString ? initialChar : 0; j < value.length; j++) {
				const str = value.slice(j);

				const expr = tagRegexCache.get(tagName) ??
					tagRegexCache.set(tagName, new RegExp('</' + tagName + '>')).get(tagName)!;

				const match = str.match(expr);
				if (!match || match.index === undefined)
					continue;

				if (match) {
					return {
						endTagFirstIndex: quasi.start! + j + match.index,
						endTagLastIndex:  quasi.start! + j + match.index + match[0].length,
					};
				}
			}
		}
	}

	protected createAst(code: string) {
		const ast = parser.parse(code, {
			sourceType: 'module',
			plugins:    [ 'importAttributes', 'typescript', 'decorators-legacy' ],
		});

		return ast;
	}

	protected templateParse(validTagNames: Set<string>, code: string, id: string) {
		const nodes: NodePath<TaggedTemplateExpression>[] = [];
		traverse(this.createAst(code), {
			TaggedTemplateExpression: (root) =>
				void (this.templateCondition(root) && nodes.push(root)),
		});

		const magic = new MagicString(code);
		for (const root of nodes)
			this.templateTransformer(validTagNames, id, magic, root);

		return magic;
	}

	protected templateCondition(root: NodePath<TaggedTemplateExpression>) {
		const tag = root.node.tag;

		return t.isIdentifier(tag) && this.names.includes(tag.name);
	}

	protected templateTransformer(
		validTagNames: Set<string>,
		id: string,
		magic: MagicString,
		root: NodePath<TaggedTemplateExpression>,
	) {
		const quasis = root.node.quasi.quasis;

		for (let i = 0; i < quasis.length; i++) {
			const quasi = quasis[i]!;
			const value = quasi.value.raw;

			for (let j = 0; j < value.length; j++) {
				const char1 = value[j]!;
				const char2 = value[j + 1] ?? '';

				if (!tagStartExpr.test(char1 + char2))
					continue;

				const [ , tagName ] = value.slice(j).match(tagNameExpr) ?? [];
				if (!tagName)
					continue;

				// We get the first and last index of the end tag. This can either be a /> or </xxx>
				const endTag = this.findEndTag(quasis, i, j, tagName);
				if (!endTag) {
					console.error('vite-plugin-keystone: '
						+ 'Could not get end tag. tag: ' + tagName
						+ '.\nfile: ' + id);

					continue;
				}

				magic.update(quasi.start! + j, quasi.start! + j + 1, '${');
				magic.appendRight(quasi.start! + j + 1 + tagName.length, '`');
				magic.update(endTag.endTagFirstIndex, endTag.endTagLastIndex, '`}');

				validTagNames.add(tagName);
			}
		}
	}

	protected functionParse(validTagNames: Set<string>, code: string) {
		const nodes: NodePath<TaggedTemplateExpression>[] = [];
		traverse(this.createAst(code), {
			TaggedTemplateExpression: (root) =>
				void (this.functionCondition(validTagNames, root) && nodes.unshift(root)),
		});

		const magic = new MagicString(code);
		for (const root of nodes)
			this.functionTransformer(magic, root);

		return magic;
	}

	protected functionCondition(
		validTagNames: Set<string>,
		root: NodePath<TaggedTemplateExpression>,
	) {
		const tag = root.node.tag;
		if (t.isIdentifier(tag))
			return validTagNames.has(tag.name);

		if (t.isMemberExpression(tag)) {
			let name = '';
			let currentNode = tag as t.Expression;

			while (t.isMemberExpression(currentNode)) {
				if (t.isIdentifier(currentNode.property))
					name = currentNode.property.name + '.' + name;
				if (t.isIdentifier(currentNode.object))
					name = currentNode.object.name + '.' + name;

				currentNode = currentNode.object;
			}

			name = name.replace(/\.+$/, '');

			return validTagNames.has(name);
		}

		return false;
	}

	protected functionTransformer(magic: MagicString, root: NodePath<TaggedTemplateExpression>) {
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
					const key = `"${ prop.replaceAll(startEndNonWord, '') }"`;
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
	}

	public transform(code: string, id: string) {
		const validTagNames = new Set<string>();

		const stage1 = this.templateParse(validTagNames, code, id);
		const stage2 = this.functionParse(validTagNames, stage1.toString());

		return {
			code: stage2.toString(),
			map:  stage2.generateMap(),
		};
	}

}
