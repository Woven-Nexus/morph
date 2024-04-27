import { css, type CSSResultGroup, customElement, html, LitElement } from '/catalog/assets/vendor/lit/lit.js';


@customElement('m-item-grid')
export class ItemGrid extends LitElement {

	protected override render(): unknown {
		return html`
		Item grid here...
		`;
	}

	public static override styles: CSSResultGroup = [
		css`

		`,
	];

}
