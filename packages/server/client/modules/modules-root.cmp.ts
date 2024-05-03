import './modules-sidebar.cmp.ts';
import './modules-form.cmp.ts';

import { signal, SignalWatcher } from '@lit-labs/preact-signals';
import { css, html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import type { IModule } from '../../models/modules-model.js';


@customElement('m-modules-root')
export class ModulesRoot extends SignalWatcher(LitElement) {

	@state() protected selectedModule = signal<IModule | undefined>(undefined);

	protected override render() {
		return html`
		<aside>
			<button>
				New
			</button>
			<m-modules-sidebar
				.selectedModule=${ this.selectedModule }
			></m-modules-sidebar>
		</aside>
		<main>
			<m-modules-form
				.selectedModule=${ this.selectedModule }
			></m-modules-form>
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
		width: 200px;
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
