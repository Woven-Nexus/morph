import { AegisElement, customElement } from '@roenlie/lit-aegis';
import { sharedStyles } from '@roenlie/mimic-lit/styles';
import { MonacoEditorCmp } from '@roenlie/morph-components/monaco';
import { html } from 'lit';
import { createRef, type Ref, ref } from 'lit/directives/ref.js';

import workspaceStyles from './workspace.css' with { type: 'css' };

MonacoEditorCmp.register();

const exampleCode = `
const property = () => (target: any, prop: any, key?: any) => {}

export class Test {

	@property() public publicProp: string = 'hello string';

	public numberGoesHere = 5;

	public method() {
		this.publicProp = 'lets reassign';
	}

}
// Here is a comment
const variable = 'string goes here';
`;


@customElement('m-workspace')
export class WorkspaceCmp extends AegisElement {

	protected editorRef: Ref<MonacoEditorCmp> = createRef();

	protected handleEditorReady(ev: Event): void {
		const target = ev.currentTarget as MonacoEditorCmp;
		const monaco = target.monaco;
		const editor = target.editor!;

		// Initialize the editor with a model.
		const model = monaco.createModel(exampleCode, 'typescript');
		editor.setModel(model);
		editor.restoreViewState(null);
		editor.focus();
	}

	protected override render(): unknown {
		return html`
		<monaco-editor
			placeholder="Choose a file to start editing."
			${ ref(this.editorRef) }
			@editor-ready=${ this.handleEditorReady }
		></monaco-editor>
		`;
	}

	public static override styles = [
		sharedStyles,
		workspaceStyles,
	];

}
