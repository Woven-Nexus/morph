import type { RequestHandler } from 'express';

import { getAllInNamespace } from '../../features/modules/database/modules-behavior.js';
import { createResponse } from '../../utilities/create-response.js';


export const get: RequestHandler[] = [
	async (req, res) => {
		const { namespace } = req.params as { namespace: string; };
		const modules = getAllInNamespace(namespace);

		res.send(createResponse(
			modules,
			'No namespace found with name: ' + namespace,
		));
	},
];
