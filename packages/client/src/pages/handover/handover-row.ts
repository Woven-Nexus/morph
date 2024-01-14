import { AegisElement, customElement } from '@roenlie/lit-aegis';
import { css, html } from 'lit';
import { property } from 'lit/decorators.js';

import { InfiniteScroller } from '../../features/infinite-scroller/infinite-scroller.js';


@customElement('m-handover-list', true)
export class HandoverListCmp extends AegisElement {


	public override afterConnectedCallback(): void {
		const scroller = this.shadowRoot!
			.querySelector<HandoverRowScrollerCmp>('m-handover-row-scroller')!;

		scroller.active = true;
	}


	protected override render(): unknown {
		return html`
		<m-handover-row-scroller></m-handover-row-scroller>
		`;
	}

	public static override styles = css`
	:host {
		overflow: hidden;
		display: grid;
	}
	m-handover-row-scroller {
		display: grid;
	}
	m-handover-row-scroller > div {
		display: grid;
	}
	m-handover-row-scroller > div:nth-child(odd) {
		background-color: lime;
	}
	`;

}


@customElement('m-handover-row-scroller', true)
export class HandoverRowScrollerCmp extends InfiniteScroller {

	public override bufferSize = 10;
	protected override minIndex = 0;
	protected override maxIndex = 50;

	protected override createElement(): HTMLElement {
		return document.createElement('m-handover-row');
	}

	protected override updateElement(element: HandoverRowCmp, index: number): void {
		element.value = '' + index;
		if (index < this.minIndex || index > this.maxIndex)
			element.style.setProperty('visibility', 'hidden');
		else
			element.style.setProperty('visibility', '');
	}

	public static override styles = [
		InfiniteScroller.styles,
		css`

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

	public static override styles = [
		css`
		:host {
			display: grid;
		}
		`,
	];

}
