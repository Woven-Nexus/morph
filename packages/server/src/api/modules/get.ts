import type { RequestHandler } from 'express';

import { getByID } from '../../features/modules/database/modules-behavior.js';
import { createResponse } from '../../utilities/create-response.js';


export const get: RequestHandler[] = [
	async (req, res) => {
		const { id } = req.query as { id: string; };

		const module = getByID(Number(id));
		if (!module)
			return res.sendStatus(404);

		res.send(getByID(Number(id)));
	},
];
