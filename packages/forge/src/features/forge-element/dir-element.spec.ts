import { html } from 'lit';
import { expect, test } from 'vitest';

import { dirHtml } from './dir-element.js';


test('hei', () => {
	//const result = html`
	const result = dirHtml`
	<div>
		${ 'something1' }
		<Hello label=${ 'hello' }>
		${ '<span></span>' }
		</Hello>
	</div>
	${ 'something2' }
	`;

	console.log(result);


	expect(result).toBeTruthy();
});
