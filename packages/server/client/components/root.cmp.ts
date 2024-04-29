import './item-grid.cmp.ts';

import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';


@customElement('m-root')
export class RootElement extends LitElement {

	protected override render(): unknown {
		return html`
		Hello I am Root, this is so cool
		<m-item-grid></m-item-grid>
		`;
	}

}
