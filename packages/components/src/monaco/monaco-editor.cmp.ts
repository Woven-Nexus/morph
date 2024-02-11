import './user-worker';

import { createPromiseResolver, sleep } from '@roenlie/mimic-core/async';
import { emitEvent } from '@roenlie/mimic-core/dom';
import { customElement, MimicElement } from '@roenlie/mimic-lit/element';
import { css, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, type Ref, ref } from 'lit/directives/ref.js';
import { when } from 'lit/directives/when.js';
import { editor } from 'monaco-editor';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import editorStyleUrl from 'monaco-editor/min/vs/editor/editor.main.css?url';

import plasticTheme from './plastic-theme.json';
import { updateTheme } from './theme-converter.js';

const converted = updateTheme(plasticTheme);
console.log(converted);


@customElement('monaco-editor')
export class MonacoEditorCmp extends MimicElement {

	@property() public placeholder: string;

	public get monaco() { return editor; }
	public get editor() { return this._editor; }
	@state() protected _editor?: monaco.editor.IStandaloneCodeEditor;
	@state() protected visible = false;
	public editorReady = (() => {
		const [ promise, resolve ] = createPromiseResolver();

		const resolveablePromise = promise as Promise<any> & {
			resolve: (value?: any) => void;
		};
		resolveablePromise.resolve = resolve;

		return resolveablePromise;
	})();

	protected disposables: monaco.IDisposable[] = [];
	protected monacoRef: Ref<HTMLDivElement> = createRef();
	protected resizeObs = new ResizeObserver(([ entry ]) => {
		const rect = entry!.contentRect;
		this.editor?.layout({ height: rect.height, width: rect.width });
	});

	public override connectedCallback(): void {
		super.connectedCallback();
		this.updateComplete.then(() => this.afterConnected());
	}

	public override disconnectedCallback(): void {
		super.disconnectedCallback();
		this.disposables.forEach(d => d.dispose());
		this._editor?.dispose();
		this.resizeObs.unobserve(this);
	}

	protected async afterConnected() {
		this.resizeObs.observe(this);

		this._editor = monaco.editor.create(this.monacoRef.value!, {
			model:                null,
			language:             'typescript',
			tabSize:              3,
			theme:                'vs-dark',
			mouseWheelZoom:       true,
			fixedOverflowWidgets: true,
			useShadowDOM:         true,
			minimap:              { enabled: false },
		});

		monaco.editor.defineTheme(converted.name, {
			...converted,
			colors: {
				'editor.background':                   '#1E1E1E',
				'editor.foreground':                   '#D4D4D4',
				'editor.inactiveSelectionBackground':  '#3A3D41',
				'editorIndentGuide.background':        '#404040',
				'editor.selectionHighlightBackground': '#ADD6FF26',
			},
			rules: [
				//
				{ token: 'type', foreground: 'E5C07B' },
			],
		});
		monaco.editor.setTheme('Plastic');

		this.disposables.push(
			this._editor.onDidChangeModel(() => {
				this.visible = !!this._editor?.getModel();
			}),
		);

		await sleep(100);

		this.editorReady.resolve();
		emitEvent(this, 'editor-ready', { bubbles: false });
	}

	protected override render(): unknown {
		return html`
		<link rel="stylesheet" href=${ editorStyleUrl }></link>
		<div
			${ ref(this.monacoRef) }
			class=${ classMap({ editor: true, visible: this.visible }) }
		></div>
		${ when(!this.visible, () => html`
		<s-editor-placeholder>
			${ this.placeholder }
		</s-editor-placeholder>
		`) }
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
	s-editor-placeholder {
		display: grid;
		place-items: center;
	}
	.editor, s-editor-placeholder {
		grid-row: 1/2;
		grid-column: 1/2;
	}
	`;

}
