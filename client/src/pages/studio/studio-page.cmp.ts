import { provide } from '@roenlie/lit-context';
import { customElement, MimicElement } from '@roenlie/mimic-lit/element';
import { css, html } from 'lit';

import { EditorPanel } from './editor-panel.cmp.js';
import { ModuleNavCmp } from './module-nav.cmp.js';
import { StudioStore } from './studio-store.js';

ModuleNavCmp.register();
EditorPanel.register();


@customElement('m-studio-page')
export class StudioPageCmp extends MimicElement {

	@provide('store') protected store = new StudioStore();

	protected override render() {
		return html`
		<m-editor-panel></m-editor-panel>
		`;
	}

	public static override styles = [
		css`
		:host {
			overflow: hidden;
			display: grid;
			grid-template-columns: 1fr;
			gap: 20px;
			padding-right: 20px;
		}
		`,
	];

}
