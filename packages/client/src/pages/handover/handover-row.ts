import { AegisElement, customElement } from '@roenlie/lit-aegis';
import { css, html } from 'lit';
import { property } from 'lit/decorators.js';

import { InfiniteScroller } from '../../features/infinite-scroller/infinite-scroller.js';


@customElement('m-handover-row-scroller', true)
export class HandoverRowScrollerCmp extends InfiniteScroller {

	public override bufferSize = 10;
	protected override maxIndex = 50;
	public override blockNegativeIndex = true;

	protected override createElement(): HTMLElement {
		return document.createElement('m-handover-row');
	}

	protected override updateElement(element: HandoverRowCmp, index: number): void {
		element.value = '' + index;
		if (index < 0 || index > this.maxIndex) {
			//
			element.style.setProperty('visibility', 'hidden');
		}
		else {
			element.style.setProperty('visibility', '');
		}


		//console.log('update element?');
	}

	public static override styles = [
		InfiniteScroller.styles,
		css`
		:host {
			width: 500px;
			border: 2px solid green;
		}
		`,
	];

}


@customElement('m-handover-row', true)
export class HandoverRowCmp extends AegisElement {

	@property() public value = '';

	protected override render(): unknown {
		return html`
		WHAT IS THIS: ${ this.value }
		`;
	}

}
