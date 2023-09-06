import './user-worker';

import { css, html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { createRef, type Ref, ref } from 'lit/directives/ref.js';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import editorStyleUrl from 'monaco-editor/min/vs/editor/editor.main.css?url';


@customElement('monaco-editor')
export class MonacoEditorCmp extends LitElement {

	@state() protected editor?: monaco.editor.IStandaloneCodeEditor;
	protected monacoRef: Ref<HTMLDivElement> = createRef();

	public override connectedCallback(): void {
		super.connectedCallback();
		this.updateComplete.then(() => this.afterConnected());
	}

	public override disconnectedCallback(): void {
		super.disconnectedCallback();
		this.editor?.dispose();
	}

	protected afterConnected() {
		monaco.editor.create(this.monacoRef.value!, {
			automaticLayout: true,
			value:           [ 'function x() {', '\tconsole.log("Hello world!");', '}' ].join('\n'),
			language:        'typescript',
			tabSize:         3,
		});
	}

	protected override render(): unknown {
		return html`
		<link rel="stylesheet" href=${ editorStyleUrl }></link>
		<div ${ ref(this.monacoRef) } class="editor"></div>
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
