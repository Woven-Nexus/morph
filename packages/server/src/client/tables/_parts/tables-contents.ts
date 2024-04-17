import { Query } from '../../../features/sqlite/query.js';
import { tableExists } from '../../../features/sqlite/table-exists.js';
import { html } from '../../../utilities/template-tag.js';
import { type VoidElement, voidElement } from '../../assets/void/void-element.js';


class TablesContents implements VoidElement {

	public tagName = 'm-tables-contents';
	public styleUrls = [ '/tables/assets/tables-contents.css' ];
	public scriptUrls: string | string[];
	public render({ name }: { name?: string; }): Promise<string> {
		let items: object[] = [];
		if (name && tableExists(name)) {
			using query = new Query();
			items = query.from(name).query();
		}

		if (!name)
			return html``;

		return html`
		<h1>${ name }</h1>
		<monaco-editor
			language="json"
		>${ JSON.stringify(items, undefined, '\t') }</monaco-editor>
		`;
	}

}


export const tablesContents = voidElement(TablesContents);
