import type { RequestHandler } from 'express';
import express from 'express';

import { form } from '../../features/modules/components/form.js';
import { sidebar } from '../../features/modules/components/sidebar.js';
import { getByNamespaceAndID, insertModule } from '../../features/modules/database/modules-behavior.js';
import type { IModule } from '../../features/modules/database/modules-table.js';
import { html } from '../../utilities/template-tag.js';


export const post: RequestHandler[] = [
	express.urlencoded({ extended: false }),
	async (req, res) => {
		const module = req.body as IModule;

		const result = insertModule(module);
		if (!result)
			return void res.sendStatus(500);

		const actualModule = getByNamespaceAndID(
			module.namespace, Number(result.lastInsertRowid),
		);

		res.send(await html`
		${ sidebar(actualModule) }
		${ form(actualModule) }
		`);
	},
];
