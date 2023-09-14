import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import styles from './layout.ccss';


@customElement('app-layout')
export class LayoutCmp extends LitElement {

	protected override render(): unknown {
		return html`
		<aside></aside>
		<main class="test">
			<section></section>
			<monaco-editor></monaco-editor>
		</main>
		`;
	}

	public static override styles = styles;

}
