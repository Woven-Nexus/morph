import './user-worker';

import { createPromiseResolver, sleep } from '@roenlie/mimic-core/async';
import { customElement, MimicElement } from '@roenlie/mimic-lit/element';
import { css, html } from 'lit';
import { state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, type Ref, ref } from 'lit/directives/ref.js';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import editorStyleUrl from 'monaco-editor/min/vs/editor/editor.main.css?url';

@customElement('monaco-editor')
export class MonacoEditorCmp extends MimicElement {
	public get editor() {
		return this._editor;
	}

	@state() protected _editor?: monaco.editor.IStandaloneCodeEditor;
	@state() protected visible = false;
	public editorReady = (() => {
		const [promise, resolve] = createPromiseResolver();

		const resolveablePromise = promise as Promise<any> & {
			resolve: (value?: any) => void;
		};
		resolveablePromise.resolve = resolve;

		return resolveablePromise;
	})();

	protected monacoRef: Ref<HTMLDivElement> = createRef();
	protected resizeObs = new ResizeObserver(([entry]) => {
		const rect = entry!.contentRect;
		this.editor?.layout({ height: rect.height, width: rect.width });
	});

	public override connectedCallback(): void {
		super.connectedCallback();
		this.updateComplete.then(() => this.afterConnected());
	}

	public override disconnectedCallback(): void {
		super.disconnectedCallback();
		this._editor?.dispose();
		this.resizeObs.unobserve(this);
	}

	protected async afterConnected() {
		this._editor = monaco.editor.create(this.monacoRef.value!, {
			model: null,
			language: 'typescript',
			tabSize: 3,
			theme: 'vs-dark',
			mouseWheelZoom: true,
			fixedOverflowWidgets: true,
			useShadowDOM: true,
			minimap: { enabled: false },
		});

		this.resizeObs.observe(this);
		await sleep(100);
		this.visible = true;
		this.editorReady.resolve();
	}

	protected override render(): unknown {
		return html`
		<link rel="stylesheet" href=${editorStyleUrl}></link>
		<div
			${ref(this.monacoRef)}
			class=${classMap({ editor: true, visible: this.visible })}
		></div>
		`;
	}

	public static override styles = css`
	:host {
		display: grid;
		overflow: hidden;
	}
	.editor {
		opacity: 0;
	}
	.editor.visible {
		opacity: 1;
	}
	`;
}
