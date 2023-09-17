import { consume, type ContextProp } from '@roenlie/lit-context';
import { maybe } from '@roenlie/mimic-core/async';
import { Alerts } from '@roenlie/mimic-elements/alert';
import { customElement, MimicElement } from '@roenlie/mimic-lit/element';
import { css, html } from 'lit';
import { state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { map } from 'lit/directives/map.js';

import { serverUrl } from '../../app/backend-url.js';
import { type DbResponse } from '../../app/response-model.js';
import type { LayoutStore } from '../layout/layout-store.js';
import type { NamespaceDefinition } from './namespace-model.js';


@customElement('m-namespace-selector')
export class NamespaceSelectorCmp extends MimicElement {

	@consume('store') protected store: ContextProp<LayoutStore>;
	@state() protected namespaceList: NamespaceDefinition[];

	public override async connectedCallback() {
		super.connectedCallback();

		this.store.value.connect(this, 'namespace');

		const url = new URL(serverUrl + '/api/code-modules/namespaces');
		const [ result ] = await maybe<DbResponse<NamespaceDefinition[]>>((await fetch(url)).json());
		if (!result)
			return;

		this.namespaceList = result.data;
	}

	protected override render(): unknown {
		return html`
		<ul>
			${ map(this.namespaceList, item => html`
			<li
				class=${ classMap({ active: item.namespace === this.store.value.namespace }) }
				@click=${ () => this.store.value.namespace = item.namespace }
			>
				${ item.namespace }
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
			overflow: auto;
		}
		li.active {
			background-color: hotpink;
		}
		`,
	];

}


const alertMsg = Alerts.define({ duration: 2000 }).template(alert => html`
	SOMETHING HAPPENED
`);
