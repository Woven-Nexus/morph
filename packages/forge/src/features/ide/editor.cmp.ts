import { SignalWatcher } from '@lit-labs/preact-signals';
import { Adapter, AegisComponent, customElement, inject, state } from '@roenlie/lit-aegis';
import { domId } from '@roenlie/mimic-core/dom';
import { debounce } from '@roenlie/mimic-core/timing';
import { sharedStyles } from '@roenlie/mimic-lit/styles';
import { type editor, MonacoEditorCmp } from '@roenlie/morph-components/monaco';
import { html } from 'lit';
import { createRef, type Ref, ref } from 'lit/directives/ref.js';

import { ForgeFile, ForgeFileDB } from '../filesystem/forge-file.js';
import { MimicDB } from '../filesystem/mimic-db.js';
import type { ExplorerStore } from '../stores/explorer-store.js';
import { createTSWorker } from '../tsworker/create-ts-worker.js';
import editorStyles from './editor.css' with { type: 'css' };

MonacoEditorCmp.register();

interface ImportMap {
	imports: Record<string, string>;
	scopes?: Record<string, Record<string, string>>;
}


@SignalWatcher
@customElement('m-editor')
export class EditorCmp extends AegisComponent {

	constructor() {
		super(EditorAdapter);
	}

}


export class EditorAdapter extends Adapter {

	@inject(Ag.explorerStore) protected store: ExplorerStore;
	@state() protected componentTag: string;
	protected editorRef: Ref<MonacoEditorCmp> = createRef();
	protected tsWorker: Worker;
	protected models = new Map<string, editor.ITextModel>();
	protected subs: (() => void)[] = [];

	public override connectedCallback(): void {
		const fileSignal = this.store.signals.get('activeFile')!;
		this.subs.push(
			fileSignal?.subscribe((value?: ForgeFile) => {
				value?.extension && this.setupEditor(value);
			}),
		);
	}

	public override disconnectedCallback(): void {
		this.subs.forEach(s => s());
	}


	public override firstUpdated(): void {
		this.tsWorker = createTSWorker();
		this.tsWorker.onmessage = this.handleWorkerResponse;
	}

	protected handleEditorReady(ev: Event): void {
		const editorCmp = ev.currentTarget as MonacoEditorCmp;
		const editor = editorCmp.editor;
		editor?.onDidChangeModelContent(this.debouncedModelChange);

		const activeFile = this.store.activeFile;
		if (!activeFile)
			return;

		this.setupEditor(activeFile);
	}

	protected setupEditor(file: ForgeFile) {
		const editorEl = this.editorRef.value!;
		const monaco = editorEl.monaco;
		const editor = editorEl.editor!;

		const existingModel = this.models.get(file.id);

		// Initialize the editor with a model.
		const model = existingModel ?? monaco.createModel(file.content ?? '', 'typescript');
		editor.setModel(model);
		editor.restoreViewState(null);
		editor.focus();

		this.models.set(file.id, model);
		this.debouncedModelChange();
	}

	protected debouncedModelChange = (() => {
		const fn = debounce(() => this.handleEditorModelChange(), 1000);

		return (_ev?: editor.IModelContentChangedEvent) => fn();
	})();

	protected async getImportMap() {
		const files = (await MimicDB.connect(ForgeFileDB)
			.collection(ForgeFile)
			.getAll())
			.filter(file => file.extension && file.project === this.store.project);

		const imports: ImportMap = {
			imports: {
				'import-shim': '/import-shim.js',
			},
		};

		for (const file of files)
			imports.imports[file.path.replace(/^\/+/, '')] = file.importUri;

		return imports;
	}

	protected createSrcDoc() {
		return `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Preview</title>
			<style>
				body {
					margin: 0px;
					padding: 0px;
					height: 100svh;
				}
			</style>
		</head>
		<body>
		</body>
		</html>
		`.replaceAll(/\t+/g, '')
			.replaceAll(/\n+/g, '')
			.replaceAll(/ +/g, ' ');
	}

	protected async handleEditorModelChange() {
		const editor = this.editorRef.value?.editor;
		if (!editor?.getModel())
			return;

		const content = editor.getValue() ?? '';
		this.tsWorker.postMessage({ id: this.store.activeFile!.id, content });
	}

	protected handleWorkerResponse = async (
		msg: MessageEvent<ForgeFile>,
	) => {
		try {
			const oldIframe = this.querySelector<HTMLIFrameElement>('iframe')!;
			const newFrame = document.createElement('iframe');
			newFrame.srcdoc = this.createSrcDoc();
			newFrame.id = domId();

			const importMap = await this.getImportMap();

			this.shadowRoot.prepend(newFrame);
			const contentWindow = newFrame.contentWindow;
			if (contentWindow) {
				contentWindow.addEventListener('DOMContentLoaded', () => {
					const head = contentWindow.document.head;

					const importMapScriptEl = document.createElement('script');
					importMapScriptEl.type = 'importmap';
					importMapScriptEl.innerText = JSON.stringify(importMap);
					head.append(importMapScriptEl);

					const mainScriptEl = document.createElement('script');
					mainScriptEl.type = 'module';
					mainScriptEl.innerText = `import '${ msg.data.importAlias }'`;
					head.append(mainScriptEl);
				}, { once: true });

				contentWindow.addEventListener('load', () => {
					setTimeout(() => oldIframe.remove(), 100);
				}, { once: true });
			}
		}
		catch (error) {
			console.warn('Import failed. Reason:', error);
		}
	};

	public override render(): unknown {
		return html`
		<iframe></iframe>

		<monaco-editor
			placeholder="Choose a file to start editing."
			${ ref(this.editorRef) }
			@editor-ready=${ this.handleEditorReady.bind(this) }
		></monaco-editor>
		`;
	}

	public static override styles = [
		sharedStyles,
		editorStyles,
	];

}