import { customElement, MimicElement } from '@roenlie/mimic-lit/element';
import { css, html } from 'lit';


@customElement('m-studio-tab-panel')
export class StudioTabPanel extends MimicElement {

	protected override render(): unknown {
		return html`
		<header>
			<s-tab class="active">Details</s-tab>
			<s-tab>History</s-tab>
		</header>
		<section>
			STUDIO TAB PANEL
		</section>
		`;
	}

	public static override styles = [
		css`
		:host {
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
		s-tab {
			border-radius: 8px;
			padding: 10px;
		}
		s-tab.active {
			background-color: var(--surface);
			border: 1px solid var(--background);
		}
		section {
			display: grid;
			background-color: var(--surface);
			border: 1px solid var(--background);
			border-radius: 8px;
		}
		`,
	];

}
