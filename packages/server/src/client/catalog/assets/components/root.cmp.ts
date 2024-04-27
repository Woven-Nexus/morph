import './item-grid.cmp.js';

import { customElement, html, LitElement } from '/catalog/assets/vendor/lit/lit.js';


@customElement('m-root')
export class RootElement extends LitElement {

	protected override render(): unknown {
		return html`
		Hello I am Root
		<m-item-grid></m-item-grid>
		`;
	}

}
