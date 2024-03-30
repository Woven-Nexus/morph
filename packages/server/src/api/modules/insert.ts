import type { RequestHandler } from 'express';

import { insertModule } from '../../features/modules/database/modules-behavior.js';
import type { IModule } from '../../features/modules/database/modules-create-table.js';
import { urlencodedParser } from '../../utilities/body-parser.js';


export const get: RequestHandler[] = [
	urlencodedParser,
	async (req, res) => {
		const module = req.body as IModule;

		insertModule(module);

		res.sendStatus(200);
	},
];
