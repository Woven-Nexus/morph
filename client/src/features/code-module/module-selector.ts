import { consume, type ContextProp } from '@roenlie/lit-context';
import { maybe } from '@roenlie/mimic-core/async';
import { customElement, MimicElement } from '@roenlie/mimic-lit/element';
import { css, html } from 'lit';
import { state } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';

import { serverUrl } from '../../app/backend-url.js';
import { type DbResponse } from '../../app/response-model.js';
import type { LayoutStore } from '../layout/layout-store.js';
import type { ModuleNamespace } from './namespace-model.js';


@customElement('m-module-selector')
export class ModuleSelectorCmp extends MimicElement {

	@consume('store') protected store: ContextProp<LayoutStore>;
	@state() protected moduleList: ModuleNamespace[];

	public override connectedCallback(): void {
		super.connectedCallback();

		this.store.value.connect(this, 'namespace');
		this.store.value.listen(this, 'namespace', this.handleNamespace);
	}

	protected handleNamespace = async () => {
		const store = this.store.value;
		if (!store.namespace)
			return this.moduleList = [];

		const url = new URL(serverUrl + `/api/code-modules/${ store.namespace }`);
		const [ result ] = await maybe<DbResponse<ModuleNamespace[]>>((await fetch(url)).json());
		if (!result)
			return;

		this.moduleList = result.data;
	};

	protected override render(): unknown {
		return html`
		<ul>
			${ map(this.moduleList, item => html`
			<li
				@click=${ () => this.store.value.moduleId = item.module_id }
			>
				${ item.name }
			</li>
			`) }
		</ul>
		`;
	}

	public static override styles = [
		css`
		:host {
			display: grid;
		}
		ul, li {
			all: unset;
			display: block;
		}
		ul {
			overflow-y: auto;
		}

		`,
	];

}
