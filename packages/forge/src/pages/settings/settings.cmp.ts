import { AegisElement, customElement } from '@roenlie/lit-aegis';
import { html } from 'lit';


@customElement('m-settings-page', true)
export class EditorPageCmp extends AegisElement {

	public static page = true;

	protected override render(): unknown {
		return html`
		SETTINGS
		`;
	}

}
