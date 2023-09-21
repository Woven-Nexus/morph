import { consume, type ContextProp } from '@roenlie/lit-context';
import { maybe } from '@roenlie/mimic-core/async';
import type { EventOf } from '@roenlie/mimic-core/dom';
import { customElement, MimicElement } from '@roenlie/mimic-lit/element';
import { css, html } from 'lit';
import { eventOptions, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { map } from 'lit/directives/map.js';
import { createRef, type Ref, ref } from 'lit/directives/ref.js';
import { styleMap } from 'lit/directives/style-map.js';
import { editor } from 'monaco-editor';

import { serverUrl } from '../../app/backend-url.js';
import { queryId } from '../../app/queryId.js';
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
	@queryId('tabs') protected tabsEl: HTMLElement;
	@queryId('scrollbar') protected scrollbarEl: HTMLElement;
	protected editorRef: Ref<MonacoEditorCmp> = createRef();
	protected resizeObs = new ResizeObserver(() => this.requestUpdate());

	public override connectedCallback(): void {
		super.connectedCallback();
		import('../monaco/monaco-editor.cmp.js').then(m => m.MonacoEditorCmp.register());

		this.store.value.connect(this, 'activeModuleId');
		this.store.value.listen(this, 'activeModuleId', this.onModule);
		this.resizeObs.observe(this);
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

		this.requestUpdate();
		await this.updateComplete;
		this.requestUpdate();

		const tab = this.shadowRoot?.getElementById(activeId);
		tab?.scrollIntoView();
	};

	protected onTabClick(ev: EventOf, tab: EditorTab) {
		const store = this.store.value;
		store.activeModuleId = tab.key;
	}

	protected onTabWheel(ev: WheelEvent) {
		const scrollbar = this.scrollbarEl;
		if (scrollbar)
			scrollbar.scrollLeft += ev.deltaY;
	}

	@eventOptions({ passive: true })
	protected onTabScroll() {
		const tabs = this.tabsEl, scrollbar = this.scrollbarEl;
		if (!scrollbar || !tabs)
			return;

		scrollbar.scrollLeft = tabs.scrollLeft;
		this.requestUpdate();
	}

	@eventOptions({ passive: true })
	protected onScrollbarScroll() {
		const tabs = this.tabsEl, scrollbar = this.scrollbarEl;
		if (!scrollbar || !tabs)
			return;

		tabs.scrollLeft = scrollbar.scrollLeft;
		this.requestUpdate();
	}

	protected override render(): unknown {
		const store = this.store.value;
		const tabsEl = this.tabsEl;
		const scrollContainerLeft = (tabsEl?.scrollLeft ?? 0) + 'px';
		const scrollContainerWidth = (tabsEl?.offsetWidth ?? 0) + 'px';
		const scrollbarWidth = (tabsEl?.scrollWidth ?? 0) + 'px';

		return html`
		<s-tabs id="tabs" @scroll=${ this.onTabScroll } @wheel=${ this.onTabWheel }>
			<s-scrollbar
				id="scrollbar"
				style=${ styleMap({ width: scrollContainerWidth, left: scrollContainerLeft }) }
				@scroll=${ this.onScrollbarScroll }
			>
				<s-scrollthumb style=${ styleMap({ width: scrollbarWidth }) }
				></s-scrollthumb>
			</s-scrollbar>

			${ map(this.tabs, ([ , tab ]) => html`
			<s-tab
				id=${ tab.key }
				class=${ classMap({ active: tab.key === store.activeModuleId }) }
				@click=${ (ev: EventOf) => this.onTabClick(ev, tab) }>
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
			position: relative;
			display: grid;
			grid-auto-flow: column;
			grid-auto-columns: max-content;
			min-height: 40px;
			font-size: 12px;
			overflow: hidden;
			overflow-x: scroll;
		}
		s-tabs::-webkit-scrollbar {
			display: none;
		}
		s-scrollbar {
			display: block;
			position: absolute;
			overflow-x: scroll;
			bottom: 0px;
			opacity: 0;
			transition: opacity 0.2s ease-out;
		}
		s-tabs:hover s-scrollbar {
			opacity: 1;
		}
		s-scrollbar::-webkit-scrollbar {
			height: 4px;
		}
		s-scrollthumb {
			display: block;
			height:4px;
		}
		s-tab {
			display: inline-flex;
			align-items: center;
			border: 3px solid var(--shadow1);
			border-bottom: none;
			padding-inline: 4px;
			margin-right: -3px;
			height: 40px;
			background-color: var(--background);
		}
		s-tab.active {
			background-color: initial;
		}
		`,
	];

}
