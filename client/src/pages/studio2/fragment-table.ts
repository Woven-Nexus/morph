import type { EventOf } from '@roenlie/mimic-core/dom';
import { withDebounce } from '@roenlie/mimic-core/timing';
import { customElement, MimicElement } from '@roenlie/mimic-lit/element';
import { css, html, nothing, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { map } from 'lit/directives/map.js';
import { repeat } from 'lit/directives/repeat.js';

import { queryId } from '../../app/queryId.js';
import { throttle } from '../../app/throttle.js';
import { VirtualScrollbar } from '../../features/studio/virtual-scrollbar.cmp.js';
import { getCssStyle } from './better-table.cmp.js';
import { DynamicStyle } from './dynamic-style.cmp.js';
import { intersect } from './intersect-directive.js';

DynamicStyle.register();
VirtualScrollbar.register();


export interface Column<T extends Record<string, any>> {
	fraction?: number;
	minWidth?: number;
	width?: string;
	headerRender?: (data: T[]) => TemplateResult<any>;
	label?: string;
	fieldRender?: (data: T) => TemplateResult<any>;
	field?: string
}


@customElement('f-table1')
export class FragmentTable extends MimicElement {

	@property({ type: Array }) public columns: Column<any>[] = [];
	@property({ type: Array }) public data: Record<string, any>[] = [];
	@property({ type: Boolean }) public dynamic?: boolean;
	@queryId('table') protected table?: HTMLTableElement;
	@queryId('top-buffer') protected topBuffer?: HTMLElement;
	@queryId('bot-buffer') protected botBuffer?: HTMLElement;
	protected tablePromise = this.updateComplete.then(() => this.table);
	protected topBufferPromise = this.updateComplete.then(() => this.topBuffer);

	protected focusRow: number | undefined = undefined;
	protected focusedCell: number | undefined = undefined;
	protected columnIdBeingResized?: string;
	protected rowOverflow = 10;

	protected get rowHeight() {
		return parseInt(getCssStyle(this, [ '--_row-height' ])['--_row-height']);
	}

	protected get visibleRows() {
		let rowCount = Math.floor(this.getBoundingClientRect().height / this.rowHeight);
		if (rowCount % 2 === 1)
			rowCount++;

		return rowCount;
	}

	protected get currentRow() {
		return Math.floor((this.table?.scrollTop ?? 0) / this.rowHeight);
	}

	@state() protected topBufferRange = 0;
	protected updateTopBufferRange() {
		const topBufferEnd = Math.max(0, this.currentRow - this.rowOverflow);

		this.topBufferRange = topBufferEnd;
	}

	@state() protected botBufferRange = 0;
	protected updateBotBufferRange() {
		const dataEndIndex = Math.min(this.currentRow + this.visibleRows + this.rowOverflow, this.data.length);
		const remainingLength = this.data.length - dataEndIndex;

		this.botBufferRange = Math.max(0, remainingLength);
	}

	@state({ hasChanged: () => true }) protected dataRange: Record<string, any>[] = [];
	protected async updateDataRange() {
		const dataStartIndex = Math.max(0, this.currentRow - this.rowOverflow);
		// We add +1 so that it doesn't swap which rows are even and odd.
		const dataEndIndex = Math.min(this.currentRow + this.visibleRows + this.rowOverflow + 1, this.data.length);

		this.dataRange.length = 0;
		for (let i = dataStartIndex; i < dataEndIndex; i++) {
			const item = this.data[i];
			if (item)
				this.dataRange.push(item);
		}
	}

	protected updateDisplayedData() {
		this.updateTopBufferRange();
		this.updateBotBufferRange();
		this.updateDataRange();
	}

	protected interObs: Promise<IntersectionObserver>;

	public override connectedCallback() {
		super.connectedCallback();

		this.interObs = (async () => {
			await this.updateComplete;

			return new IntersectionObserver((entries) => {
				for (const entry of entries) {
					if (!entry.isIntersecting)
						continue;

					if (entry.target.id === 'top-buffer' && this.topBufferRange === 0)
						continue;
					if (entry.target.id === 'bot-buffer' && this.botBufferRange === 0)
						continue;

					const oldScrollTop = this.table!.scrollTop;

					this.updateDisplayedData();

					requestAnimationFrame(() => this.table!.scrollTop = oldScrollTop);
				}
			}, {
				root: this.table,
			});
		})();
	}

	public override afterConnectedCallback() {
		requestAnimationFrame(() => this.updateDisplayedData());
	}

	public override disconnectedCallback() {
		super.disconnectedCallback();
		this.interObs?.disconnect();
	}

	protected getHeaderCell(index: number) {
		return this.shadowRoot!.getElementById(String(index));
	}

	protected getRowCell(rowIndex: number, columnIndex: number) {

	}

	protected initResize(ev: EventOf<HTMLElement>) {
		ev.preventDefault();

		const columnId = ev.target.parentElement?.id;
		this.columnIdBeingResized = columnId;
		if (!columnId)
			return;

		window.addEventListener('mousemove', this.onMouseMove);
		window.addEventListener('mouseup', this.onMouseUp);

		const columnEl = this.shadowRoot!.getElementById(columnId);
		columnEl?.classList.add('header--being-resized');
	}

	protected onMouseMove = (e: MouseEvent) => requestAnimationFrame(() => {
		if (this.columnIdBeingResized === undefined)
			return;

		const columnEl = this.getHeaderCell(parseInt(this.columnIdBeingResized));
		if (!columnEl)
			return;

		// Calculate the desired width
		const columnRect = columnEl.getBoundingClientRect();
		const horizontalScrollOffset = this.scrollLeft;
		const width = (horizontalScrollOffset + e.clientX) - columnRect.x;

		const columnIndex = parseInt(this.columnIdBeingResized);

		// Find the column and set the size
		const column = this.columns[columnIndex];
		if (column)
			column.width = Math.max(column.minWidth ?? 150, width) + 'px'; // Enforce the minimum

		if (!this.dynamic) {
			// For the other headers which don't have a set width, fix it to their computed width
			for (let i = 0; i < this.columns.length; i++) {
				const column = this.columns[i]!;
				if (!column.width) {
					const columnEl = this.getHeaderCell(i)!;
					column.width = columnEl.clientWidth + 'px';
				}
			}
		}

		this.requestUpdate();
	});

	protected onMouseUp = () => {
		window.removeEventListener('mousemove', this.onMouseMove);
		window.removeEventListener('mouseup', this.onMouseUp);

		if (this.columnIdBeingResized) {
			const columnEl = this.shadowRoot?.getElementById(this.columnIdBeingResized);
			columnEl?.classList.remove('header--being-resized');
			this.columnIdBeingResized = undefined;
		}
	};

	protected getDynamicStyling() {
		const isEven = this.topBufferRange % 2 === 0;

		return {
			table: {
				'--_top-buffer-height': (this.topBufferRange * this.rowHeight) + 'px',
				'--_bot-buffer-height': (this.botBufferRange * this.rowHeight) + 'px',
				'--_template-columns':  this.columns.map(({ fraction, width, minWidth }) =>
					width ? width : `minmax(${ minWidth ?? 150 }px, ${ fraction ?? 1 }fr)`).join(' '),
				[isEven ? '--_initial-even' : '--_initial-odd']: 'var(--_row-even-background)',
			},
		};
	}

	protected override render() {
		return html`
		<dynamic-style
			.styles=${ this.getDynamicStyling() }
		></dynamic-style>

		<table id="table">
			<thead>
				<tr>
					${ map(this.columns, (column, i) => html`
					<th id=${ i }>
						${ column.headerRender?.(this.data) ?? column.label ?? nothing }
						<span @mousedown=${ this.initResize } class="resize-handle"></span>
					</th>
					`) }
				</tr>
			</thead>

			<tbody>
				<tr id="top-buffer" ${ intersect(this.interObs) }></tr>

				${ repeat(this.dataRange, data => data, (data, i) => html`
				<tr
					data-row-index=${ i }
					id=${ ifDefined(i === 0 ? 'first-row'
						: i === this.dataRange.length - 1 ? 'last-row'
						: undefined)
					}
				>
				${ map(Object.entries(data), (_, i) => {
					const column = this.columns[i];
					const field = column?.field;
					if (!column)
						return nothing;

					return html`
					<td>
						${ column.fieldRender?.(data) ?? (field ? data[field] : nothing) }
					</td>
					`;
				}) }
				</tr>
				`) }

				<tr id="bot-buffer" ${ intersect(this.interObs) }></tr>
			</tbody>
		</table>

		<m-virtual-scrollbar
			placement="end"
			direction="horizontal"
			.reference=${ this.tablePromise }
			.widthResizeRef=${ this.topBufferPromise }
		></m-virtual-scrollbar>
		<m-virtual-scrollbar
			placement="end"
			direction="vertical"
			.reference=${ this.tablePromise }
		></m-virtual-scrollbar>
		`;
	}

	public static override styles = [
		css`
		* {
			box-sizing: border-box;
		}
		m-virtual-scrollbar {
			--vscroll-size: 12px;
			--vscroll-background: rgb(100 100 100 / 90%);
		}
		m-virtual-scrollbar[direction="vertical"]::part(wrapper) {
			top: 50px;
		}
		:host {
			--_header-color:         var(--header-color, #ffffff);
			--_header-background:    var(--header-background, #009879);
			--_header-bottom-border: var(--header-bottom-border);
			--_row-height:           var(--row-height, 50px);
			--_row-background:       var(--row-background);
			--_row-even-background:  var(--row-even-background, #f3f3f3);
			--_row-bottom-border:    var(--row-bottom-border, 1px solid #dddddd);
			--_table-color:          var(--table-color, black);
			--_table-background:     var(--table-background, white);
			--_table-bottom-border:  var(--table-bottom-border, 2px solid #009879);

			position: relative;
			display: grid;
			overflow: hidden;
		}
		table {
			position: relative;
			overflow: auto;
			display: grid;
			grid-auto-flow: row;
			grid-auto-rows: max-content;
			border-collapse: collapse;
			min-width: 100%;

			font-size: 0.9em;
			box-shadow: 0 0 4px rgba(0, 0, 0, 0.15);
			color: var(--_table-color);
			background: var(--_table-background);
			border-bottom: var(--_table-bottom-border);

			contain: content; /* Used for performance */
		}
		thead, tbody {
			display: contents;
		}
		thead tr {
			position: sticky;
			top: 0;
			z-index: 1;
			color: var(--_header-color);
			background-color: var(--_header-background);
			border-bottom: var(--_header-bottom-border);
		}
		tr {
			display: grid;
			grid-template-columns: var(--_template-columns);
 			height: var(--_row-height);
			content-visibility: auto; /* Used for performance */
  			contain-intrinsic-size: var(--_row-height); /* Used for performance */
		}
		tr#top-buffer {
			all: unset;
			height: var(--_top-buffer-height);
		}
		tr#bot-buffer {
			all: unset;
			height: var(--_bot-buffer-height);
		}
		th, td {
			display: flex;
			place-items: center start;
			padding-inline: 6px;
		}
		th, td,
		th span, td span {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		th {
			position: relative;
			text-align: left;
			font-weight: normal;
			font-size: 1.1rem;
		}
		th:last-child {
			border-right: 0;
		}
		tr th {
			text-align: left;
		}
		tbody tr {
			background-color: var(--_row-background);
			border-bottom: var(--_row-bottom-border);
		}
		tbody tr:nth-of-type(odd) {
			background-color: var(--_initial-odd);
		}
		tbody tr:nth-of-type(even) {
			background-color: var(--_initial-even);
		}
		`,
		css` /* Resize handle */
		.resize-handle {
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			background: black;
			opacity: 0;
			width: 3px;
			cursor: col-resize;
		}
		.resize-handle:hover,
		.header--being-resized .resize-handle {
			opacity: 0.5;
		}
		th:hover .resize-handle {
			opacity: 0.3;
		}
		`,
	];

}
