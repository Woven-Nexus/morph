import { template } from '../../../utilities/template.js';
import { css, html } from '../../../utilities/template-tag.js';
import { Query } from '../../sqlite/query.js';
import { tableExists } from '../../sqlite/table-exists.js';


export const tableContents = (name?: string) => {
	let items: object[] = [];
	if (name && tableExists(name)) {
		using query = new Query();
		items = query.from(name).query();
	}

	return template({
		name:     'table-contents',
		template: html`
		<section id="table-content">
			${ name && html`
			<h1>${ name }</h1>
			<monaco-editor
				language="json"
			>${ JSON.stringify(items, undefined, '\t') }</monaco-editor>
			` }
		</section>
		`,
		style: css`
		#table-content {
			overflow: hidden;
			display: grid;
			grid-template-rows: max-content 1fr;
		}
		#table-content h1 {
			all: unset;
			font-size: 1.5em;
			position: sticky;
			top: 0px;
			background-color: rgb(30, 30, 30);
			padding-top: 24px;
			padding-bottom: 8px;
			padding-inline: 24px;
			border-bottom: 2px solid white;
		}
		`,
	});
};
