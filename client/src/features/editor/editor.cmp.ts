import { consume, type ContextProp } from '@roenlie/lit-context';
import { maybe } from '@roenlie/mimic-core/async';
import { customElement, MimicElement } from '@roenlie/mimic-lit/element';
import { css, html } from 'lit';
import { createRef, type Ref, ref } from 'lit/directives/ref.js';

import { serverUrl } from '../../app/backend-url.js';
import type { DbResponse } from '../../app/response-model.js';
import type { Module } from '../code-module/module-model.js';
import type { LayoutStore } from '../layout/layout-store.js';
import { MonacoEditorCmp } from './monaco/monaco-editor.cmp.js';

MonacoEditorCmp.register();


@customElement('m-editor')
export class EditorCmp extends MimicElement {

	@consume('store') protected store: ContextProp<LayoutStore>;
	protected editorRef: Ref<MonacoEditorCmp> = createRef();

	public override connectedCallback(): void {
		super.connectedCallback();
		import('./monaco/monaco-editor.cmp.js').then(m => m.MonacoEditorCmp.register());

		this.store.value.connect(this, 'moduleId');
		this.store.value.listen(this, 'moduleId', this.onModuleId);
		this.store.value.listen(this, 'module', this.onModule);
	}

	protected onModuleId = async () => {
		const store = this.store.value;
		if (!store.namespace || store.moduleId === undefined)
			return;

		const url = new URL(serverUrl + `/api/code-modules/${ store.namespace }/${ store.moduleId }`);
		const [ result ] = await maybe<DbResponse<Module>>((await fetch(url)).json());
		if (!result)
			return store.module = undefined;

		store.module = result.data;
	};

	protected onModule = async () => {
		const store = this.store.value;
		const editor = this.editorRef.value?.editor;
		if (!store.module) {
			editor?.setValue('');

			return;
		}

		editor?.setValue(store.module.code);
	};

	protected override render(): unknown {
		return html`
		<monaco-editor ${ ref(this.editorRef) }></monaco-editor>
		`;
	}

	public static override styles = [
		css`
		:host {
			display: grid;
			overflow: hidden;
		}
		`,
	];

}
