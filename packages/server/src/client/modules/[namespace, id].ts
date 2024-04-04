import type { RequestHandler } from 'express';

import { form } from '../../features/modules/components/form.js';
import { sidebar } from '../../features/modules/components/sidebar.js';
import type { IModule } from '../../features/modules/database/modules-table.js';
import { Query } from '../../features/sqlite/query.js';
import { html } from '../../utilities/template-tag.js';


export const get: RequestHandler = async (req, res) => {
	const params = req.params as {namespace: string, id: string};

	const query = new Query('./database/main.db');
	const modules = query
		.from<IModule>('modules')
		.where(filter => filter.and(
			filter.eq('module_id', Number(params.id)),
		))
		.limit(1)
		.orderBy('active', 'asc')
		.orderBy('name', 'asc')
		.query();

	res.send(await html`
	${ sidebar(modules.at(0)!) }
	${ form(modules.at(0)!) }
	`);
};
