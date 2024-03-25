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
import editorStyle from 'monaco-editor/min/vs/editor/editor.main.css?raw';

import { updateLangConfig } from './lang-config-extender.js';

export type { editor };


@customElement('monaco-editor')
export class MonacoEditorCmp extends MimicElement {

	public static readonly formAssociated = true;

	protected static modifyLangConfig: Promise<any>;
	static {
		this.modifyLangConfig = updateLangConfig('typescript', {
			typeKeywords:    [ 'any', 'boolean', 'number', 'object', 'string', 'undefined' ],
			specialKeywords: [ 'this', 'export', 'return', 'default' ],
			tokenizer:       {
				root:   [ { include: 'custom' } ],
				custom: [
					[ '@', 'meta.decorator' ],
					[ /[\w\d]+ *`/, { token: 'function', goBack: 1 } ],
					[ /[\w\d]+ *\(/, { token: 'function', goBack: 1 } ],
					[
						/[#]?[a-z_$][\w$]*/, {
							cases: {
								'@specialKeywords': 'keyword.special',
								'@typeKeywords':    'keyword.type',
								'@keywords':        'keyword',
								'@default':         'identifier',
							},
						},
					],
				],
			},
		});
	}

	/** Value of the editor. */
	@property() public set value(v: string) {
		if (!this.editorReady.done)
			this.createModel(v, this.language ?? 'typescript');
		else if (this.editor?.getValue() !== v)
			this.editor?.setValue(v);
	}

	public get value() { return this.editor?.getValue() ?? ''; }

	/** Value that will be displayed before a model is assigned. */
	@property() public placeholder: string;

	/** Language that will be used when auto creating a model. */
	@property() public language: string;

	public get monaco() { return editor; }
	public get editor() { return this._editor; }

	@state() protected _editor?: monaco.editor.IStandaloneCodeEditor;
	@state() protected visible = false;
	public editorReady = (() => {
		const [ promise, resolve ] = createPromiseResolver();

		const resolveablePromise = promise as Promise<any> & {
			resolve: (value?: any) => void;
			done: boolean;
		};
		resolveablePromise.resolve = () => {
			resolveablePromise.done = true;
			resolve();
		};
		resolveablePromise.done = false;

		return resolveablePromise;
	})();

	protected internals: ElementInternals;
	protected disposables: monaco.IDisposable[] = [];
	protected disposableModels: monaco.IDisposable[] = [];
	protected monacoRef: Ref<HTMLDivElement> = createRef();
	protected resizeObs = new ResizeObserver(([ entry ]) => {
		const rect = entry!.contentRect;
		this.editor?.layout({ height: rect.height, width: rect.width });
	});

	constructor() {
		super();
		this.internals = this.attachInternals();
	}

	public override connectedCallback(): void {
		super.connectedCallback();
		this.updateComplete.then(() => this.afterConnected());
	}

	public override disconnectedCallback(): void {
		super.disconnectedCallback();
		this.disposables.forEach(d => d.dispose());
		this.disposableModels.forEach(d => d.dispose());
		this._editor?.dispose();
		this.resizeObs.unobserve(this);
	}

	protected async afterConnected() {
		this.resizeObs.observe(this);

		await MonacoEditorCmp.modifyLangConfig;
		monaco.editor.defineTheme('Plastic', {
			base:    'vs-dark',
			inherit: true,
			colors:  {
				'editor.background':                   '#1E1E1E',
				'editor.foreground':                   '#D4D4D4',
				'editor.inactiveSelectionBackground':  '#3A3D41',
				'editorIndentGuide.background':        '#404040',
				'editor.selectionHighlightBackground': '#ADD6FF26',
				'editorBracketHighlight.foreground1':  '#A9B2C3',
				'editorBracketHighlight.foreground2':  '#61AFEF',
				'editorBracketHighlight.foreground3':  '#E5C07B',
				'editorBracketHighlight.foreground4':  '#E06C75',
				'editorBracketHighlight.foreground5':  '#98C379',
				'editorBracketHighlight.foreground6':  '#B57EDC',
			},
			rules: [
				{ token: 'identifier', foreground: 'C6CCD7' },
				{ token: 'string', foreground: '98C379' },
				{ token: 'function', foreground: 'B57EDC' },
				{ token: 'type', foreground: 'E5C07B' },
				{ token: 'keyword.type', foreground: 'E5C07B' },
				{ token: 'keyword.special', foreground: 'E06C75' },
				{ token: 'meta.decorator', foreground: 'A9B2C3' },
			],
		});

		this._editor = monaco.editor.create(this.monacoRef.value!, {
			model:                null,
			language:             'typescript',
			theme:                'Plastic',
			tabSize:              3,
			mouseWheelZoom:       true,
			fixedOverflowWidgets: true,
			useShadowDOM:         true,
			minimap:              { enabled: false },
		});

		let valueOnFocus = '';

		this.disposables.push(
			this._editor.onDidChangeModel(() => {
				this.visible = !!this._editor?.getModel();

				const value = this.value;
				this.internals.setFormValue(value);

				const ev = new Event('change', {
					bubbles:  true,
					composed: true,
				});
				this.dispatchEvent(ev);
			}),
			this._editor.onDidFocusEditorText(() => {
				valueOnFocus = this.value;
			}),
			this._editor.onDidBlurEditorText(() => {
				if (valueOnFocus === this.value)
					return;

				const value = this.value;
				this.internals.setFormValue(value);

				this.dispatchEvent(new Event('change', {
					bubbles:  true,
					composed: true,
				}));
			}),
			this._editor.onDidChangeModelContent(() => {
				const value = this.value;
				this.internals.setFormValue(value);

				this.dispatchEvent(new InputEvent('input', {
					bubbles:  true,
					composed: true,
					data:     value,
				}));
			}),
		);

		await sleep(100);

		this.editorReady.resolve();
		emitEvent(this, 'editor-ready', { bubbles: false });
	}

	public async createModel(code: string, language: string) {
		await this.editorReady;

		const model = this.monaco.createModel(code, language);
		this.disposableModels.forEach(d => d.dispose());
		this.disposableModels.push(model);

		this.editor?.setModel(model);
		this.editor?.restoreViewState(null);
		this.editor?.focus();
	}

	protected override render(): unknown {
		return html`
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

	public static override styles = [
		(() => {
			const sheet = new CSSStyleSheet();
			sheet.replaceSync(editorStyle);

			return sheet;
		})(),
		css`
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
		`,
	];

}
MonacoEditorCmp.register();
