import { customElement, MimicElement } from '@roenlie/mimic-lit/element';
import { html } from 'lit';

import { sharedStyles } from '../styles/shared-styles.js';
import styles from './drag-handle.ccss';


@customElement('m-drag-handle')
export class DragHandleCmp extends MimicElement {

	protected override render(): unknown {
		return html`
		<s-drag-handle></s-drag-handle>
		`;
	}

	public static override styles = [
		sharedStyles,
		styles,
	];

}
