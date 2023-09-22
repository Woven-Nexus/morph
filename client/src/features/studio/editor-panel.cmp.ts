import { consume, type ContextProp } from '@roenlie/lit-context';
import { maybe } from '@roenlie/mimic-core/async';
import { customElement, MimicElement } from '@roenlie/mimic-lit/element';
import { html } from 'lit';
import { state } from 'lit/decorators.js';

import { serverUrl } from '../../app/backend-url.js';
import type { DbResponse } from '../../app/response-model.js';
import type { ModuleNamespace, NamespaceDefinition } from '../code-module/namespace-model.js';
import type { LayoutStore } from '../layout/layout-store.js';
import { sharedStyles } from '../styles/shared-styles.js';
import { DragHandleCmp } from './drag-handle.cmp.js';
import { EditorCmp } from './editor.cmp.js';
import styles from './editor-panel.ccss';
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
	@state() protected uiMode: 'large' | 'medium' | 'small' = 'large';
	protected namespaceList: NamespaceDefinition[] = [];
	protected moduleList: ModuleNamespace[] = [];
	protected resizeObs = new ResizeObserver(([ entry ]) => {
		if (!entry)
			return;

		if (entry.contentRect.width <= 450)
			this.uiMode = 'small';
		else if (entry.contentRect.width <= 1440)
			this.uiMode = 'medium';
		else
			this.uiMode = 'large';
	});

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

	protected handleModuleNavDrag(ev: MouseEvent) {
		const target = ev.target as HTMLElement;

		const panel = this.renderRoot.querySelector<HTMLElement>('s-nav-panel');

		const query = 'm-module-nav-selector:first-of-type';
		const selector = this.renderRoot.querySelector<HTMLElement>(query);
		if (!selector || !panel)
			return;

		const selectorRect = selector.getBoundingClientRect();
		const targetRect = target.getBoundingClientRect();
		const targetCenter = targetRect.y + targetRect.height / 2;
		const offset = targetCenter - selectorRect.bottom;

		const panelHeight = panel.offsetHeight;
		const maxHeight = panelHeight / 1.25;
		const minHeight = panelHeight - maxHeight;

		const moveFn = (ev: MouseEvent) => {
			ev.preventDefault();

			const distance = ev.y - selectorRect.y - offset;
			const height = Math.min(maxHeight, Math.max(minHeight, distance));
			selector.style.setProperty('height', height + 'px');
		};

		globalThis.addEventListener('mousemove', moveFn);
		globalThis.addEventListener(
			'mouseup',
			() => globalThis.removeEventListener('mousemove', moveFn),
			{ once: true },
		);
	}

	protected handleEditorLeftDrag(ev: MouseEvent) {
		const target = ev.target as HTMLElement;
		const container = this.renderRoot.querySelector<HTMLElement>('s-large');
		const panel = this.renderRoot.querySelector<HTMLElement>('s-nav-panel');
		const editor = this.renderRoot.querySelector<HTMLElement>('m-editor');

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

		const moveFn = (ev: MouseEvent) => {
			ev.preventDefault();

			const distance = ev.x - panelRect.x - offset;
			const width = Math.min(maxWidth, Math.max(minWidth, distance));
			panel.style.setProperty('width', width + 'px');
		};

		globalThis.addEventListener('mousemove', moveFn);
		globalThis.addEventListener(
			'mouseup',
			() => globalThis.removeEventListener('mousemove', moveFn),
			{ once: true },
		);
	}

	protected handleEditorRightDrag(ev: MouseEvent) {
		const target = ev.target as HTMLElement;
		const container = this.renderRoot.querySelector<HTMLElement>('s-large');
		const panel = this.renderRoot.querySelector<HTMLElement>('m-studio-tab-panel');
		const editor = this.renderRoot.querySelector<HTMLElement>('m-editor');

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

		const moveFn = (ev: MouseEvent) => {
			ev.preventDefault();

			const distance = panelRect.right - ev.x - offset;
			const width = Math.min(maxWidth, Math.max(minWidth, distance));
			panel.style.setProperty('width', width + 'px');
		};

		globalThis.addEventListener('mousemove', moveFn);
		globalThis.addEventListener(
			'mouseup',
			() => globalThis.removeEventListener('mousemove', moveFn),
			{ once: true },
		);
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
					@mousedown=${ this.handleModuleNavDrag }
				></m-drag-handle>

				<m-module-nav-selector
					header="Modules"
					.activeItem=${ this.store.value.activeModuleId }
					.items=${ this.modulesKeyValues }
					@m-nav-select-key=${ this.selectModule }
				></m-module-nav-selector>
			</s-nav-panel>

			<m-drag-handle class="vertical"
				@mousedown=${ this.handleEditorLeftDrag }
			></m-drag-handle>

			<m-editor></m-editor>

			<m-drag-handle class="vertical"
				@mousedown=${ this.handleEditorRightDrag }
			></m-drag-handle>

			<m-studio-tab-panel></m-studio-tab-panel>
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
					@mousedown=${ this.handleModuleNavDrag }
				></m-drag-handle>

				<m-module-nav-selector
					header="Modules"
					.activeItem=${ this.store.value.activeModuleId }
					.items=${ this.modulesKeyValues }
					@m-nav-select-key=${ this.selectModule }
				></m-module-nav-selector>
			</s-nav-panel>

			<m-drag-handle class="vertical"
				@mousedown=${ this.handleEditorRightDrag }
			></m-drag-handle>

			<m-studio-tab-panel></m-studio-tab-panel>
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
