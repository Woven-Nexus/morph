import { customElement, MimicElement } from '@roenlie/mimic-lit/element';
import { css, html } from 'lit';
import { property } from 'lit/decorators.js';

import { sharedStyles } from '../styles/shared-styles.js';


@customElement('m-module-nav-selector')
export class ModuleNavSelector extends MimicElement {

	@property() public header = '';

	protected override render(): unknown {
		return html`
		<header>${ this.header }</header>
		<article></article>
		`;
	}

	public static override styles = [
		sharedStyles,
		css`
		:host {
			display: grid;
			grid-template-rows: max-content 1fr;
			background-color: var(--shadow1);
		}
		header {
			height: 40px;
			padding-inline: 20px;
			display: grid;
			place-items: center start;
		}
		article {
			display: grid;
			background-color: var(--surface);
			border-radius: 8px;
			border: 1px solid var(--background);
		}
		`,
	];

}
