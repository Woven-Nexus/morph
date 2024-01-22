import { AegisElement, customElement } from '@roenlie/lit-aegis';
import { html } from 'lit';
import { IdeCmp } from '../features/ide/ide.cmp.js';

IdeCmp.register();

@customElement('m-editor-page', true)
export class EditorPageCmp extends AegisElement {
	public static page = true;

	protected override render(): unknown {
		return html`
		<m-ide></m-ide>
		`;
	}
}
