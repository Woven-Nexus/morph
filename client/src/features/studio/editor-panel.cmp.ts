import { consume, type ContextProp } from '@roenlie/lit-context';
import { maybe } from '@roenlie/mimic-core/async';
import { MMButton } from '@roenlie/mimic-elements/button';
import { customElement, MimicElement } from '@roenlie/mimic-lit/element';
import { html, LitElement } from 'lit';
import { query, state } from 'lit/decorators.js';
import { choose } from 'lit/directives/choose.js';
import { classMap } from 'lit/directives/class-map.js';
import { map } from 'lit/directives/map.js';
import { editor } from 'monaco-editor';

import { serverUrl } from '../../app/backend-url.js';
import type { DbResponse } from '../../app/response-model.js';
import type { Module } from '../code-module/module-model.js';
import type { ModuleNamespace, NamespaceDefinition } from '../code-module/namespace-model.js';
import { sharedStyles } from '../styles/shared-styles.js';
import { DragHandleCmp } from './drag-handle.cmp.js';
import { EditorCmp, type EditorTab } from './editor.cmp.js';
import styles from './editor-panel.ccss';
import { ModuleNavSelector } from './module-nav-selector.cmp.js';
import type { StudioStore } from './studio-store.js';
import { StudioTabPanel } from './studio-tab-panel.cmp.js';

MMButton.register();
EditorCmp.register();
DragHandleCmp.register();
StudioTabPanel.register();
ModuleNavSelector.register();


@customElement('m-editor-panel')
export class EditorPanel extends MimicElement {

	@consume('store') protected store: ContextProp<StudioStore>;
	@query('m-editor') protected editorQry?: EditorCmp;
	@state() protected namespaceKeyValues: {key: string; value: string}[] = [];
	@state() protected modulesKeyValues: {key: string; value: string}[] = [];
	@state() protected activeKeyValues: {key: string; value: string}[] = [];
	@state() protected uiMode: 'large'|'medium'|'small' = 'large';
	@state() protected activeTab: 'none'|'editor'|'details'|'history' = 'none';
	protected namespaceList: NamespaceDefinition[] = [];
	protected moduleList: ModuleNamespace[] = [];
	protected previousUiMode = this.uiMode;
	protected resizeObs = new ResizeObserver(([ entry ]) => {
		if (!entry)
			return;

		const newUIMode = this.getUiMode(entry.contentRect.width);
		if (this.uiMode === newUIMode)
			return;

		this.uiMode = newUIMode;

		const moduleActive = !!this.store.value.activeModuleId;
		if (!moduleActive)
			return;

		if (newUIMode === 'medium')
			this.activeTab = 'editor';
		if (newUIMode === 'large' && this.activeTab === 'editor')
			this.activeTab = 'details';
	});

	protected tabLists = {
		large:  [ 'details', 'history' ],
		medium: [ 'editor', 'details', 'history' ],
		small:  [],
	} as const;

	protected drag = new EditorPanelDrag(this);

	public override connectedCallback() {
		super.connectedCallback();
		this.resizeObs.observe(this);

		const store = this.store.value;
		store.connect(this, 'activeNamespace', 'activeModuleId', 'editorTabs');
		store.listen(this, 'activeNamespace', () => this.populateModuleList());
		store.listen(this, 'availableNamespaces',  this.setNamespaceKeyValues);
		store.listen(this, 'availableModules', this.setModulesKeyValues);
		store.listen(this, 'activeModuleId', () => this.onActiveModuleId());
		store.listen(this, 'editorTabs', this.setActiveKeyValues);

		this.populateNamespaceList();
	}

