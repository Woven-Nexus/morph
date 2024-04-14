import { html } from '../../../utilities/template-tag.js';
import { type VoidElement, voidElement } from '../../assets/void-element.js';
import { tablesContents } from './tables-contents.js';
import { tablesList } from './tables-list.js';


class TablesBody implements VoidElement {

	public tagName = 'm-tables-body';
	public styleUrls = [ '/tables/assets/tables-body.css' ];
	public scriptUrls: string | string[];
	public render(): Promise<string> {
		return html`
		<aside>
			${ tablesList({
				attrs: { 'void-id': 'tables-list' },
			}) }
		</aside>
		<main>
			${ tablesContents({
				attrs: { 'void-id': 'tables-contents' },
			}) }
		</main>
		`;
	}

}


export const tablesBody = voidElement(TablesBody);
