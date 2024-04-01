import { template } from '../../../utilities/template.js';
import { css, html } from '../../../utilities/template-tag.js';
import { tableExists } from '../../sqlite/table-exists.js';


export const tableList = () => {
	interface TableEntry {
		name: string;
		exists: () => boolean;
		demoData?: boolean;
	}

	const listOfTables: TableEntry[] = [
		{
			name:     'users',
			exists:   () => tableExists('users'),
			demoData: true,
		},
		{
			name:     'modules',
			exists:   () => tableExists('modules'),
			demoData: true,
		},
		{
			name:   'OTP',
			exists: () => tableExists('OTP'),
		},
	];

	return template({
		name:     'list-of-tables',
		template: html`
		<ul id="table-list">
		${ listOfTables.map(table => {
			return html`
			<li>
				<button
					hx-get="/tables/${ table.name }"
					hx-target="main"
					hx-swap="innerHTML"
				>
					${ table.name }
				</button>
				${ !table.exists() ? html`
				<button
					hx-get="/tables/create/${ table.name }"
					hx-target="#table-list"
					hx-swap="outerHTML"
				>
					Create
				</button>
				` : '' }
				${ table.exists() ? html`
				${ table.demoData ? html`
				<button>Add demo data</button>
				` : '' }
				<button
					hx-get="/tables/drop/${ table.name }"
					hx-target="#table-list"
					hx-swap="outerHTML"
				>Drop</button>
				` : '' }
			</li>
			`;
		}) }
		</ul>
		`,
		style: css`
		ul#table-list {
			display: grid;
			grid-auto-rows: max-content;
			gap: 8px;
		}
		ul#table-list li {
			display: grid;
			grid-template-columns: 1fr;
			grid-auto-flow: column;
			grid-auto-columns: max-content;
			padding-block: 4px;
			padding-inline: 8px;
			background-color: rgb(20 20 20 / 20%);
		}
		`,
	});
};
