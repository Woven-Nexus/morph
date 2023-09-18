import { customElement, MimicElement } from '@roenlie/mimic-lit/element';
import { css, html } from 'lit';

import { sharedStyles } from '../styles/shared-styles.js';
import { DragHandleCmp } from './drag-handle.cmp.js';
import { ModuleNavSelector } from './module-nav-selector.cmp.js';

DragHandleCmp.register();
ModuleNavSelector.register();


@customElement('m-module-nav')
export class ModuleNavCmp extends MimicElement {

	protected override render(): unknown {
		return html`
		<m-module-nav-selector header="Namespaces"></m-module-nav-selector>
		<m-drag-handle></m-drag-handle>
		<m-module-nav-selector header="Modules"></m-module-nav-selector>
		<m-drag-handle></m-drag-handle>
		<m-module-nav-selector header="Active"></m-module-nav-selector>
		`;
	}

	public static override styles = [
		sharedStyles,
		css`
		:host {
			--namespace-height: 1fr;
			--module-height: 1fr;
			--active-height: 1fr;
			display: grid;
			grid-template-rows: var(--namespace-height)
			max-content
			var(--module-height)
			max-content
			var(--active-height);
		}
		m-module-nav-selector:first-of-type {
			border-top: none;
			border-top-left-radius: 0px;
			border-top-right-radius: 0px;
		}
		m-module-nav-selector:last-of-type {
			border-bottom: none;
			border-bottom-left-radius: 0px;
			border-bottom-right-radius: 0px;
		}
		`,
	];

}
