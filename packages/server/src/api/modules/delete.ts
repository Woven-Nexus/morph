import type { RequestHandler } from 'express';

import type { IModule } from '../../../client/models/modules-model.js';
import { deleteModule, moduleExists } from '../../features/modules/database/modules-behavior.js';


export const post: RequestHandler[] = [
	(req, res) => {
		const module = req.body as IModule;

		if (!moduleExists(module))
			return res.sendStatus(404);

		deleteModule(module);

		if (moduleExists(module))
			return res.sendStatus(500);

		return res.sendStatus(200);
	},
];
