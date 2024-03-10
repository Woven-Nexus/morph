import type { TSESLint } from '@typescript-eslint/utils';

import markJsxLikeAsUsed from './jsxlike-used-rule.js';

export const rules = {
	'mark-as-used': markJsxLikeAsUsed,
} satisfies Record<string, TSESLint.RuleModule<string, unknown[]>>;
