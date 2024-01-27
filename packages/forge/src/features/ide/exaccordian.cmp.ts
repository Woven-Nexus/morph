import { AegisElement, customElement } from '@roenlie/lit-aegis';
import { emitEvent } from '@roenlie/mimic-core/dom';
import { tooltip } from '@roenlie/mimic-elements/tooltip';
import { sharedStyles } from '@roenlie/mimic-lit/styles';
import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { keyed } from 'lit/directives/keyed.js';
import { live } from 'lit/directives/live.js';
import { map } from 'lit/directives/map.js';
import { repeat } from 'lit/directives/repeat.js';
import { when } from 'lit/directives/when.js';

import { match } from '../directives/switch.js';
import exaccordianStyles from './exaccordian.css' with { type: 'css' };


export interface AccordianAction {
	label: string;
	icon: string;
	action: () => void;
}

export interface AccordianItem {
	id: string;
	name: string;
	editing: boolean;
	folder: boolean;
}

interface AccordianInput extends HTMLInputElement {
	item: AccordianItem;
}


/**
 * @emits input-focusout - Emitted when a editing input field loses focus.
 */
@customElement('m-exaccordian', true)
export class ExaccordianCmp extends AegisElement {

	@property({ type: Boolean }) public expanded?: boolean;
	@property({ type: String }) public header?: string;
	@property({ type: Array }) public actions?: AccordianAction[];
	@property({ type: Array }) public items?: AccordianItem[];

	protected handleInputFocusout(_ev: FocusEvent) {
		//const el = ev.currentTarget as HTMLInputElement & { item: AccordianItem };
		//if (el.item.name) {
		//	//
		//	console.log('save the thing');
		//}

		emitEvent(this, 'input-focusout');
	}

	protected handleInputInput(ev: InputEvent) {
		const el = ev.currentTarget as AccordianInput;
		el.item.name = el.value;
	}

	protected handleInputKeydown(ev: KeyboardEvent) {
		const key = ev.key;
		if (key !== 'Enter')
			return;

		ev.preventDefault();
		const el = ev.currentTarget as AccordianInput;
		el.blur();
	}

	protected renderHeader(text: string) {
		return html`
		<s-accordian-header>
			<mm-icon
				style="font-size:18px;"
				url=${ 'https://icons.getbootstrap.com/assets/icons/chevron-right.svg' }
			></mm-icon>
			<span>
				${ text }
			</span>
			<s-actions>
				${ map(this.actions ?? [], def => {
					return html`
					<mm-button
						${ tooltip(def.label) }
						type="icon"
						variant="text"
						size="small"
						shape="rounded"
						@click=${ def.action }
					>
						<mm-icon
							style="font-size:18px;"
							url=${ def.icon }
						></mm-icon>
					</mm-button>
					`;
				}) }
			</s-actions>
		</s-accordian-header>
		`;
	}

	protected renderContent() {
		return html`
		<s-accordian-content>
			${ when(this.expanded, () =>
				repeat(
					this.items ?? [],
					i => i.id,
					item => this.renderItem(item),
				)) }
		</s-accordian-content>
		`;
	}

	protected renderItem(item: AccordianItem) {
		if (item.editing) {
			this.updateComplete.then(() => {
				const input = this.shadowRoot?.querySelector('input');
				input?.focus();
			});
		}

		return html`
		<s-accordian-item>
			${ match(item, [
				[
					(item) => item.editing, (item) => keyed(item.id, html`
					<input
						.item=${ item }
						.value=${ live(item.name) }
						@focusout=${ this.handleInputFocusout }
						@input=${ this.handleInputInput }
						@keydown=${ this.handleInputKeydown }
					/>
					`),
				],
				[
					item => item.folder, item => html`
					${ item.name }
					`,
				],
			], item => html`
				${ item.name }
			`) }
		</s-accordian-item>
		`;
	}

	protected override render(): unknown {
		return html`
		<s-accordian>
			${ this.renderHeader(this.header ?? '') }
			${ this.renderContent() }
		</s-accordian>
		`;
	}

	public static override styles = [ sharedStyles, exaccordianStyles ];

}
