import { customElement, MimicElement } from '@roenlie/mimic-lit/element';
import { css, html } from 'lit';

import { sharedStyles } from '../styles/shared-styles.js';


@customElement('m-drag-handle')
export class DragHandleCmp extends MimicElement {

	protected override render(): unknown {
		return html`
		<s-drag-wrapper>
			<s-drag-handle></s-drag-handle>
		</s-drag-wrapper>
		`;
	}

	public static override styles = [
		sharedStyles,
		css`
		:host {
			display: contents;
		}
		s-drag-wrapper {
			pointer-events: none;
			display: grid;
			place-items: center;
			height: 20px;
		}
		s-drag-handle {
			pointer-events: auto;
			display: block;
			height: 4px;
			width: 60px;
			background-color: var(--drag-handle);
			border-radius: 4px;
			cursor: ns-resize;
		}
		`,
	];

}
