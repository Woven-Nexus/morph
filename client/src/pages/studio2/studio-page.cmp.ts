import './better-table.cmp.js';

import { range } from '@roenlie/mimic-core/array';
import { maybe } from '@roenlie/mimic-core/async';
import { customElement, MimicElement } from '@roenlie/mimic-lit/element';
import { css, html } from 'lit';
import { map } from 'lit/directives/map.js';

import { serverUrl } from '../../app/backend-url.js';
import type { DbResponse } from '../../app/response-model.js';
import type { Module } from '../../features/code-module/module-model.js';
import { sharedStyles } from '../../features/styles/shared-styles.js';


@customElement('m-studio-page')
export class StudioPageCmp extends MimicElement {

	public override async connectedCallback() {
		super.connectedCallback();

		const url = new URL(serverUrl + `/api/code-modules/all`);
		const [ result ] = await maybe<DbResponse<Module>>((await fetch(url)).json());
		if (!result)
			return;

		console.log(result);
	}

	protected override render(): unknown {
		return html`
		<b-table>
			<b-thead>
				<b-tr>
					<b-th>
						<!-- this is a comment -->
						column 1
					</b-th>
					<b-th>column 2</b-th>
					<b-th>column 3</b-th>
				</b-tr>
			</b-thead>
			<b-tbody>
				${ map(range(200), () => html`
				<b-tr>
					<b-td>row 1 field 1</b-td>
					<b-td>row 1 field 2</b-td>
					<b-td>row 1 field 3 longoboi</b-td>
					<b-td>row 1 field 3</b-td>
				</b-tr>
				`) }
			</b-tbody>
		</b-table>
		`;
	}


	public static override styles = [
		sharedStyles,
		css`
		:host {

		}
		b-td, b-th {
			/*max-width: 100px;*/
			/*overflow: hidden;*/
			/*white-space: nowrap;*/
		}
		.styled-table {
			border-collapse: collapse;
			margin: 25px 0;
			font-size: 0.9em;
			font-family: sans-serif;
			width: 400px;
			height: max-content;
			box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
		}
		.styled-table thead tr {
			background-color: #009879;
			color: #ffffff;
			text-align: left;
			height: 50px;

		}
		.styled-table th,
		.styled-table td {

		}
		.styled-table td s-grid-cell-outer {
			display: grid;
			place-items: center start;
			overflow: hidden;
		}
		.styled-table td s-grid-cell-inner {

		}
		.styled-table tbody tr {
			height: 50px;

			border-bottom: 1px solid #dddddd;
		}
		.styled-table tbody tr:nth-of-type(even) {
			background-color: #f3f3f3;
		}

		.styled-table tbody tr:last-of-type {
			border-bottom: 2px solid #009879;
		}
		.styled-table tbody tr.active-row {
			font-weight: bold;
			color: #009879;
		}
		`,
	];

}
