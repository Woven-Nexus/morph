import { customElement, MimicElement } from '@roenlie/mimic-lit/element';
import { css, html } from 'lit';
import { queryAssignedElements, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
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
		::slotted([slot="action"]) {
			all: unset;
    		direction: ltr;
			border-radius: 4px;
			padding: 6px;
			text-transform: capitalize;
			border: 1px solid var(--background);
			background-color: var(--surface1);
		}
		::slotted([slot="action"]:hover) {
			background-color: var(--background);
		}
		::slotted([slot="action"]:active) {
			background-color: var(--surface1);
		}
		::slotted([slot="action"]:hover:not(:disabled)) {
			cursor: pointer;
		}
		::slotted([slot="action"]:first-child) {
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


@customElement('m-studio-action-bar')
export class StudioActionBar extends MimicElement {

	@state() protected overflow = false;
	@state() protected ready = false;
	@queryId('wrapper') protected wrapperEl?: HTMLElement;

	public override connectedCallback(): void {
		this.setAttribute('not-ready', '');
		super.connectedCallback();
	}

	public override afterConnectedCallback(): void {
		console.log('after connected');

		const hostRect = this.getBoundingClientRect();
		const wrapperRect = this.wrapperEl?.getBoundingClientRect();
		console.log(hostRect.width, wrapperRect?.width);
	}

	protected slotChanged() {
		console.log('slot changed');
	}

	protected override render(): unknown {
		return html`
		<s-wrapper id="wrapper" class=${ classMap({ 'not-ready': !this.ready }) }>
			<slot @slotchange=${ this.slotChanged }></slot>
			${ when(this.overflow, () => html`
			<button>...</button>
			`) }
		</s-wrapper>
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
		`,
	];

}
StudioActionBar.register();
