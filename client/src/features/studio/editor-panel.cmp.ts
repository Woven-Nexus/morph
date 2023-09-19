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
			<s-nav-panel>
				<m-module-nav-selector header="Namespaces"></m-module-nav-selector>
				<m-drag-handle class="horizontal"></m-drag-handle>
				<m-module-nav-selector header="Modules"></m-module-nav-selector>
				<m-drag-handle class="horizontal"></m-drag-handle>
				<m-module-nav-selector header="Active"></m-module-nav-selector>
			</s-nav-panel>

			<s-editor-panel>EDITOR HERE</s-editor-panel>
			<m-drag-handle class="vertical"></m-drag-handle>
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
			margin-block: 10px;
			display: grid;
			background-color: var(--shadow1);
			padding: 8px;
			border: 1px solid var(--background-strong);
			border-radius: 12px;
		}
		s-fullwidth {
			display: grid;
			grid-template-columns: 250px 1fr 20px max-content;
		}
		s-nav-panel {
			--namespace-height: 1fr;
			--module-height: 1fr;
			--active-height: 1fr;
			display: grid;
			grid-template-rows: var(--namespace-height)
				20px var(--module-height)
				20px var(--active-height);
			padding-right: 8px;
		}
		m-module-nav-selector:not(:last-of-type) {
			padding-bottom: 8px;
		}
		s-editor-panel {
			background-color: var(--surface);
			border: 1px solid var(--background);
			border-right: none;
			border-top-left-radius: 8px;
			border-bottom-left-radius: 8px;
		}
		m-drag-handle {
			background-color: var(--background);
		}
		m-drag-handle.vertical {
			border-top-right-radius: 8px;
			border-bottom-right-radius: 8px;
		}
		m-drag-handle.horizontal {
			border-radius: 8px;
		}
		m-studio-tab-panel {
			padding-left: 8px;
		}
		`,
	];

}
