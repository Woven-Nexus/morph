import { consume, type ContextProp } from '@roenlie/lit-context';
import { maybe } from '@roenlie/mimic-core/async';
import { watch } from '@roenlie/mimic-lit/decorators';
import { customElement, MimicElement } from '@roenlie/mimic-lit/element';
import { css, html } from 'lit';
import { createRef, type Ref, ref } from 'lit/directives/ref.js';

import { serverUrl } from '../../app/backend-url.js';
import type { DbResponse } from '../../app/response-model.js';
import type { Module } from '../code-module/module-model.js';
import { MonacoEditorCmp } from './monaco/monaco-editor.cmp.js';

MonacoEditorCmp.register();


@customElement('m-editor')
export class EditorCmp extends MimicElement {

	@consume('namespace') protected namespace: ContextProp<string>;
	@consume('moduleId') protected moduleId: ContextProp<number | undefined>;
	@consume('module') protected module: ContextProp<Module | undefined>;
	protected editorRef: Ref<MonacoEditorCmp> = createRef();

	@watch('moduleId')
	protected async onModuleId() {
		if (!this.namespace.value || this.moduleId.value === undefined)
			return;

		const moduleId = this.moduleId.value;
		const namespace = this.namespace.value;

		const url = new URL(serverUrl + `/api/code-modules/${ namespace }/${ moduleId }`);
		const [ result ] = await maybe<DbResponse<Module>>((await fetch(url)).json());
		if (!result)
			return this.module.value = undefined;

		this.module.value = result.data;
	}

	@watch('module')
	protected async onModule() {
		if (!this.module.value)
			return;

		this.editorRef.value?.editor?.setValue(this.module.value.code);
	}

	protected override render(): unknown {
		return html`
		<monaco-editor ${ ref(this.editorRef) }></monaco-editor>
		`;
	}

	public static override styles = [
		css`
		:host {
			display: grid;
		}
		`,
	];

}
