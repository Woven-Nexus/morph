import { RuleTester } from '@typescript-eslint/rule-tester';
import { afterAll, describe, it } from 'vitest';


RuleTester.afterAll = afterAll;
// if you are not using vitest with globals: true
RuleTester.it = it;
RuleTester.itOnly = it.only;
RuleTester.describe = describe;
