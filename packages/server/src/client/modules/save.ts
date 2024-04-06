import type { RequestHandler } from 'express';
import express from 'express';

import { form } from '../../features/modules/components/form.js';
import { sidebar } from '../../features/modules/components/sidebar.js';
import { getByNamespaceAndID, updateModule } from '../../features/modules/database/modules-behavior.js';
import type { IModule } from '../../features/modules/database/modules-table.js';
import { html } from '../../utilities/template-tag.js';


export const post: RequestHandler[] = [
	express.urlencoded({ extended: false }),
	async (req, res) => {
		const module = req.body as IModule;

		updateModule(module);
		const modules = getByNamespaceAndID(
			module.namespace, module.module_id,
		);

		res.send(await html`
		${ sidebar(modules) }
		${ form(modules) }
		`);
	},
];