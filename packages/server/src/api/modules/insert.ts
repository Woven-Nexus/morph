import type { RequestHandler } from 'express';

import { insertModule } from '../../features/modules/database/modules-behavior.js';
import type { IModule } from '../../features/modules/database/modules-table.js';


export const post: RequestHandler[] = [
	async (req, res) => {
		const module = req.body as IModule;

		insertModule(module);

		res.sendStatus(200);
	},
];
