import { consume, type ContextProp } from '@roenlie/lit-context';
import { maybe } from '@roenlie/mimic-core/async';
import { customElement, MimicElement } from '@roenlie/mimic-lit/element';
import { css, html } from 'lit';
import { state } from 'lit/decorators.js';

import { serverUrl } from '../../app/backend-url.js';
import type { DbResponse } from '../../app/response-model.js';
import type { Module } from '../code-module/module-model.js';
import type { ModuleNamespace, NamespaceDefinition } from '../code-module/namespace-model.js';
import type { LayoutStore } from '../layout/layout-store.js';
import { sharedStyles } from '../styles/shared-styles.js';
import { DragHandleCmp } from './drag-handle.cmp.js';
import { EditorCmp } from './editor.cmp.js';
import { ModuleNavSelector } from './module-nav-selector.cmp.js';
import { StudioTabPanel } from './studio-tab-panel.cmp.js';

EditorCmp.register();
DragHandleCmp.register();
StudioTabPanel.register();
ModuleNavSelector.register();


@customElement('m-editor-panel')
export class EditorPanel extends MimicElement {

	@consume('store') protected store: ContextProp<LayoutStore>;
	@state() protected namespaceKeyValues: {key: string; value: string}[] = [];
	@state() protected modulesKeyValues: {key: string; value: string}[] = [];
	@state() protected activeKeyValues: {key: string; value: string}[] = [];
	protected namespaceList: NamespaceDefinition[] = [];
	protected moduleList: ModuleNamespace[] = [];

	public override connectedCallback() {
		super.connectedCallback();

		const store = this.store.value;
		store.connect(this, 'activeNamespace', 'activeModuleId');
		store.listen(this, 'activeNamespace', () => this.populateModuleList());
		store.listen(this, 'availableNamespaces', () => {
			const namespaces = this.store.value.availableNamespaces;
			this.namespaceKeyValues = namespaces.map(def =>
				({ key: def.namespace, value: def.namespace }));
		});

		store.listen(this, 'availableModules', () => {
			const modules = this.store.value.availableModules;
			this.modulesKeyValues = modules.map(def =>
				({ key: def.module_id.toString(), value: def.name }));
		});

		this.populateNamespaceList();
	}

	protected async populateNamespaceList() {
		const store = this.store.value;

		const url = new URL(serverUrl + '/api/code-modules/namespaces');
		const [ result ] = await maybe<DbResponse<NamespaceDefinition[]>>((await fetch(url)).json());
		if (!result)
			return;

		store.availableNamespaces = result.data;
	}

	protected async populateModuleList() {
		const store = this.store.value;
		if (!store.activeNamespace)
			return this.moduleList = [];

		const url = new URL(serverUrl + `/api/code-modules/${ store.activeNamespace }`);
		const [ result ] = await maybe<DbResponse<ModuleNamespace[]>>((await fetch(url)).json());
		if (!result)
			return void (store.availableModules = []);

		store.availableModules = result.data;
	}

	protected selectNamespace(ev: HTMLElementEventMap['m-nav-select-key']) {
		this.store.value.activeNamespace = ev.detail;
	}

	protected async selectModule(ev: HTMLElementEventMap['m-nav-select-key']) {
		const store = this.store.value;
		store.activeModuleId = ev.detail;
	}

	protected renderFullWidth() {
		return html`
		<s-fullwidth>
			<s-nav-panel>
				<m-module-nav-selector
					header="Namespaces"
					.activeItem=${ this.store.value.activeNamespace }
					.items=${ this.namespaceKeyValues }
					@m-nav-select-key=${ this.selectNamespace }
				></m-module-nav-selector>

				<m-drag-handle class="horizontal"></m-drag-handle>

				<m-module-nav-selector
					header="Modules"
					.activeItem=${ this.store.value.activeModuleId }
					.items=${ this.modulesKeyValues }
					@m-nav-select-key=${ this.selectModule }
				></m-module-nav-selector>
			</s-nav-panel>

			<m-drag-handle class="vertical"></m-drag-handle>

			<m-editor></m-editor>

			<m-drag-handle class="vertical"></m-drag-handle>

			<m-studio-tab-panel></m-studio-tab-panel>
		</s-fullwidth>
		`;
	}

	protected override render(): unknown {
		return html`
		${ this.renderFullWidth() }
		`;
	}

	public static override styles = [
		sharedStyles,
		css`
		:host {
			overflow: hidden;
			display: grid;
			margin-block: 10px;
			background-color: var(--shadow1);
			padding: 8px;
			border: 1px solid var(--background-strong);
			border-radius: 12px;
		}
		s-fullwidth {
			overflow: hidden;
			display: grid;
			grid-template-columns: 250px 20px 1fr 20px max-content;
		}
		s-nav-panel {
			--namespace-height: 1fr;
			--module-height: 2fr;
			overflow: hidden;
			display: grid;
			grid-template-rows: var(--namespace-height)
				20px var(--module-height);
			padding-right: 8px;
		}
		m-module-nav-selector:not(:last-of-type) {
			padding-bottom: 8px;
		}
		m-editor {
			background-color: var(--surface);
			border: 1px solid var(--background);
			border-inline: none;
		}
		m-drag-handle {
			background-color: var(--background);
		}
		m-drag-handle.vertical:first-of-type {
			border-top-left-radius: 8px;
			border-bottom-left-radius: 8px;
		}
		m-drag-handle.vertical:last-of-type {
			border-top-right-radius: 8px;
			border-bottom-right-radius: 8px;
		}
		m-drag-handle.horizontal {
			border-radius: 8px;
		}
		m-studio-tab-panel {
			padding-left: 8px;
		}
		`,
	];

}
