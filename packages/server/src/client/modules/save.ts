import type { RequestHandler } from 'express';
import express from 'express';

import { getByNamespaceAndID, updateModule } from '../../features/modules/database/modules-behavior.js';
import type { IModule } from '../../features/modules/database/modules-table.js';
import { html } from '../../utilities/template-tag.js';
import { modulesForm } from './_parts/modules-form.js';
import { modulesSidebar } from './_parts/modules-sidebar.js';


export const post: RequestHandler[] = [
	express.urlencoded({ extended: false }),
	async (req, res) => {
		const module = req.body as IModule;

		updateModule(module);
		const actualModule = getByNamespaceAndID(
			module.namespace, module.module_id,
		);

		res.send(await html`
		${ modulesSidebar({
			attrs: { 'void-id': 'modules-sidebar' },
			props: { module: actualModule },
		}) }
		${ modulesForm({
			attrs: { 'void-id': 'modules-form' },
			props: { module: actualModule },
		}) }
		`);
	},
];
