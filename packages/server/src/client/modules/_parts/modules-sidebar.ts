import type { IModule } from '../../../features/modules/database/modules-table.js';
import { Query } from '../../../features/sqlite/query.js';
import { html } from '../../../utilities/template-tag.js';
import { type VoidElement, voidElement } from '../../assets/void/void-element.js';


export class ModulesSidebar implements VoidElement {

	public tagName = 'm-modules-sidebar';
	public styleUrls = [ '/modules/assets/modules-sidebar.css' ];
	public scriptUrls: string | string[];
	public render({ module }: { module?: IModule; }): Promise<string> {
		using query = new Query('./database/main.db');
		const modules = query
			.from<IModule>('modules')
			.orderBy('active', 'asc')
			.orderBy('name', 'asc')
			.query();

		return html`
		<ol>
			${ modules.map(mod => html`
			<li class="${ mod.module_id === module?.module_id ? 'active' : '' }">
				<button
					void-get="/modules/${ mod.namespace }/${ mod.module_id }"
					void-target="modules-sidebar, modules-form"
				>
					${ mod.name }
				</button>
			</li>
			`) }
		</ol>
		`;
	}

}


export const modulesSidebar = voidElement(ModulesSidebar);
