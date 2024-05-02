import { css, html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import type { IModule } from '../../models/modules-model.js';
import type { MResponse } from '../../models/response.js';


@customElement('m-modules-sidebar')
export class ModulesSidebar extends LitElement {

	@state() protected selectedModule?: IModule;
	@state() protected modules: IModule[] = [];

	public override async connectedCallback() {
		super.connectedCallback();

		const response: MResponse<IModule[]> =
			await (await fetch('/api/modules/all')).json();

		this.modules = response.data ?? [];
	}

	protected override render() {
		return html`
		<ol>
			${ this.modules.map(mod => html`
			<li class="${ mod.module_id === this.selectedModule?.module_id ? 'active' : '' }">
				<button
					void-get="/modules/${ mod.namespace }/${ mod.module_id }"
					void-target="modules-sidebar, modules-form"
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
