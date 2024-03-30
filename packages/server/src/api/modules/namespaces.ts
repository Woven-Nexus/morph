import type { RequestHandler } from 'express';

import { getAllNamespaces } from '../../features/modules/database/modules-behavior.js';
import { createResponse } from '../../utilities/create-response.js';


export const get: RequestHandler[] = [
	async (req, res) => {
		const modules = getAllNamespaces();

		res.send(createResponse(modules, ''));
	},
];
