import type { RequestHandler } from 'express';

import { updateModule } from '../../features/modules/database/modules-behavior.js';
import type { IModule } from '../../features/modules/database/modules-create-table.js';


export const patch: RequestHandler[] = [
	async (req, res) => {
		const module = req.body as IModule;

		updateModule(module);

		res.sendStatus(200);
	},
];
