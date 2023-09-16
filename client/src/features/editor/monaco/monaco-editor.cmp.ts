import './user-worker';

import { customElement, MimicElement } from '@roenlie/mimic-lit/element';
import { css, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, type Ref, ref } from 'lit/directives/ref.js';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import editorStyleUrl from 'monaco-editor/min/vs/editor/editor.main.css?url';


@customElement('monaco-editor')
export class MonacoEditorCmp extends MimicElement {

	public get editor() {
		return this._editor;
	}

	@property({ type: String, attribute: false }) public value = '';
	@state() protected _editor?: monaco.editor.IStandaloneCodeEditor;
	@state() protected visible = false;
	protected monacoRef: Ref<HTMLDivElement> = createRef();

	public override connectedCallback(): void {
		super.connectedCallback();
		this.updateComplete.then(() => this.afterConnected());
	}

	public override disconnectedCallback(): void {
		super.disconnectedCallback();
		this._editor?.dispose();
	}

	protected afterConnected() {
		this._editor = monaco.editor.create(this.monacoRef.value!, {
			automaticLayout: true,
			value:           this.value,
			language:        'typescript',
			tabSize:         3,
			theme:           'vs-dark',
		});

		setTimeout(() => this.visible = true, 100);
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

	public static override styles = css`
	:host {
		display: grid;
	}

	.editor {
		opacity: 0;

		&.visible {
			opacity: 1;
		}
	}
	`;

}
