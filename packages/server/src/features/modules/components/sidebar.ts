import { template } from '../../../utilities/template.js';
import { css, html } from '../../../utilities/template-tag.js';
import { Query } from '../../db-utils/query.js';
import type { IModule } from '../database/modules-create-table.js';


export const sidebar = async (module?: IModule) => {
	const query = new Query('./database/main.db');
	const modules = query
		.from<IModule>('modules')
		.orderBy('active', 'asc')
		.orderBy('name', 'asc')
		.query();

	return template({
		name:     'sidebar',
		template: html`
		<ol id="module-list" hx-swap-oob="true">
			${ modules.map(mod => html`
			<li class="${ mod.module_id === module?.module_id ? 'active' : '' }">
				<button
					hx-get="/modules/${ mod.namespace }/${ mod.module_id }"
					hx-target="main"
					hx-swap="innerHTML"
				>
					${ mod.name }
				</button>
			</li>
			`) }
		</ol>
		`,
		style: css`
			ol {
				all: unset;
				display: block;
				overflow: hidden;
				overflow-y: auto;
				padding-inline-start: 24px;
				padding-block: 24px;
			}
			li {
				all: unset;
				display: block;
			}
			li.active {
				background-color: hotpink;
				outline: 2px dotted red;
				outline-offset: -2px;
			}
		`,
	});
};
