import { createPromiseResolver, sleep } from '@roenlie/mimic-core/async';
import { domId } from '@roenlie/mimic-core/dom';
import { debounce } from '@roenlie/mimic-core/timing';
import type { ComputedFlat } from '@roenlie/mimic-core/types';
import { watch } from '@roenlie/mimic-lit/decorators';
import { customElement, MimicElement } from '@roenlie/mimic-lit/element';
import { css, CSSResult, html, unsafeCSS } from 'lit';
import { property, queryAssignedElements, state } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';

import { queryId } from '../../app/queryId.js';


@customElement('b-table')
class BetterTable extends MimicElement {

	protected static getPath(startEl: Element | ShadowRoot) {
		const path: Element[] = [];

		type El = (HTMLElement & ShadowRoot);
		let el = startEl as El;
		do
			path.push(el);
		while ((el = el.host as El ||
			el.parentNode ||
			el.parentElement as El ||
			el.offsetParent as El) && el);

		return path;
	}

	@queryAssignedElements() protected slotEls: HTMLElement[];
	@queryId('clone-target') protected cloneTarget: HTMLElement;
	@state() protected columnProps = '';
	protected columnWidths: number[] = [];
	protected measurementOngoing: Promise<any> | undefined = undefined;

	protected obs = new MutationObserver((entries) => {
		let redoWidthCalculations = false;

		for (const entry of entries) {
			const slot = (entry.target as Element);
			const path = BetterTable.getPath(slot);

			redoWidthCalculations = path.some(el =>
				el instanceof BetterTableHeaderCell || el instanceof BetterTableBodyCell);
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

	protected readonly elementsToMeasure: Element[][] = [];
	protected async onSlotChange() {
		await this.measurementOngoing;
		const [ promise, resolve ] = createPromiseResolver();
		this.measurementOngoing = promise;
		this.setAttribute('prepearing', '');

		for (const el of this.slotEls) {
			if (el instanceof BetterTableHead)
				el.slot = 'header';
			if (el instanceof BetterTableBody)
				el.slot = 'body';
			if (el instanceof BetterTableFooter)
				el.slot = 'footer';
		}

		const rows = this.querySelectorAll<BetterTableRow>('b-tr');

		for (const row of rows) {
			const fields = row.querySelectorAll('b-td, b-th');

			for (let i = 0; i < fields.length; i++) {
				const field = fields[i]!;

				this.elementsToMeasure[i] ??= [];
				this.elementsToMeasure[i]?.push(field);
			}
		}

		this.columnProps = '';
		await sleep(0);

		const columnWidths: number[] = [];
		for (let i = 0; i < this.elementsToMeasure.length; i++) {
			const elements = this.elementsToMeasure[i]!;
			let width = 0;
			for (const element of elements)
				width = Math.max(element.getBoundingClientRect().width, width);

			columnWidths[i] = width;
			elements.length = 0;
		}

		this.columnWidths = columnWidths;
		this.columnProps = columnWidths
			.map((width, i) => `--btable-td-width${ i + 1 }:${ width }px;`)
			.join('\n');

		this.removeAttribute('prepearing');

		resolve();
	}

	protected getPath() {

	}

	protected override render(): unknown {
		return html`
		<style>
			::slotted(*) {
				${ this.columnProps }
			}
		</style>

		<slot name="header"></slot>
		<slot name="body"></slot>
		<slot name="footer"></slot>
		<slot style="display:none;" @slotchange=${ this.onSlotChange }></slot>
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
		const style: CSSResult[] = [];
		for (let i = 0; i < this.fieldCount; i++) {
			style.push(css`
			::slotted(*:nth-child(${ i + 1 })) {
				--btable-td-width: var(--btable-td-width${ i + 1 });
			}
			`);
		}

		return html`
		<style>
		${ style }
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