	public override disconnectedCallback(): void {
		super.disconnectedCallback();
		this.resizeObs.unobserve(this);
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

	protected onActiveModuleId() {
		this.updateEditorTabs();
	}

	protected async updateEditorTabs() {
		const store = this.store.value;
		const activeId = store.activeModuleId;
		if (!activeId)
			return;

		// Create tab as it does not exist.
		const existingTab = store.editorTabs.get(activeId);
		if (existingTab)
			return void (store.activeEditorTab = existingTab);

		const namespace = store.activeNamespace;
		if (!namespace)
			return;

		const url = new URL(serverUrl + `/api/code-modules/${ namespace }/${ activeId }`);
		const [ result ] = await maybe<DbResponse<Module>>((await fetch(url)).json());
		if (!result)
			return void (store.activeModuleId = '');

		const newModel = editor.createModel(result.data.code, 'typescript');
		const tab: EditorTab = {
			key:    activeId,
			model:  newModel,
			state:  defaultEditorState(),
			module: result.data,
		};

		store.update('editorTabs', tabs => void tabs.set(activeId, tab));
		store.activeEditorTab = tab;
	}

	protected getUiMode(width: number) {
		if (width <= 450)
			return 'small';
		else if (width <= 1440)
			return 'medium';
		else
			return 'large';
	}

	protected setNamespaceKeyValues = () => {
		const namespaces = this.store.value.availableNamespaces;
		this.namespaceKeyValues = namespaces.map(def =>
			({ key: def.namespace, value: def.namespace }));
	};

	protected setModulesKeyValues = () => {
		const modules = this.store.value.availableModules;
		this.modulesKeyValues = modules.map(def =>
			({ key: def.module_id.toString(), value: def.name }));
	};

	protected setActiveKeyValues = () => {
		const store = this.store.value;
		this.activeKeyValues = [ ...store.editorTabs ].map(([ , tab ]) =>
			({ key: tab.key, value: tab.module.namespace + '/' + tab.module.name }));

		if (this.store.value.activeModuleId) {
			if (this.activeTab === 'none')
				this.activeTab = 'editor';
		}
		else {
			this.activeTab = 'none';
		}
	};

	protected renderTabPanel() {
		if (!this.store.value.activeModuleId) {
			return html`
			<m-studio-tab-panel>
				<s-placeholder>
					Select a module...
				</s-placeholder>
			</m-studio-tab-panel>
			`;
		}

		return html`
		<m-studio-tab-panel>
			${ map(this.tabLists[this.uiMode], tab => html`
			<s-tab
				slot="tab"
				class=${ classMap({ active: this.activeTab === tab }) }
				@click=${ () => this.activeTab = tab }
			>
				${ tab }
			</s-tab>
			`) }

			${ choose(this.activeTab, [
				[
				'editor', () => html`
					<m-editor
						tab-placement="none"
					></m-editor>
				`,
				],
				[
				'details', () => html`
					DETAILS
				`,
				],
				[
				'history', () => html`
					HISTORY
				`,
				],
			]) }
		</m-studio-tab-panel>
		`;
	}

	protected renderLarge() {
		return html`
		<s-large>
			<s-nav-panel>
				<m-module-nav-selector
					header="Namespaces"
					.activeItem=${ this.store.value.activeNamespace }
					.items=${ this.namespaceKeyValues }
					@m-nav-select-key=${ this.selectNamespace }
				></m-module-nav-selector>

				<m-drag-handle class="horizontal"
					@mousedown=${ this.drag.handle.largeModuleNavDrag }
				></m-drag-handle>

				<m-module-nav-selector
					header="Modules"
					.activeItem=${ this.store.value.activeModuleId }
					.items=${ this.modulesKeyValues }
					@m-nav-select-key=${ this.selectModule }
				></m-module-nav-selector>
			</s-nav-panel>

			<m-drag-handle class="vertical"
				@mousedown=${ this.drag.handle.largeEditorLeftDrag }
			></m-drag-handle>

			<m-editor
				tab-placement="top"
			></m-editor>

			<m-drag-handle class="vertical"
				@mousedown=${ this.drag.handle.largeEditorRightDrag }
			></m-drag-handle>

			${ this.renderTabPanel() }
		</s-large>
		`;
	}

	protected renderMedium() {
		return html`
		<s-medium>
			<s-nav-panel>
				<m-module-nav-selector
					header="Namespaces"
					.activeItem=${ this.store.value.activeNamespace }
					.items=${ this.namespaceKeyValues }
					@m-nav-select-key=${ this.selectNamespace }
				></m-module-nav-selector>

				<m-drag-handle class="horizontal"
					@mousedown=${ this.drag.handle.mediumNavLeftDrag }
				></m-drag-handle>

				<m-module-nav-selector
					header="Modules"
					.activeItem=${ this.store.value.activeModuleId }
					.items=${ this.modulesKeyValues }
					@m-nav-select-key=${ this.selectModule }
				></m-module-nav-selector>

				<m-drag-handle class="horizontal"
					@mousedown=${ this.drag.handle.mediumNavRightDrag }
				></m-drag-handle>

				<m-module-nav-selector
					header="Active"
					.activeItem=${ this.store.value.activeModuleId }
					.items=${ this.activeKeyValues }
					@m-nav-select-key=${ this.selectModule }
				></m-module-nav-selector>
			</s-nav-panel>

			<m-drag-handle class="vertical"
				@mousedown=${ this.drag.handle.mediumEditorTopDrag }
			></m-drag-handle>

			${ this.renderTabPanel() }
		</s-medium>
		`;
	}


	protected override render(): unknown {
		if (this.uiMode === 'large')
			return this.renderLarge();
		if (this.uiMode === 'medium')
			return this.renderMedium();
	}

	public static override styles = [
		sharedStyles,
		styles,
	];

}


class EditorPanelDrag {

