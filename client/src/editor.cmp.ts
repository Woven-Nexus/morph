import './user-worker';

import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, type Ref, ref } from 'lit/directives/ref.js';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import editorStyleUrl from 'monaco-editor/min/vs/editor/editor.main.css?url';

import styles from './editor.ccss';


@customElement('monaco-editor')
export class MonacoEditorCmp extends LitElement {

	@state() protected editor?: monaco.editor.IStandaloneCodeEditor;
	@state() protected visible = false;
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
		this.editor = monaco.editor.create(this.monacoRef.value!, {
			automaticLayout: true,
			value:           [ 'function x() {', '\tconsole.log("Hello world!");', '}' ].join('\n'),
			language:        'typescript',
			tabSize:         3,
		});

		setTimeout(() => {
			this.visible = true;
		}, 0);
	}

	protected override render(): unknown {
		return html`
		<link rel="stylesheet" href=${ editorStyleUrl }></link>
		<div
			${ ref(this.monacoRef) }
			class=${ classMap({ editor: true, visible: this.visible }) }
		></div>
		`;
	}

	public static override styles = styles;

}
