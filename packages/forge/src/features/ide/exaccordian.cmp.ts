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
	parent: ExplorerFolder | undefined;
}

interface ExplorerFolder extends ExplorerFile {
	open: boolean;
	children: ExplorerItem[];
	parent: ExplorerFolder | undefined;
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

	protected static isFolder(item?: ExplorerItem): item is ExplorerFolder {
		return !!(item && 'open' in item);
	}

	protected static isFile(item?: ExplorerItem): item is ExplorerFile {
		return !!(item && !('open' in item));
	}

	protected static findFromPath = <T>(event: Event, find: (el: HTMLElement) => boolean): T | undefined => {
		return event.composedPath().find(el => find(el as HTMLElement)) as T | undefined;
	};

	@property({ type: Boolean }) public expanded?: boolean;
	@property({ type: String }) public header?: string;
	@property({ type: Array }) public actions?: AccordianAction[];
	@property({ type: Array }) public items?: ForgeFile[];
	@state() protected roots: ExplorerItem[] = [];
	protected itemSet = new Set<ExplorerItem>();
	public get activeItem(): ExplorerItem | undefined {
		let item: ExplorerItem | undefined = undefined;
		this.itemSet.forEach(node => {
			if (node.active)
				item = node;
		});

		return item;
	}

	public setActiveItem(id: string) {
		this.itemSet.forEach(node => { node.active = node.data.id === id; });

		// open any parent folders that contain the active item.
		let currentItem = this.activeItem?.parent;
		while (ExaccordianCmp.isFolder(currentItem)) {
			currentItem.open = true;
			currentItem = currentItem.parent;
		}

		this.requestUpdate();
	}

	protected traverse(items: ExplorerItem[], fn: (item: ExplorerItem) => void) {
		const visitedItems = new WeakSet();
		const trav = (items: ExplorerItem[], fn: (item: ExplorerItem) => void) => {
			for (const item of items) {
				if (visitedItems.has(item))
					continue;

				visitedItems.add(item);
				fn(item);

				if ('children' in item)
					trav(item.children, fn);
			}
		};
		trav(items, fn);
	}

	protected override willUpdate(props: Map<PropertyKey, unknown>): void {
		if (props.has('items') && this.items) {
			const itemSet = new Set<ExplorerItem>();
			const files: ExplorerFile[] = [];
			const folders: ExplorerFolder[] = [];
			const roots: ExplorerItem[] = [];

			for (const item of this.items ?? []) {
				let exItem: ExplorerItem | undefined = undefined;

				this.itemSet.forEach(node => {
					if (node.data.id === item.id)
						exItem = node;
				});

				if (!item.extension && !item.editing) {
					if (!exItem) {
						exItem = {
							active:   false,
							selected: false,
							open:     false,
							data:     item,
							children: [],
							parent:   undefined,
						} satisfies ExplorerFolder;
					}

					// If going from an editing state to a folder.
					// the open property has not been added, even if the item exists.
					exItem.open = !!exItem.open;
					folders.push(exItem);
				}
				else {
					if (!exItem) {
						exItem = {
							active:   false,
							selected: false,
							data:     item,
							parent:   undefined,
						} satisfies ExplorerFile;
					}

					files.push(exItem);
				}

				// We clear out the children, as we relink these below.
				if (ExaccordianCmp.isFolder(exItem))
					exItem.children = [];

				if (item.directory === '/')
					roots.push(exItem);

				itemSet.add(exItem);
			}

			// Link folder hierarchy structure then add files into the correct folders.
			for (const item of [ ...folders, ...files ]) {
				// find parent folder.
				const parent = folders.find(f => f.data.path === item.data.directory);
				if (!parent)
					continue; // folder is in root.

				item.parent = parent;
				if (!parent.children.some(i => i === item))
					parent.children.push(item);
			}

			// open any parent folders that contain an item being edited.
			for (const file of files) {
				if (!file.data.editing)
					continue;

				let currentItem = file.parent;
				while (ExaccordianCmp.isFolder(currentItem)) {
					currentItem.open = true;
					currentItem = currentItem.parent;
				}
			}

			this.roots = roots;
			this.itemSet = itemSet;
		}
	}

	protected handleItemClick(ev: PointerEvent) {
		ev.preventDefault();

		const item = ExaccordianCmp .findFromPath<AccordianItem>(
			ev, el => el.localName === 's-accordian-item',
		)?.item;

		if (!item)
			return;

		if (ExaccordianCmp.isFolder(item))
			item.open = !item.open;

		emitEvent(this, 'select-item', { detail: item?.data });
		this.requestUpdate();
	}

	protected handleInputFocusout(_ev: FocusEvent) {
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
				item => item.data.id,
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
		</s-accordian-item>
		`) }
		`;
	}

	protected renderFile(item: ExplorerFile): unknown {
		return html`
		<s-accordian-item
			.item=${ item }
			class=${ classMap({ active: item.active }) }
		>
			<span></span>
			<mm-icon
				style="font-size:12px;"
				url="https://icons.getbootstrap.com/assets/icons/file-earmark-text.svg"
			></mm-icon>
			<s-item>
				${ item.data.name }${ item.data.extension }
			</s-item>
		</s-accordian-item>
		`;
	}

	protected renderFolder(item: ExplorerFolder, depth: number): unknown {
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
		${ when(item.open, () => this.renderContent(item.children, depth + 1)) }
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
