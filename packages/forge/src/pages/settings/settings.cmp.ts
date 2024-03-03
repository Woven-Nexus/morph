import { AegisElement, customElement } from '@roenlie/lit-aegis';
import { html } from 'lit';

import { dirHtml } from '../../features/forge-element/dir-element.js';


const Hello = (props: {label: string; click: () => void}) => {
	console.log({ props });

	return html`
	<button @click=${ props.click }>
		${ props.label }
	</button>
	`;
};


@customElement('m-settings-page', true)
export class EditorPageCmp extends AegisElement {

	public static page = true;

	protected override render(): unknown {
		return html`
		<Hello label="it wurked" @click=${ () => console.log('clickety') } />
		`;
	}

}
