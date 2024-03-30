import type { RequestHandler } from 'express';

import { form } from '../../features/modules/components/form.js';
import { sidebar } from '../../features/modules/components/sidebar.js';
import type { IModule } from '../../features/modules/database/modules-create-table.js';
import { html } from '../../utilities/template-tag.js';


export const get: RequestHandler[] = [
	async (req, res) => {
		const module: IModule = {
			active:      1,
			code:        '',
			description: '',
			name:        '',
			namespace:   '',
			module_id:   '',
		};

		res.send(await html`
		${ sidebar(module) }
		${ form(module) }
		`);
	},
];
