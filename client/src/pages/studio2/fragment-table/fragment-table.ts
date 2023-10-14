import type { EventOf } from '@roenlie/mimic-core/dom';
import type { PathOf } from '@roenlie/mimic-core/types';
import { customElement, MimicElement } from '@roenlie/mimic-lit/element';
import { css, html, nothing, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';

import { queryId } from '../../../app/queryId.js';
import { VirtualScrollbar } from '../../../features/studio/virtual-scrollbar.cmp.js';
import { DynamicStyle } from '../dynamic-style.cmp.js';
import { RowRenderController } from './row-render-controller.js';

DynamicStyle.register();
VirtualScrollbar.register();


export interface Column<T extends Record<string, any>> {
	width?: number;
	minWidth?: number;
	defaultWidth?: number;
	label?: string;
	field?: PathOf<T>;
	headerRender?: (data: T[]) => TemplateResult<any>;
	fieldRender?: (data: T) => TemplateResult<any>;
}


@customElement('f-table1')
export class FragmentTable extends MimicElement {

	@property({ type: Array }) public columns: Column<any>[] = [];
	@property({ type: Array }) public data: Record<string, any>[] = [];
	@property({ type: Boolean }) public dynamic?: boolean;
	@queryId('table') protected table?: HTMLTableElement;
	@queryId('top-buffer') protected topBuffer?: HTMLElement;
	@queryId('bot-buffer') protected botBuffer?: HTMLElement;
	protected tablePromise: Promise<HTMLTableElement | undefined>;
	protected topBufferPromise: Promise<HTMLElement | undefined>;
	protected focusRow: number | undefined = undefined;
	protected focusedCell: number | undefined = undefined;
	protected columnIdBeingResized?: string;
	protected readonly rowRenderingCtrl = new RowRenderController(this);

	public override connectedCallback() {
		super.connectedCallback();

		this.tablePromise = this.updateComplete.then(() => this.table);
		this.topBufferPromise = this.updateComplete.then(() => this.topBuffer);
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

	protected onMouseMove = (() => {
		let event: MouseEvent;
		const func = () => {
			if (this.columnIdBeingResized === undefined)
				return;

			const columnEl = this.getHeaderCell(parseInt(this.columnIdBeingResized));
			if (!columnEl)
				return;

			// Calculate the desired width
			const columnRect = columnEl.getBoundingClientRect();
			const horizontalScrollOffset = this.scrollLeft;
			const width = (horizontalScrollOffset + event.clientX) - columnRect.x;

			const columnIndex = parseInt(this.columnIdBeingResized);

			// Find the column and set the size
			const column = this.columns[columnIndex];
			if (column)
				column.width = Math.max(column.minWidth ?? 150, width); // Enforce the minimum


			if (!this.dynamic) {
				// For the other headers which don't have a set width, fix it to their computed width
				for (let i = 0; i < this.columns.length; i++) {
					const column = this.columns[i]!;
					if (!column.width) {
						const columnEl = this.getHeaderCell(i)!;
						column.width = columnEl.clientWidth;
					}
				}
			}

			this.requestUpdate();
		};

		return (ev: MouseEvent) => {
			event = ev;
			requestAnimationFrame(func);
		};
	})();

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
		return {
			table: {
				'--_template-columns': this.columns.map(
					({ width, minWidth, defaultWidth }) => width ? width + 'px'
						: `minmax(${ minWidth ?? 150 }px, ${ defaultWidth ?? 150 }px)`,
				).join(' ') + ' 25px',
			},
		};
	}

	protected renderHeader() {
		return html`
		<tr>
			${ map(this.columns, (column, i) => html`
			<th id=${ i }>
				${ column.headerRender?.(this.data) ?? column.label ?? nothing }
				<span @mousedown=${ this.initResize } class="resize-handle"></span>
			</th>
			`) }
			<th></th>
		</tr>
		`;
	}

	protected override render() {
		return html`
		${ this.rowRenderingCtrl.DynamicStyles() }

		<dynamic-style
			.styles=${ this.getDynamicStyling() }
		></dynamic-style>

		<table id="table">
			<thead>
				${ this.renderHeader() }
			</thead>

			<tbody>
				${ this.rowRenderingCtrl.Rows() }
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

		thead tr {
			position: sticky;
			top: 0;
			z-index: 1;
			color: var(--_header-color);
			background-color: var(--_header-background);
			border-bottom: var(--_header-bottom-border);
		}
		thead th {
			position: relative;
			text-align: left;
			font-weight: normal;
			font-size: 1.1rem;
		}
		thead th:last-child {
			border-right: 0;
		}
		thead tr th {
			text-align: left;
		}
		`,
		RowRenderController.styles,
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
