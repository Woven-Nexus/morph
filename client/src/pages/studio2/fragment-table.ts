import type { EventOf } from '@roenlie/mimic-core/dom';
import { customElement, MimicElement } from '@roenlie/mimic-lit/element';
import { css, html, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';

import { queryId } from '../../app/queryId.js';
import { VirtualScrollbar } from '../../features/studio/virtual-scrollbar.cmp.js';

VirtualScrollbar.register();


export interface Column<T extends Record<string, any>> {
	fraction?: number;
	minWidth?: number;
	width?: string;
	label: string;
	headerRender: (data: T[]) => TemplateResult<any>;
	fieldRender: (data: T) => TemplateResult<any>;
}


@customElement('f-table1')
export class FragmentTable1 extends MimicElement {

	@property({ type: Object }) public mapper: () => any;
	@property({ type: Array }) public columns: {
		fraction?: number;
		minWidth?: number;
		width?: string;
		label: string;
		headerRender: (data: any[]) => TemplateResult<any>;
		fieldRender: (data: any) => TemplateResult<any>;
	}[] = [];

	@property({ type: Array }) public data: Record<string, any>[] = [];
	@property({ type: Boolean }) public dynamic?: boolean;
	@queryId('table') protected table?: HTMLTableElement;
	protected focusRow: number | undefined = undefined;
	protected focusedCell: number | undefined = undefined;
	protected columnIdBeingResized?: string;

	protected getHeaderCell(index: number) {

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

		const columnEl = this.shadowRoot!.getElementById(this.columnIdBeingResized);
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
			this.columns.forEach((column) => {
				if (!column.width)
					column.width = columnEl.clientWidth + 'px';
			});
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

	protected override render() {
		return html`
		<style>
			table#table {
				grid-template-columns:${ this.columns.map(({ fraction, width, minWidth }) => {
					return width ? width : `minmax(${ minWidth ?? 150 }px, ${ fraction ?? 1 }fr)`;
				}).join(' ') };
			}
		</style>

		<table id="table">
			<thead>
				<tr>
					${ map(this.columns, (column, i) => html`
					<th id=${ i }>
						${ column.headerRender(this.data) }
						<span @mousedown=${ this.initResize } class="resize-handle"></span>
					</th>
					`) }
				</tr>
			</thead>

			<tbody>
				${ map(this.data, data => html`
				<tr>
					${ map(Object.entries(data), (_, i) => html`
					<td>
					${ this.columns[i]?.fieldRender(data) }</td>
					`) }
				</tr>
				`) }
			</tbody>

		</table>

		<m-virtual-scrollbar
			placement="end"
			direction="horizontal"
			.reference=${ this.updateComplete
				.then(() => this.shadowRoot?.getElementById('table')) }
		></m-virtual-scrollbar>

		<m-virtual-scrollbar
			placement="end"
			direction="vertical"
			.reference=${ this.updateComplete
				.then(() => this.shadowRoot?.getElementById('table')) }
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
			position: relative;
			display: grid;
			overflow: hidden;
		}
		table {
			position: relative;
			overflow: auto;
			display: grid;
			border-collapse: collapse;
			min-width: 100%;

			font-size: 0.9em;
			box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
			color: black;
			border-bottom: 2px solid #009879;
		}
		thead, tbody, tr {
			display: contents;
		}
		th, td {
			display: flex;
			place-items: center start;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			height: 50px;
			padding-inline: 6px;
		}
		th span, td span {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		th {
			position: sticky;
			top: 0;
			background: #6c7ae0;
			text-align: left;
			font-weight: normal;
			font-size: 1.1rem;
			color: white;
		}
		th:last-child {
			border-right: 0;
		}
		tr th {
			background-color: #009879;
			color: #ffffff;
			text-align: left;
		}
		tr td {
			border-bottom: 1px solid #dddddd;
		}
		tr:nth-of-type(even) td {
			background-color: #f3f3f3;
		}
		tr.active-row td {
			font-weight: bold;
			color: #009879;
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
		css` /* Using subgrid, slower than display: contents. */
		/*thead tr {
			position: sticky;
			top: 0;
			z-index: 1;
		}
		tr {
			display: grid;
			grid-template-columns: subgrid;
			grid-column: 1 / 9;
		}*/
		`,
	];

}
