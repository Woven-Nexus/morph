import { RuleTester } from '@typescript-eslint/rule-tester';

import markJsxLikeAsUsed from './jsxlike-used-rule.js';


const ruleTester = new RuleTester({
	parser: '@typescript-eslint/parser',
});

ruleTester.run('my-rule', markJsxLikeAsUsed, {
	//valid:   [ 'notFooBar()', 'const foo = 2', 'const bar = 2' ],
	//invalid: [
	//	{
	//		code:   'foo()',
	//		errors: [ { messageId: 'messageIdForSomeFailure' } ],
	//	},
	//	{
	//		code:   'bar()',
	//		errors: [ { messageId: 'messageIdForSomeOtherFailure' } ],
	//	},
	//],
	//valid:   [ 'html`<Hello/>`', 'const Cmp = create();' ],
	valid: [
		'const Cmp = create();'
		+ 'html`<Cmp></Cmp><Cmp/>`',
	],
	invalid: [],
});
