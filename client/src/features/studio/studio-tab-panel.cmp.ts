import { customElement, MimicElement } from '@roenlie/mimic-lit/element';
import { css, html } from 'lit';
import { queryAssignedElements } from 'lit/decorators.js';


@customElement('m-studio-tab-panel')
export class StudioTabPanel extends MimicElement {

	@queryAssignedElements({ slot: 'tab' }) protected tabs: HTMLElement[];

	public override connectedCallback(): void {
		super.connectedCallback();
		console.log(this.tabs);
	}

	protected override render(): unknown {
		return html`
		<header>
			<slot name="tab"></slot>
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
			overflow: auto;
			display: grid;
			grid-auto-flow: column;
			grid-auto-columns: max-content;
			height: 60px;
			padding-inline: 10px;
			gap: 10px;
			place-items: center start;
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
		::slotted([slot="tab"].active) {
			background-color: var(--surface);
			border-color: var(--background);
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
