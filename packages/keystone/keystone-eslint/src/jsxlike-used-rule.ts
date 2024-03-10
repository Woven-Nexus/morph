import type { TSESLint } from '@typescript-eslint/utils';


const jsxlikeExpr = /<([A-Z]\w+)/g;


const markJsxLikeAsUsed: TSESLint.RuleModule<string> = {
	defaultOptions: [],
	meta:           {
		type:     'suggestion',
		messages: {},
		fixable:  undefined,
		schema:   [], // no options
	},
	create(context) {
		return {
			TaggedTemplateExpression(node) {
				for (const quasi of node.quasi.quasis) {
					const tags = quasi.value.raw.matchAll(jsxlikeExpr);
					for (const [ , tag ] of tags) {
						if (!tag)
							continue;

						context.sourceCode.markVariableAsUsed(tag, node);
					}
				}
			},
		};
	},
};

export default markJsxLikeAsUsed;
