import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';


@customElement('m-tables-body')
export class TablesBody extends LitElement {

	protected override render() {
		return html`
		<aside>
			<!-- tables list -->
		</aside>
		<main>
			<!-- tables contents -->
		</main>
		`;
	}

	public static override styles = css`
	:host {
		overflow: hidden;
		display: grid;
		grid-template-columns: max-content 1fr;
		grid-template-rows: 1fr;
		grid-auto-rows: 0px;
	}
	aside {
		overflow: hidden;
		background-color: teal;
		display: grid;
		grid-template-rows: max-content 1fr;
	}
	main {
		overflow: hidden;
		display: grid;
		grid-template-rows: 1fr;

		& > * {
			grid-row: 1/2;
			grid-column: 1/2;
		}
	}
	`;

}
