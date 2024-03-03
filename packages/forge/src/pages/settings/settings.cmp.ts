import { AegisElement, customElement } from '@roenlie/lit-aegis';
import { html } from 'lit';

import { dirHtml } from '../../features/forge-element/dir-element.js';


const Hello = (props: Record<keyof any, any>) => {
	console.log({ props });

	return html`
	Hello
	`;
};


@customElement('m-settings-page', true)
export class EditorPageCmp extends AegisElement {

	public static page = true;

	protected override render(): unknown {
		return html`
		<Hello label="nei" />
		`;
	}

}
