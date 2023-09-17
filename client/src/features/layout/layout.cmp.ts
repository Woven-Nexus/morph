import { provide } from '@roenlie/lit-context';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import { ModuleSelectorCmp } from '../code-module/module-selector.js';
import { NamespaceSelectorCmp } from '../code-module/namespace-selector.js';
import { EditorCmp } from '../editor/editor.cmp.js';
import { LayoutStore } from './layout-store.js';

NamespaceSelectorCmp.register();
ModuleSelectorCmp.register();
EditorCmp.register();


@customElement('app-layout')
export class LayoutCmp extends LitElement {

	@provide('store') protected store = new LayoutStore();

	public override connectedCallback(): void {
		super.connectedCallback();
	}

	protected override render(): unknown {
		return html`
		<aside></aside>
		<main>
			<m-namespace-selector></m-namespace-selector>
			<m-module-selector></m-module-selector>
			<m-editor></m-editor>
		</main>
		`;
	}

	public static override styles = [
		css`
		:host {
			overflow: hidden;
			display: grid;
			grid-template-columns: auto 1fr;
		}
		aside {
			width: 200px;
			background-color: teal;
		}
		main {
			overflow: hidden;
			display: grid;
			grid-template: "namespace module" 30%
				"editor editor" 1fr
				/ 1fr 2fr;
		}
		m-namespace-selector {
			grid-area: namespace;
			background-color: rgb(0 0 0 / 20%);
		}
		m-module-selector {
			grid-area: module;
		}
		m-editor {
			grid-area: editor;
		}
		`,
	];

}
