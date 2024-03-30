import type { RequestHandler } from 'express';

import { form } from '../../features/modules/components/form.js';
import { sidebar } from '../../features/modules/components/sidebar.js';
import { deleteModule } from '../../features/modules/database/modules-behavior.js';
import type { IModule } from '../../features/modules/database/modules-create-table.js';
import { urlencodedParser } from '../../utilities/body-parser.js';
import { html } from '../../utilities/template-tag.js';


export const post: RequestHandler[] = [
	urlencodedParser,
	async (req, res) => {
		const module = req.body as IModule;

		deleteModule(module);

		res.send(await html`
		${ sidebar() }
		${ form() }
		`);
	},
];
