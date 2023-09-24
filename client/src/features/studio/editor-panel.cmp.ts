import { consume, type ContextProp } from '@roenlie/lit-context';
import { maybe } from '@roenlie/mimic-core/async';
import { MMButton } from '@roenlie/mimic-elements/button';
import { customElement, MimicElement } from '@roenlie/mimic-lit/element';
import { html, LitElement } from 'lit';
import { state } from 'lit/decorators.js';
import { choose } from 'lit/directives/choose.js';
import { classMap } from 'lit/directives/class-map.js';
import { map } from 'lit/directives/map.js';

import { serverUrl } from '../../app/backend-url.js';
import type { DbResponse } from '../../app/response-model.js';
import type { ModuleNamespace, NamespaceDefinition } from '../code-module/namespace-model.js';
import { sharedStyles } from '../styles/shared-styles.js';
import { DragHandleCmp } from './drag-handle.cmp.js';
import { EditorCmp } from './editor.cmp.js';
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
	@state() protected namespaceKeyValues: {key: string; value: string}[] = [];
	@state() protected modulesKeyValues: {key: string; value: string}[] = [];
	@state() protected activeKeyValues: {key: string; value: string}[] = [];
	@state() protected uiMode: 'large' | 'medium' | 'small' = 'large';
	@state() protected activeTab: 'editor' | 'details' | 'history' = 'details';
	protected namespaceList: NamespaceDefinition[] = [];
	protected moduleList: ModuleNamespace[] = [];
	protected previousUiMode = this.uiMode;
	protected resizeObs = new ResizeObserver(([ entry ]) => {
		if (!entry)
			return;

		let newUIMode = this.uiMode;

		if (entry.contentRect.width <= 450)
			newUIMode = 'small';
		else if (entry.contentRect.width <= 1440)
			newUIMode = 'medium';
		else
			newUIMode = 'large';

		if (this.uiMode !== newUIMode) {
			this.uiMode = newUIMode;

			if (newUIMode === 'medium')
				this.activeTab = 'editor';

			if (newUIMode === 'large' && this.activeTab === 'editor')
				this.activeTab = 'details';
		}
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

	protected renderTabPanel() {
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
						tab-placement="right"
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

				<s-action-container>
					<mm-button shape="rounded" size="small">Button 1</mm-button>
					<mm-button shape="rounded" size="small">Button 2</mm-button>
					<mm-button shape="rounded" size="small">Button 3</mm-button>
					<mm-button shape="rounded" size="small">Button 4</mm-button>
					<mm-button shape="rounded" size="small">Button 5</mm-button>
				</s-action-container>
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
		const leftPanel = this.element.renderRoot.querySelector<HTMLElement>('m-module-nav-selector:first-of-type');
		const center = this.element.renderRoot.querySelector<HTMLElement>('m-module-nav-selector:last-of-type');

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
		const center = this.element.renderRoot.querySelector<HTMLElement>('m-module-nav-selector:last-of-type');
		const rightPanel = this.element.renderRoot.querySelector<HTMLElement>('s-action-container');

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
