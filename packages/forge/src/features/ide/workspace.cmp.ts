import { AegisElement, customElement } from '@roenlie/lit-aegis';
import { html } from 'lit';

@customElement('m-workspace')
export class WorkspaceCmp extends AegisElement {

	protected override render(): unknown {
		return html`
		WORKSPACE
		`;
	}

}
