import { consume, type ContextProp } from '@roenlie/lit-context';
import { maybe } from '@roenlie/mimic-core/async';
import { customElement, MimicElement } from '@roenlie/mimic-lit/element';
import { css, html } from 'lit';
import { state } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import { createRef, type Ref, ref } from 'lit/directives/ref.js';
import { editor } from 'monaco-editor';

import { serverUrl } from '../../app/backend-url.js';
import type { DbResponse } from '../../app/response-model.js';
import type { Module } from '../code-module/module-model.js';
import type { LayoutStore } from '../layout/layout-store.js';
import { MonacoEditorCmp } from '../monaco/monaco-editor.cmp.js';
import { sharedStyles } from '../styles/shared-styles.js';

MonacoEditorCmp.register();

interface EditorTab {
	key: string;
	model: editor.ITextModel;
	state: editor.ICodeEditorViewState;
	module: Module;
}


@customElement('m-editor')
export class EditorCmp extends MimicElement {

	@consume('store') protected store: ContextProp<LayoutStore>;
	@state() protected tabs = new Map<string, EditorTab>();
	@state() protected activeTab?: EditorTab;
	protected editorRef: Ref<MonacoEditorCmp> = createRef();

	public override connectedCallback(): void {
		super.connectedCallback();
		import('../monaco/monaco-editor.cmp.js').then(m => m.MonacoEditorCmp.register());

		this.store.value.connect(this, 'activeModuleId');
		this.store.value.listen(this, 'activeModuleId', this.onModule);
	}

	protected onModule = async () => {
		const store = this.store.value;
		const activeId = store.activeModuleId;
		if (!activeId)
			return;

		await this.updateComplete;
		await this.editorRef.value?.editorReady;

		const editorRef = this.editorRef.value?.editor;
		if (!editorRef)
			return;

		// Move to selected tab
		const existingTab = this.tabs.get(activeId);
		if (existingTab) {
			editorRef.setModel(existingTab.model);
			editorRef.restoreViewState(existingTab.state);
			editorRef.focus();
		}
		// Create tab as it does not exist.
		else {
			const namespace = store.activeNamespace;
			if (!namespace)
				return;

			const url = new URL(serverUrl + `/api/code-modules/${ namespace }/${ activeId }`);
			const [ result ] = await maybe<DbResponse<Module>>((await fetch(url)).json());
			if (!result)
				return store.activeModuleId = '';

			const newModel = editor.createModel(result.data.code, 'typescript');
			editorRef.setModel(newModel);

			const tab: EditorTab = {
				key:    activeId,
				model:  newModel,
				state:  editorRef.saveViewState()!,
				module: result.data,
			};

			this.tabs.set(activeId, tab);
			this.activeTab = tab;
		}
	};

	protected override render(): unknown {
		return html`
		<s-tabs>
		${ map(this.tabs, ([ , tab ]) => html`
			<s-tab @click=${ () => this.store.value.activeModuleId = tab.key }>
				${ tab.module.namespace + '/' + tab.module.name }
			</s-tab>
		`) }
		</s-tabs>
		<monaco-editor ${ ref(this.editorRef) }></monaco-editor>
		`;
	}

	public static override styles = [
		sharedStyles,
		css`
		:host {
			overflow: hidden;
			display: grid;
			grid-template-rows: max-content 1fr;
		}
		s-tabs {
			display: flex;
			flex-flow: row wrap;
			border-bottom: 3px solid var(--shadow1);
			min-height: 40px;
		}
		s-tab {
			display: inline-flex;
			align-items: center;
			border: 3px solid var(--shadow1);
			padding-inline: 4px;
			margin-right: -3px;
			margin-bottom: -3px;
			height: 40px;
		}
		`,
	];

}