	constructor(public element: LitElement) {}

	public handle = {
		largeModuleNavDrag:   this.largeModuleNavDrag.bind(this),
		largeEditorLeftDrag:  this.largeEditorLeftDrag.bind(this),
		largeEditorRightDrag: this.largeEditorRightDrag.bind(this),
		mediumNavLeftDrag:    this.mediumNavLeftDrag.bind(this),
		mediumNavRightDrag:   this.mediumNavRightDrag.bind(this),
		mediumEditorTopDrag:  this.mediumEditorTopDrag.bind(this),
	};

	protected largeModuleNavDrag(ev: MouseEvent) {
		const target = ev.target as HTMLElement;

		const panel = this.element.renderRoot.querySelector<HTMLElement>('s-nav-panel');

		const query = 'm-module-nav-selector:first-of-type';
		const selector = this.element.renderRoot.querySelector<HTMLElement>(query);
		if (!selector || !panel)
			return;

		const selectorRect = selector.getBoundingClientRect();
		const targetRect = target.getBoundingClientRect();
		const targetCenter = targetRect.y + targetRect.height / 2;
		const offset = targetCenter - selectorRect.bottom;

		const panelHeight = panel.offsetHeight;
		const minHeight = panelHeight * 0.25;
		const maxHeight = panelHeight * 0.75;

		this.drag(
			selector,
			'height',
			maxHeight, minHeight,
			ev => (ev.y - selectorRect.y - offset),
		);
	}

	protected largeEditorLeftDrag(ev: MouseEvent) {
		const target = ev.target as HTMLElement;
		const container = this.element.renderRoot.querySelector<HTMLElement>('s-large');
		const panel = this.element.renderRoot.querySelector<HTMLElement>('s-nav-panel');
		const editor = this.element.renderRoot.querySelector<HTMLElement>('m-editor');

		if (!container || !panel || !editor)
			return;

		const editorRect = editor.getBoundingClientRect();
		const panelRect = panel.getBoundingClientRect();
		const targetRect = target.getBoundingClientRect();
		const targetCenter = targetRect.x + targetRect.width / 2;
		const offset = targetCenter - panelRect.right;

		const containerWidth = container.offsetWidth;
		const minWidth = containerWidth * 0.15;
		const maxWidth = editorRect.right - panelRect.left - containerWidth * 0.25;

		this.drag(
			panel,
			'width',
			maxWidth, minWidth,
			ev => (ev.x - panelRect.x - offset),
		);
	}

	protected largeEditorRightDrag(ev: MouseEvent) {
		const target = ev.target as HTMLElement;
		const container = this.element.renderRoot.querySelector<HTMLElement>('s-large');
		const panel = this.element.renderRoot.querySelector<HTMLElement>('m-studio-tab-panel');
		const editor = this.element.renderRoot.querySelector<HTMLElement>('m-editor');

		if (!container || !panel || !editor)
			return;

		const editorRect = editor.getBoundingClientRect();
		const panelRect = panel.getBoundingClientRect();
		const targetRect = target.getBoundingClientRect();
		const targetCenter = targetRect.x + targetRect.width / 2;
		const offset = panelRect.left - targetCenter;

		const containerWidth = container.offsetWidth;
		const minWidth = containerWidth * 0.15;
		const maxWidth = panelRect.right - editorRect.x - containerWidth * 0.25;

		this.drag(
			panel,
			'width',
			maxWidth, minWidth,
			ev => (panelRect.right - ev.x - offset),
		);
	}

