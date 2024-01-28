import { AegisElement, customElement, state } from '@roenlie/lit-aegis';
import { emitEvent } from '@roenlie/mimic-core/dom';
import { tooltip } from '@roenlie/mimic-elements/tooltip';
import { sharedStyles } from '@roenlie/mimic-lit/styles';
import { html, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { keyed } from 'lit/directives/keyed.js';
import { live } from 'lit/directives/live.js';
import { map } from 'lit/directives/map.js';
import { repeat } from 'lit/directives/repeat.js';
import { when } from 'lit/directives/when.js';

import { match } from '../directives/switch.js';
import type { ForgeFile } from '../filesystem/forge-file.js';
import exaccordianStyles from './exaccordian.css' with { type: 'css' };


export interface AccordianAction {
	label: string;
	icon: string;
	action: () => void;
}

type ExplorerItem = ExplorerFolder | ExplorerFile;

interface ExplorerFile {
	data: ForgeFile;
	active: boolean;
	selected: boolean;
}

interface ExplorerFolder extends ExplorerFile {
	open: boolean;
	children: ExplorerItem[];
}

interface AccordianItem extends HTMLElement {
	item: ExplorerItem;
}

interface AccordianInput extends HTMLInputElement {
	item: ExplorerItem;
}


/**
 * @emits input-focusout - Emitted when a editing input field loses focus.
 */
@customElement('m-exaccordian', true)
export class ExaccordianCmp extends AegisElement {

	@property({ type: Boolean }) public expanded?: boolean;
	@property({ type: String }) public header?: string;
	@property({ type: Array }) public actions?: AccordianAction[];
	@property({ type: Array }) public items?: ForgeFile[];
	@state() protected roots: ExplorerItem[] = [];
	public activeItem?: ExplorerItem;

	protected override willUpdate(props: Map<PropertyKey, unknown>): void {
		if (props.has('items') && this.items) {
			const files: ExplorerFile[] = [];
			const folders: ExplorerFolder[] = [];
			const roots: ExplorerItem[] = [];

			for (const item of this.items ?? []) {
				let exItem: ExplorerItem;

				if (!item.extension) {
					exItem = {
						active:   false,
						selected: false,
						open:     false,
						data:     item,
						children: [],
					};
					folders.push(exItem);
				}
				else {
					exItem = {
						active:   false,
						selected: false,
						data:     item,
					};
					files.push(exItem);
				}

				if (item.directory === '/')
					roots.push(exItem);
			}

			for (const folder of folders) {
				// find parent folder.
				const parent = folders.find(f => f.data.path === folder.data.directory);
				if (!parent)
					continue; // folder is in root.

				parent.children.push(folder);
			}

			for (const file of files) {
				const folder = folders.find(f => f.data.path === file.data.directory);
				if (!folder)
					continue; // file is in root.

				folder.children.push(file);
			}

			this.roots = roots;
		}
	}

	protected handleItemClick(ev: PointerEvent) {
		const path = ev.composedPath() as HTMLElement[];
		const itemEl = path.find(el =>
			el.localName === 's-accordian-item') as AccordianItem;

		const traverse = (items: ExplorerItem[]) => {
			for (const item of items) {
				item.active = false;
				if ('children' in item)
					traverse(item.children);
			}
		};
		traverse(this.roots);

		itemEl.item.active = true;
		this.activeItem = itemEl.item;

		this.requestUpdate();
	}

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
		el.item.data.name = el.value;
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

	protected renderContent(items: ExplorerItem[], depth: number, root = false): TemplateResult {
		return html`
		<s-accordian-content class=${ classMap({ root }) } style="--depth:${ depth };">
			${ repeat(
				items,
				i => i.data.id,
				item => match(item, [
					[
						item => item.data.editing,
						() => this.renderInput(item),
					],
					[
						item => 'children' in item,
						() => this.renderFolder(item as ExplorerFolder, depth),
					],
				], () => this.renderFile(item)),
			) }
		</s-accordian-content>
		`;
	}

	protected renderInput(item: ExplorerItem): unknown {
		this.updateComplete.then(() =>
			this.shadowRoot?.querySelector('input')?.focus());

		return html`
		<s-accordian-item
			.item=${ item }
			class=${ classMap({ active: item.active }) }
		>
			${ keyed(item.data.id, html`
			<input
				.item=${ item }
				.value=${ live(item.data.name) }
				@focusout=${ this.handleInputFocusout }
				@input=${ this.handleInputInput }
				@keydown=${ this.handleInputKeydown }
			/>
			`) }
		</s-accordian-item>
		`;
	}

	protected renderFile(item: ExplorerFile): TemplateResult {
		return html`
		<s-accordian-item
			.item=${ item }
			class=${ classMap({ active: item.active }) }
		>
			<mm-icon
				style="font-size:12px;"
				url="https://icons.getbootstrap.com/assets/icons/file-earmark-text.svg"
			></mm-icon>
			<s-item>
				${ item.data.name }
			</s-item>
		</s-accordian-item>
		`;
	}

	protected renderFolder(item: ExplorerFolder, depth: number): TemplateResult {
		return html`
		<s-accordian-item
			.item=${ item }
			class=${ classMap({ active: item.active }) }
		>
			<mm-icon
				style="font-size:12px;"
				url=${ item.open
					? 'https://icons.getbootstrap.com/assets/icons/chevron-down.svg'
					: 'https://icons.getbootstrap.com/assets/icons/chevron-right.svg' }
			></mm-icon>
			<mm-icon
				style="font-size:12px;"
				url=${ item.open
					? 'https://icons.getbootstrap.com/assets/icons/folder2-open.svg'
					: 'https://icons.getbootstrap.com/assets/icons/folder2.svg' }
			></mm-icon>
			<s-folder>
				${ item.data.name }
			</s-folder>
		</s-accordian-item>
		${ this.renderContent(item.children, depth + 1) }
		`;
	}

	protected override render(): unknown {
		return html`
		<s-accordian>
			${ this.renderHeader(this.header ?? '') }
			${ when(
				this.expanded,
				() => html`
				<div style="display:contents;" @click=${ this.handleItemClick }>
					${ this.renderContent(this.roots, 1, true) }
				</div>
				`,
			) }
		</s-accordian>
		`;
	}

	public static override styles = [ sharedStyles, exaccordianStyles ];

}


declare global {
	interface HTMLElementTagNameMap {
		'm-exaccordian': ExaccordianCmp;
	}
}
