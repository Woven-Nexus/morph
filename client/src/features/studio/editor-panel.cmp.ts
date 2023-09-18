import { customElement, MimicElement } from '@roenlie/mimic-lit/element';
import { css, html } from 'lit';

import { DragHandleCmp } from './drag-handle.cmp.js';
import { StudioTabPanel } from './studio-tab-panel.cmp.js';

DragHandleCmp.register();
StudioTabPanel.register();


@customElement('m-editor-panel')
export class EditorPanel extends MimicElement {


	protected renderFullWidth() {
		return html`
		<s-fullwidth>
			<div>EDITOR HERE</div>
			<m-drag-handle></m-drag-handle>
			<m-studio-tab-panel></m-studio-tab-panel>
		</s-fullwidth>
		`;
	}


	protected override render(): unknown {
		return html`
		${ this.renderFullWidth() }
		`;
	}

	public static override styles = [
		css`
		:host {
			margin-block: 20px;
			display: grid;
			background-color: var(--shadow1);
			padding: 4px;
			border: 1px solid var(--background-strong);
			border-radius: 12px;
		}
		s-fullwidth {
			display: grid;
			grid-template-columns: 1fr max-content max-content;
		}
		`,
	];

}
