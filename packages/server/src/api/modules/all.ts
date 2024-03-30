import type { RequestHandler } from 'express';

import { getAllModules } from '../../features/modules/database/modules-behavior.js';
import { createResponse } from '../../utilities/create-response.js';


export const get: RequestHandler[] = [
	async (req, res) => {
		const modules = getAllModules();

		res.send(createResponse(modules, ''));
	},
];
