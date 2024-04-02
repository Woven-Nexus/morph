import type { RequestHandler } from 'express';

import { createModulesDemoData } from '../../../features/modules/database/modules-table.js';
import { tableContents } from '../../../features/tables/components/table-contents.js';
import { tableList } from '../../../features/tables/components/table-list.js';
import { createUsersDemoData } from '../../../features/user/database/user-table.js';


export const get: RequestHandler[] = [
	async (req, res) => {
		type ValidName = 'users' | 'modules';
		const { name } = req.params as { name: ValidName; };

		if (name === 'users')
			createUsersDemoData();
		if (name === 'modules')
			createModulesDemoData();

		res.send(await tableList() + await tableContents(name));
	},
];