	protected mediumNavLeftDrag(ev: MouseEvent) {
		const target = ev.target as HTMLElement;
		const container = this.element.renderRoot.querySelector<HTMLElement>('s-nav-panel');
		const leftPanel = this.element.renderRoot.querySelector<HTMLElement>('m-module-nav-selector:nth-of-type(1)');
		const center = this.element.renderRoot.querySelector<HTMLElement>('m-module-nav-selector:nth-of-type(2)');

		if (!container || !leftPanel || !center)
			return;

		const targetRect = target.getBoundingClientRect();
		const leftPanelRect = leftPanel.getBoundingClientRect();
		const centerRect = center.getBoundingClientRect();

		const targetCenter = targetRect.x + targetRect.width / 2;
		const offset = targetCenter - leftPanelRect.right;

		const containerWidth = container.offsetWidth;
		const minWidth = containerWidth * 0.15;
		const maxWidth = centerRect.right - leftPanelRect.left - containerWidth * 0.25;

		this.drag(
			leftPanel,
			'width',
			maxWidth,
			minWidth,
			ev => (ev.x - leftPanelRect.x - offset),
		);
	}

	protected mediumNavRightDrag(ev: MouseEvent) {
		const target = ev.target as HTMLElement;
		const container = this.element.renderRoot.querySelector<HTMLElement>('s-nav-panel');
		const center = this.element.renderRoot.querySelector<HTMLElement>('m-module-nav-selector:nth-of-type(2)');
		const rightPanel = this.element.renderRoot.querySelector<HTMLElement>('m-module-nav-selector:nth-of-type(3)');

		if (!container || !rightPanel || !center)
			return;

		const centerRect = center.getBoundingClientRect();
		const panelRect = rightPanel.getBoundingClientRect();
		const targetRect = target.getBoundingClientRect();
		const targetCenter = targetRect.x + targetRect.width / 2;
		const offset = panelRect.left - targetCenter;

		const containerWidth = container.offsetWidth;
		const minWidth = containerWidth * 0.15;
		const maxWidth = panelRect.right - centerRect.x - containerWidth * 0.25;

		this.drag(
			rightPanel,
			'width',
			maxWidth,
			minWidth,
			ev => (panelRect.right - ev.x - offset),
		);
	}

	protected mediumEditorTopDrag(ev: MouseEvent) {
		const target = ev.target as HTMLElement;

		const container = this.element.renderRoot.querySelector<HTMLElement>('s-medium');
		const resizeEl = this.element.renderRoot.querySelector<HTMLElement>('s-nav-panel');

		if (!container || !resizeEl)
			return;

		const resizeRect = resizeEl.getBoundingClientRect();
		const targetRect = target.getBoundingClientRect();
		const targetCenter = targetRect.y + targetRect.height / 2;
		const offset = targetCenter - resizeRect.bottom;

		const containerHeight = container.offsetHeight;
		const minHeight = containerHeight * 0.25;
		const maxHeight = containerHeight * 0.75;

		this.drag(
			resizeEl,
			'height',
			maxHeight,
			minHeight,
			(ev) => (ev.y - resizeRect.y - offset),
		);
	}

	protected drag(
		element: HTMLElement,
		property: 'height' | 'width',
		max: number,
		min: number,
		calcDistance: (ev: MouseEvent) => number,
	) {
		const moveFn = (ev: MouseEvent) => {
			ev.preventDefault();

			const distance = calcDistance(ev);
			const size = Math.min(max, Math.max(min, distance));
			element.style.setProperty(property, size + 'px');
		};

		globalThis.addEventListener('mousemove', moveFn);
		globalThis.addEventListener(
			'mouseup',
			() => globalThis.removeEventListener('mousemove', moveFn),
			{ once: true },
		);
	}

}


const defaultEditorState = (): editor.ICodeEditorViewState => {
	return {
		cursorState: [
			{
				inSelectionMode: false,
				selectionStart:  { lineNumber: 1, column: 1 },
				position:        { lineNumber: 1, column: 1 },
			},
		],
		viewState: {
			scrollLeft:            0,
			firstPosition:         { lineNumber: 1, column: 1 },
			firstPositionDeltaTop: 0,
		},
		contributionsState: {
			'editor.contrib.folding':         { lineCount: 1, foldedImports: false },
			'editor.contrib.wordHighlighter': false,
		},
	};
};
