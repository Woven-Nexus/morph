import { sleep } from '@roenlie/mimic-core/async';
import { domId } from '@roenlie/mimic-core/dom';
import { debounce } from '@roenlie/mimic-core/timing';
import type { ComputedFlat } from '@roenlie/mimic-core/types';
import { customElement, MimicElement } from '@roenlie/mimic-lit/element';
import { css, html } from 'lit';
import { property, queryAssignedElements, state } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';

import { queryId } from '../../app/queryId.js';


@customElement('b-table')
class BetterTable extends MimicElement {

	@queryAssignedElements() protected slotEls: HTMLElement[];
	@queryId('clone-target') protected cloneTarget: HTMLElement;

	protected obs = new MutationObserver((entries) => {
		//console.log('tree mutated', entries);
		let redoWidthCalculations = false;

		for (const entry of entries) {
			const slot = (entry.target as Element).assignedSlot;
			const parent = (slot?.parentNode as ShadowRoot | undefined)?.host;
			const isCell = parent instanceof BetterTableHeaderCell
				||	parent instanceof BetterTableBodyCell;

			if (isCell)
				redoWidthCalculations = true;
		}

		if (redoWidthCalculations)
			this.onSlotChange();
	});

	public override connectedCallback(): void {
		super.connectedCallback();
		this.setAttribute('prepearing', '');
		this.obs.observe(this, { characterData: true, childList: true, subtree: true });
	}

	public override disconnectedCallback(): void {
		super.disconnectedCallback();
		this.obs.disconnect();
	}

	protected onSlotChange = debounce(async () => {
		for (const el of this.slotEls) {
			if (el instanceof BetterTableHead)
				el.slot = 'header';
			if (el instanceof BetterTableBody)
				el.slot = 'body';
			if (el instanceof BetterTableFooter)
				el.slot = 'footer';
		}

		const id = domId(5);
		const rows = [ ...this.querySelectorAll<BetterTableRow>('b-tr') ];
		const columnWidths: number[] = [];

		console.time('getting column widths: ' + id);
		for (const row of rows) {
			const fields = [ ...row.querySelectorAll('b-td, b-th') ];
			const fieldWidths: number[] = [];

			for (let i = 0; i < fields.length; i++) {
				const field = fields[i]!;
				const cloned = field.cloneNode(true) as HTMLElement;
				this.cloneTarget.replaceChildren(cloned);

				// TODO need another alternative to sleeping here.
				// As it is waaaaaay too slow.
				//await sleep(0);

				const clonedWidth = this.cloneTarget.getBoundingClientRect().width;
				fieldWidths[i] = clonedWidth;
			}

			for (let i = 0; i < fieldWidths.length; i++) {
				const width = fieldWidths[i]!;
				columnWidths[i] = (columnWidths[i] ?? 0) > width
					? (columnWidths[i] ?? 0)
					: width;
			}
		}
		console.timeEnd('getting column widths: ' + id);

		while (this.cloneTarget.hasChildNodes())
			this.cloneTarget.removeChild(this.cloneTarget.firstChild!);

		for (const row of rows)
			row.columnWidths = columnWidths;

		this.removeAttribute('prepearing');
	}, 100);

	protected updateColumn(columnIndex: number) {

	}

	protected override render(): unknown {
		return html`
		<slot name="header"></slot>
		<slot name="body"></slot>
		<slot name="footer"></slot>
		<slot style="display:none;" @slotchange=${ this.onSlotChange }></slot>
		<div id="clone-target"></div>
		`;
	}

	public static override styles = [
		css`
		:host {
			width: fit-content;
			display: grid;
			grid-auto-flow: row;
			grid-auto-rows: max-content;
		}
		:host([prepearing=""]) {
			visibility: hidden;
		}
		#clone-target {
			position: fixed;
			visibility: hidden;
		}
		`,
	];

}
BetterTable.register();


@customElement('b-thead')
class BetterTableHead extends MimicElement {

	protected override render() {
		return html`
		<slot>

		</slot>
		`;
	}

}
BetterTableHead.register();


@customElement('b-tbody')
class BetterTableBody extends MimicElement {

	protected override render() {
		return html`
		<slot>

		</slot>
		`;
	}

}
BetterTableBody.register();


@customElement('b-tr')
class BetterTableRow extends MimicElement {

	@property({
		type: Array,
		// TODO, make this check each entry if it is different
		hasChanged(value: number[], oldValue: number[]) {
			return true;
		},
	}) public columnWidths: number[] = [];

	public get fieldCount() {
		return this.querySelectorAll('b-td, b-th').length;
	}

	protected onSlotChange(ev: Event) {
		//console.log('slot changed in td');
	}

	protected override render() {
		return html`
		<style>
			${ map(this.columnWidths, (width, i) => css`
			::slotted(*:nth-child(${ i + 1 })) {
				--btable-td-width: ${ width }px;
			}
			`) }
		</style>

		<slot @slotchange=${ this.onSlotChange }></slot>
		`;
	}

	public static override styles = [
		css`
		:host {
			width: max-content;
			display: grid;
			grid-auto-flow: column;
			grid-auto-column: auto;
		}
		`,
	];

}
BetterTableRow.register();


@customElement('b-th')
class BetterTableHeaderCell extends MimicElement {

	protected override render() {
		return html`
		<slot>

		</slot>
		`;
	}

	public static override styles = [
		css`
		:host {
			--_btable-td-width: auto;
			width: var(--btable-td-width, var(--_btable-td-width));
			display: grid;

			outline: 1px solid lime;
		}
		`,
	];

}
BetterTableHeaderCell.register();


@customElement('b-td')
class BetterTableBodyCell extends MimicElement {


	protected override render() {
		return html`
		<slot></slot>
		`;
	}

	public static override styles = [
		css`
		:host {
			--_btable-td-width: auto;
			width: var(--btable-td-width, var(--_btable-td-width));
			display: grid;

			outline: 1px solid lime;
		}
		`,
	];

}
BetterTableBodyCell.register();


@customElement('b-tfooter')
class BetterTableFooter extends MimicElement {

	protected override render() {
		return html`
		<slot>

		</slot>
		`;
	}

}
BetterTableBody.register();


const canvas = document.createElement('canvas');

/**
 * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
 *
 * @param {String} text The text to be rendered.
 * @param {String} font The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana").
 *
 * @see https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
 */
export const getTextWidth = (text: string, font: `${ string } ${ string } ${ string }`) => {
	// re-use canvas object for better performance
	const context = canvas.getContext('2d')!;
	context.font = font;
	const metrics = context.measureText(text);

	return metrics.width;
};

export const getCssStyle = <const T extends string>(element: Element, props: T[]) => {
	const styles = getComputedStyle(element);
	const _props: Record<T, string> = {} as any;

	for (const prop of props) {
		const value = styles.getPropertyValue(prop);
		_props[prop] = value !== 'none' ? value : '';
	}

	return _props as ComputedFlat<typeof _props>;
};

export const getCanvasFont = (el: Element = document.body, overrides?: {
	weight?: string;
	size?: string;
	family?: string;
}) => {
	const props = getCssStyle(el, [ 'font-weight', 'font-size', 'font-family' ]);
	const data = {
		weight: props['font-weight'] || 'normal',
		size:   props['font-size'] || '16px',
		family: props['font-family'] || 'Times New Roman',
		...overrides,
	};

	return `${ data.weight } ${ data.size } ${ data.family }` as const;
};
