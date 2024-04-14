import type { RequestHandler } from 'express';

import type { IModule } from '../../features/modules/database/modules-table.js';
import { Query } from '../../features/sqlite/query.js';
import { html } from '../../utilities/template-tag.js';
import { modulesForm } from './_parts/modules-form.js';
import { modulesSidebar } from './_parts/modules-sidebar.js';


export const get: RequestHandler = async (req, res) => {
	const params = req.params as { namespace: string; id: string; };

	using query = new Query('./database/main.db');
	const module = query
		.from<IModule>('modules')
		.where(filter => filter
			.and(filter.eq('module_id', Number(params.id))))
		.limit(1)
		.orderBy('active', 'asc')
		.orderBy('name', 'asc')
		.query()
		.at(0)!;

	res.send(await html`
	${ modulesSidebar({
		attrs: { 'void-id': 'modules-sidebar' },
		props: { module },
	}) }
	${ modulesForm({
		attrs: { 'void-id': 'modules-form' },
		props: { module },
	}) }
	`);
};
