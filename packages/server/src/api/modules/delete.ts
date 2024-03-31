import type { RequestHandler } from 'express';

import { deleteModule } from '../../features/modules/database/modules-behavior.js';
import type { IModule } from '../../features/modules/database/modules-create-table.js';


export const post: RequestHandler[] = [
	async (req, res) => {
		const module = req.body as IModule;

		deleteModule(module);

		res.sendStatus(200);
	},
];
