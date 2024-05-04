import type { RequestHandler } from 'express';

import { createModulesDemoData } from '../../features/modules/database/modules-table.js';
import { createUsersDemoData } from '../../features/user/database/user-table.js';


export const get: RequestHandler[] = [
	(req, res) => {
		type ValidName = 'users' | 'modules';
		const { name } = req.query as { name: ValidName; };

		if (name === 'users')
			createUsersDemoData();
		if (name === 'modules')
			createModulesDemoData();

		res.sendStatus(200);
	},
];
