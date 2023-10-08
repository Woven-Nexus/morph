import type { EventOf } from '@roenlie/mimic-core/dom';
import { customElement, MimicElement } from '@roenlie/mimic-lit/element';
import { css, html, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';

import { queryId } from '../../app/queryId.js';


export interface Column<T extends Record<string, any>> {
	fraction?: number;
	minWidth?: number;
	width?: string;
	label: string;
	headerRender: (data: T) => TemplateResult<any>;
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
	protected columnIdBeingResized?: string;

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
		const horizontalScrollOffset = this.scrollLeft;
		const width = (horizontalScrollOffset + e.clientX) - columnEl.offsetLeft;

		const columnIndex = parseInt(this.columnIdBeingResized);

		// Find the column and set the size
		const column = this.columns[columnIndex];
		if (column)
			column.width = Math.max(column.minWidth ?? 150, width) + 'px'; // Enforce the minimum

		if (!this.dynamic) {
			// For the other headers which don't have a set width, fix it to their computed width
			this.columns.forEach((column) => {
				if (!column.width) { // isn't fixed yet (it would be a pixel value otherwise)
					column.width = columnEl.clientWidth + 'px';
				}
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

		`;
	}


	public static override styles = [
		css`
		* {
			box-sizing: border-box;
		}
		table {
			display: grid;
			border-collapse: collapse;
			min-width: 100%;
		}
		thead,
		tbody,
		tr {
			display: contents;
		}
		th,
		td {
			display: flex;
			place-items: center start;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			height: 50px;
		}
		td span {
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
			border: 0;
		}
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
		/*
			The following selector is needed so the handle is visible
			during resize even if the mouse isn't over the handle anymore
		*/
		.header--being-resized .resize-handle {
			opacity: 0.5;
		}
		th:hover .resize-handle {
			opacity: 0.3;
		}
		td {
			color: #808080;
		}
		tr:nth-child(even) td {
			background: #f8f6ff;
		}
		`,
	];

}
