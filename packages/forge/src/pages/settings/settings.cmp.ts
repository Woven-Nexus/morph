import { AegisElement, customElement } from '@roenlie/lit-aegis';
import { html } from 'lit';

import { dirHtml } from '../../features/forge-element/dir-element.js';


//const result = dirHtml`
//	<div>
//		${ 'something1' }
//		<Hello label=${ 'hello' }>
//		${ '<span></span>' }
//		</Hello>
//	</div>
//	${ 'something2' }
//	`;
//const result = dirHtml`<div><Hello></Hello></div>`;
const result = dirHtml`<div><Hello>${ 'jaman' }</Hello></div>`;

console.log(result);


@customElement('m-settings-page', true)
export class EditorPageCmp extends AegisElement {

	public static page = true;

	protected override render(): unknown {
		return html`
		${ result }
		`;
	}

}
