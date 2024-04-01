import type { RequestHandler } from 'express';

import { getByNamespaceAndID } from '../../features/modules/database/modules-behavior.js';
import { createResponse } from '../../utilities/create-response.js';


export const get: RequestHandler[] = [
	async (req, res) => {
		const { namespace, id } = req.params as { namespace: string; id: string; };
		const modules = getByNamespaceAndID(namespace, Number(id));

		res.send(createResponse(modules, ''));
	},
];
