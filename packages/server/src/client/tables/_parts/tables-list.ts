import { tableExists } from '../../../features/sqlite/table-exists.js';
import { html } from '../../../utilities/template-tag.js';
import { type VoidElement, voidElement } from '../../assets/void/void-element.js';


interface TableEntry {
	name: string;
	exists: () => boolean;
	demoData?: boolean;
}


class TablesList implements VoidElement {

	public tagName = 'm-tables-list';
	public styleUrls = [ '/tables/assets/tables-list.css' ];
	public scriptUrls: string | string[];
	public render(): Promise<string> {
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

		return html`
		<ul>
		${ listOfTables.map(table => {
			return html`
			<li>
				<button
					void-get="/tables/${ table.name }"
					void-target="tables-contents"
				>
					${ table.name }
				</button>
				${ !table.exists() ? html`
				<button
					void-get="/tables/create/${ table.name }"
					void-target="tables-list"
				>
					Create
				</button>
				` : '' }
				${ table.exists() ? html`
				${ table.demoData ? html`
				<button
					void-get="/tables/demo/${ table.name }"
					void-target="tables-list,tables-contents"
					void-confirm="Confirm adding demo data to table: ${ table.name }"
				>
					Add demo data
				</button>
				` : '' }
				<button
					void-get="/tables/drop/${ table.name }"
					void-target="tables-list,tables-contents"
					void-confirm="Confirm deleting table: ${ table.name }"
				>Drop</button>
				` : '' }
			</li>
			`;
		}) }
		</ul>
		`;
	}

}


export const tablesList = voidElement(TablesList);
