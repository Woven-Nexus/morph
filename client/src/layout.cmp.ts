import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import styles from './test.ccss';

console.log(styles);


@customElement('app-layout')
export class LayoutCmp extends LitElement {

	protected override render(): unknown {
		return html`
		<aside></aside>
		<main>
			<section></section>
			<monaco-editor></monaco-editor>
		</main>
		`;
	}

	public static override styles = [
		styles,
		css`
		:host {
			overflow: hidden;
			display: grid;
			grid-template-columns: auto 1fr;
		}
		aside {
			width: 200px;
			background-color: teal;
		}

		main {
			overflow: hidden;
			display: grid;
			grid-template-rows: 30% 1fr;

		}
		`,
	];

}
