import { customElement, MimicElement } from '@roenlie/mimic-lit/element';
import { css, html } from 'lit';


@customElement('m-studio-tab-panel')
export class StudioTabPanel extends MimicElement {

	protected override render(): unknown {
		return html`
		<header></header>
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
			width: 200px;
		}
		header {
			display: grid;
			height: 60px;
		}
		section {
			display: grid;
			background-color: var(--surface);
		}
		`,
	];

}
