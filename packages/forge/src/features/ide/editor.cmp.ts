import { AegisElement, customElement, state } from '@roenlie/lit-aegis';
import { debounce } from '@roenlie/mimic-core/timing';
import { sharedStyles } from '@roenlie/mimic-lit/styles';
import { type editor, MonacoEditorCmp } from '@roenlie/morph-components/monaco';
import { html } from 'lit';
import { createRef, type Ref, ref } from 'lit/directives/ref.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import { createTSWorker } from '../tsworker/create-ts-worker.js';
import editorStyles from './editor.css' with { type: 'css' };

MonacoEditorCmp.register();


const exampleCode = `
import 'forge0';
import tester, {something1, something2} from 'forge1';
import allofit from 'forge2';

export default class Component extends HTMLElement {
	connectedCallback() {
		console.log('hei');
	}
}

customElements.define('test-whatwhat', Component);
`;


@customElement('m-editor')
export class EditorCmp extends AegisElement {

	@state() protected componentTag: string;
	protected editorRef: Ref<MonacoEditorCmp> = createRef();
	protected tsWorker: Worker;

	protected override firstUpdated(props: Map<PropertyKey, unknown>): void {
		super.firstUpdated(props);

		this.tsWorker = createTSWorker();
		this.tsWorker.onmessage = this.handleWorkerResponse;
	}

	protected handleEditorReady(ev: Event): void {
		const target = ev.currentTarget as MonacoEditorCmp;
		const monaco = target.monaco;
		const editor = target.editor!;

		// Initialize the editor with a model.
		const model = monaco.createModel(exampleCode, 'typescript');
		editor.setModel(model);
		editor.restoreViewState(null);
		editor.focus();

		editor.onDidChangeModelContent(this.debouncedModelChange);
		this.debouncedModelChange();
	}

	protected debouncedModelChange = (() => {
		const fn = debounce(() => this.handleEditorModelChange(), 1000);

		return (_ev?: editor.IModelContentChangedEvent) => fn();
	})();

	protected handleEditorModelChange() {
		const content = this.editorRef.value?.editor?.getValue() ?? '';
		this.tsWorker.postMessage({ id: '033bb82f-060f-4b65-9854-acef764b0692', content });
	}

	protected handleWorkerResponse = async (msg: MessageEvent<string>) => {
		const data = msg.data;

		try {
			const encodedJs = encodeURIComponent(data);
			const dataUri = `data:text/javascript;charset=utf-8,${ encodedJs }`;
			//const module = (await import(/* @vite-ignore */ dataUri));
			//const def = module.default;
			//console.log(def);
		}
		catch (error) {
			console.warn('Import failed. Reason:', error);
		}
	};

	protected renderComponent() {
		return html`
		<div>
			${ unsafeHTML('<test-whatwhat></test-whatwhat>') }
		</div>
		`;
	}

	protected override render(): unknown {
		return html`
		${ this.renderComponent() }
		<monaco-editor
			placeholder="Choose a file to start editing."
			${ ref(this.editorRef) }
			@editor-ready=${ this.handleEditorReady }
		></monaco-editor>
		`;
	}

	public static override styles = [
		sharedStyles,
		editorStyles,
	];

}
