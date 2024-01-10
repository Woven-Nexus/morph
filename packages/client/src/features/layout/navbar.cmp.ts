import { customElement, MimicElement } from '@roenlie/mimic-lit/element';
import { css, html } from 'lit';


@customElement('m-navbar')
export class NavbarCmp extends MimicElement {

	protected override render(): unknown {
		return html`

		`;
	}

	public static override styles = [
		css`
		:host {
			display: grid;
			width: 80px;
			background-color: var(--surface1);
			border-right: 1px solid var(--shadow1);
		}
		`,
	];

}
