import { type Signal, SignalWatcher } from '@lit-labs/preact-signals';
import { css, html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import type { IModule } from '../../models/modules-model.js';
import type { MResponse } from '../../models/response.js';


@customElement('m-modules-sidebar')
export class ModulesSidebar extends SignalWatcher(LitElement) {

	@property({ type: Object })
	public selectedModule: Signal<IModule | undefined>;

	@state() protected modules: IModule[] = [];

	public override async connectedCallback() {
		super.connectedCallback();

		const response: MResponse<IModule[]> =
			await (await fetch('/api/modules/all')).json();

		this.modules = response.data ?? [];
	}

	protected onButtonClick(ev: Event, module: IModule) {
		this.selectedModule.value = module;
		console.log('setting value', module);
	}

	protected override render() {
		return html`
		<ol>
			${ this.modules.map(mod => html`
			<li class="${ mod.module_id === this.selectedModule.value?.module_id ? 'active' : '' }">
				<button
					@click=${ (ev: Event) => this.onButtonClick(ev, mod) }
				>
					${ mod.name }
				</button>
			</li>
			`) }
		</ol>
		`;
	}

	public static override styles = css`
	:host {
		display: block;
		overflow: hidden;
		overflow-y: auto;
	}
	ol {
		all: unset;
		display: block;
		padding-inline-start: 24px;
		padding-block: 24px;
	}
	li {
		all: unset;
		display: block;
	}
	li.active {
		background-color: hotpink;
		outline: 2px dotted red;
		outline-offset: -2px;
	}
	`;

}
