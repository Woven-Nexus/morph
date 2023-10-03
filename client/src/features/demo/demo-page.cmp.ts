import { customElement, MimicElement } from '@roenlie/mimic-lit/element';
import { css, html } from 'lit';

import { VirtualScrollbar } from '../studio/virtual-scrollbar.cmp.js';

VirtualScrollbar.register();


@customElement('m-demo-page')
export class Demopage extends MimicElement {

	protected override render(): unknown {
		//<m-virtual-scrollbar
		//	direction="vertical"
		//	placement="end"
		//	.reference=${ this.updateComplete.then(() => this.renderRoot.querySelector('s-wrapper'))  }
		//></m-virtual-scrollbar>
		return html`
		<s-wrapper>
			<s-block></s-block>
			<m-virtual-scrollbar
				direction="horizontal"
				placement="start"
				.reference=${ this.updateComplete.then(() => this.renderRoot.querySelector('s-wrapper'))  }
			></m-virtual-scrollbar>
		</s-wrapper>
		`;
	}

	public static override styles = [
		css`
		s-wrapper {
			position: relative;
			display: block;
			height: 200px;
			width: 200px;
			background-color: lime;
			overflow: scroll;
		}
		s-block {
			display: block;
			/*height: 600px;*/
			width: 600px;
		}
		`,
	];

}
