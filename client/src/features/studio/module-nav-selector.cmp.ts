import { emitEvent, type EventOf } from '@roenlie/mimic-core/dom';
import { customElement, MimicElement } from '@roenlie/mimic-lit/element';
import { css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { map } from 'lit/directives/map.js';

import { sharedStyles } from '../styles/shared-styles.js';


@customElement('m-module-nav-selector')
export class ModuleNavSelector extends MimicElement {

	@property() public header = '';
	@property() public activeItem = '';
	@property({ type: Array }) protected items: {key: string; value: string;}[] = [];

	protected override render(): unknown {
		return html`
		<header>${ this.header }</header>
		<article>
			<ul
				@click=${ (ev: EventOf<HTMLLIElement>) =>
					emitEvent(this, 'm-nav-select-key', { detail: ev.target.id }) }
			>
				${ map(this.items, item => html`
				<li
					id=${ item.key }
					class=${ classMap({ active: this.activeItem == item.key }) }
				>${ item.value }</li>
				`) }
			</ul>
		</article>
		`;
	}

	public static override styles = [
		sharedStyles,
		css`
		:host {
			display: grid;
			overflow: hidden;
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
			overflow: hidden;
			display: grid;
			background-color: var(--surface);
			border-radius: 8px;
			border: 1px solid var(--background);
			padding: 2px;
		}
		ul {
			display: grid;
			grid-auto-rows: max-content;
			overflow: hidden;
			overflow-y: auto;
		}
		ul::-webkit-scrollbar-thumb {
			border-top-right-radius: 8px;
			border-bottom-right-radius: 8px;
		}
		li.active {
			background-color: lime;
		}
		`,
	];

}


declare global {
	interface HTMLElementTagNameMap {
		'm-nav-select-key': ModuleNavSelector;
	}
	interface HTMLElementEventMap {
		'm-nav-select-key': CustomEvent<string>;
	}
}
