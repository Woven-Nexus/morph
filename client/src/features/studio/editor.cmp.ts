import { consume, type ContextProp } from '@roenlie/lit-context';
import { maybe } from '@roenlie/mimic-core/async';
import { customElement, MimicElement } from '@roenlie/mimic-lit/element';
import { css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { createRef, type Ref, ref } from 'lit/directives/ref.js';
import { editor } from 'monaco-editor';

import { serverUrl } from '../../app/backend-url.js';
import type { DbResponse } from '../../app/response-model.js';
import type { Module } from '../code-module/module-model.js';
import { MonacoEditorCmp } from '../monaco/monaco-editor.cmp.js';
import { sharedStyles } from '../styles/shared-styles.js';
import { EditorTabs } from './editor-tabs.js';
import type { StudioStore } from './studio-store.js';

MonacoEditorCmp.register();
EditorTabs.register();


export interface EditorTab {
	key: string;
	model: editor.ITextModel;
	state: editor.ICodeEditorViewState;
	module: Module;
}


@customElement('m-editor')
export class EditorCmp extends MimicElement {

	@property({ attribute: 'tab-placement', reflect: true })
	public tabPlacement: 'top' | 'left' | 'right' = 'top';

	@consume('store') protected store: ContextProp<StudioStore>;
	protected editorRef: Ref<MonacoEditorCmp> = createRef();

	protected get tabs() {
		return [ ...this.store.value.editorTabs ].map(([ , tab ]) => ({
			key:   tab.key,
			value: tab.module.namespace + '/' + tab.module.name,
		}));
	}

	protected handle = {
		module:   this.onModule.bind(this),
		tabClick: (ev: CustomEvent<string>) => {
			this.store.value.activeModuleId = ev.detail;
		},
	};

	public override connectedCallback() {
		super.connectedCallback();
		import('../monaco/monaco-editor.cmp.js').then(m => m.MonacoEditorCmp.register());

		this.store.value.connect(this, 'activeModuleId', 'editorTabs', 'activeEditorTab');
		this.store.value.listen(this, 'activeModuleId', this.handle.module);
	}

	public override afterConnectedCallback() {
		this.onModule();
	}

	protected async onModule() {
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
		const existingTab = store.editorTabs.get(activeId);
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
				return void (store.activeModuleId = '');

			const newModel = editor.createModel(result.data.code, 'typescript');
			editorRef.setModel(newModel);

			const tab: EditorTab = {
				key:    activeId,
				model:  newModel,
				state:  editorRef.saveViewState()!,
				module: result.data,
			};

			store.editorTabs.set(activeId, tab);
			store.activeEditorTab = tab;
		}

		this.requestUpdate();
		await this.updateComplete;
		this.requestUpdate();

		const tab = this.shadowRoot?.getElementById(activeId);
		tab?.scrollIntoView();
	}

	protected override render() {
		const direction = this.tabPlacement === 'top' ? 'horizontal' : 'vertical';
		const placement = this.tabPlacement === 'left' ? 'start' : 'end';

		return html`
		<m-editor-tabs
			direction=${ direction }
			placement=${ placement }
			.tabs=${ this.tabs }
			.activeTab=${ this.store.value.activeModuleId }
			@m-tab-click=${ this.handle.tabClick }
		></m-editor-tabs>

		<monaco-editor ${ ref(this.editorRef) }
		></monaco-editor>
		`;
	}

	public static override styles = [
		sharedStyles,
		css`
		`,
		css`
		:host {
			overflow: hidden;
			display: grid;
		}
		:host([tab-placement="top"]) {
			grid-template: "tabs" max-content "editor" 1fr / 1fr;
		}
		:host([tab-placement="bottom"]) {
			grid-template: "editor" 1fr "tabs" max-content / 1fr;
		}
		:host([tab-placement="left"]) {
			grid-template: "tabs editor" 1fr / 1fr max-content;
		}
		:host([tab-placement="right"]) {
			grid-template: "editor tabs" 1fr / 1fr max-content;
		}
		m-editor-tabs {
			grid-area: tabs;
			background-color: var(--surface1);
			--m-active-tab-background: var(--surface);
		}
		monaco-editor {
			grid-area: editor;
		}
		`,
	];

}
