import { expect, test } from 'vitest';

import { splitAttributes } from './attribute-handling.js';

const testString = `id="1" label="label goes here" checked count=4 final=`;


test('something', () => {
	const attributes = splitAttributes(testString);

	console.log(attributes);
});
