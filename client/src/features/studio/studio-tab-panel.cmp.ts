import { debounce } from '@roenlie/mimic-core/timing';
import { customElement, MimicElement } from '@roenlie/mimic-lit/element';
import { css, html } from 'lit';
import { queryAssignedElements, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import { when } from 'lit/directives/when.js';

import { queryId } from '../../app/queryId.js';
import { sharedStyles } from '../styles/shared-styles.js';


@customElement('m-studio-tab-panel')
export class StudioTabPanel extends MimicElement {

	@queryAssignedElements({ slot: 'tab' }) protected tabs: HTMLElement[];

	public override connectedCallback(): void {
		super.connectedCallback();
	}

	protected override render(): unknown {
		return html`
		<header>
			<s-tab-container>
				<slot name="tab"></slot>
			</s-tab-container>

			<m-studio-action-bar>
				<slot name="action"></slot>
				<slot slot="overflow" name="overflow"></slot>
			</m-studio-action-bar>
		</header>
		<section>
			<slot></slot>
		</section>
		`;
	}

	public static override styles = [
		css`
		:host {
			overflow: hidden;
			display: grid;
			grid-template-rows: max-content 1fr;
		}
		header {
			display: grid;
			grid-auto-flow: column;
			grid-auto-columns: 1fr;
			height: 60px;
			padding-inline: 10px;
			gap: 10px;
		}
		s-tab-container {
			overflow: auto;
			display: grid;
			grid-auto-flow: column;
			grid-auto-columns: max-content;
			gap: 10px;
		}
		s-tab-container {
			place-items: center;
		}
		slot[name="action"] {
			place-items: center;

			direction: rtl;
		}
		::slotted([slot="tab"]) {
			border-radius: 8px;
			padding: 10px;
			text-transform: capitalize;
			border: 1px solid transparent;
		}
		::slotted([slot="tab"]:hover) {
			background-color: var(--surface1);
		}
		::slotted([slot="tab"]:hover:not(:disabled)) {
			cursor: pointer;
		}
		::slotted([slot="tab"].active) {
			background-color: var(--surface);
			border-color: var(--background);
		}
		::slotted([slot="action"]),
		::slotted([slot="overflow"]) {
			all: unset;
    		direction: ltr;
			border-radius: 4px;
			padding: 6px;
			text-transform: capitalize;
			border: 1px solid var(--background);
			background-color: var(--surface1);
		}
		::slotted([slot="action"]:hover),
		::slotted([slot="overflow"]:hover) {
			background-color: var(--background);
		}
		::slotted([slot="action"]:active),
		::slotted([slot="overflow"]:active) {
			background-color: var(--surface1);
		}
		::slotted([slot="action"]:hover:not(:disabled)),
		::slotted([slot="overflow"]:hover:not(:disabled)) {
			cursor: pointer;
		}
		::slotted([slot="action"]:first-child),
		::slotted([slot="overflow"]:first-child) {
			margin-left: auto;
		}
		section {
			overflow: hidden;
			display: grid;
			background-color: var(--surface);
			border: 1px solid var(--background);
			border-radius: 8px;
		}
		`,
	];

}


interface SlotActionElement extends HTMLElement {
	previousSlot?: string;
}


@customElement('m-studio-action-bar')
export class StudioActionBar extends MimicElement {

	@state() protected ready = false;
	@state() protected overflowOpen = false;
	@queryId('wrapper') protected wrapperEl?: HTMLElement;

	@queryAssignedElements({ flatten: true })
	protected slotContent: SlotActionElement[];

	@queryAssignedElements({ slot: 'overflow', flatten: true })
	protected overflowSlot: SlotActionElement[];

	protected resizeObs = new ResizeObserver(([ entry ]) => {
		const hostRect = entry?.contentRect;
		if (!hostRect)
			return;

		this.updateSlotNames();
	});

	public override connectedCallback(): void {
		super.connectedCallback();
	}

	public override afterConnectedCallback(): void {
		this.updateSlotNames();
		this.resizeObs.observe(this);
	}

	protected updateSlotNames() {
		const hostRect = this.getBoundingClientRect();
		if (!this.wrapperEl || !hostRect)
			return;

		let wrapperRect: DOMRect;
		do {
			wrapperRect = this.wrapperEl.getBoundingClientRect();
			const els = this.slotContent;

			if (wrapperRect.width < hostRect.width) {
				const firstOverflowEl = this.overflowSlot.at(0);
				if (firstOverflowEl)
					firstOverflowEl.slot = firstOverflowEl.previousSlot ?? '';
			}

			if (wrapperRect.width > hostRect.width) {
				const el = els.at(-1)!;
				el.previousSlot = el.slot;
				el.slot = 'overflow';
			}

			wrapperRect = this.wrapperEl.getBoundingClientRect();
		} while (wrapperRect.width > hostRect.width);

		this.updateComplete.then(() => void this.requestUpdate());
	}

	protected slotChanged(ev: Event) {
		console.log(
			'slot changed',
			ev,
		);
	}

	protected override render(): unknown {
		return html`
		<s-wrapper id="wrapper" class=${ classMap({ 'not-ready': !this.ready }) }>
			<slot @slotchange=${ this.slotChanged }></slot>
			${ when(this.overflowSlot.length, () => html`
			<button @click=${ () => this.overflowOpen = !this.overflowOpen }>...</button>
			`) }
		</s-wrapper>

		<s-popout style=${ styleMap({
			display: this.overflowOpen ? '' : 'none',
		}) }>
			<slot name="overflow"></slot>
		</s-popout>
		`;
	}

	public static override styles = [
		sharedStyles,
		css`
		:host {
			overflow: hidden;
			display: grid;
			grid-auto-columns: max-content;
			grid-auto-flow: column;
			place-content: center end;
		}
		s-wrapper {
			display: grid;
			grid-auto-flow: column;
			grid-auto-columns: max-content;
			place-items: center;
			gap: 8px;
		}
		s-wrapper.not-ready {
			/*opacity: 0;*/
		}
		s-popout {
			position: fixed;
			overflow: auto;
			background-color: green;
			display: grid;
			grid-auto-flow: row;
			grid-auto-rows: max-content;
			width: max-content;
			z-index: 1;
			max-height: 200px;
		}
		`,
	];

}
StudioActionBar.register();
