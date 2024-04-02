import type { RequestHandler } from 'express';

import { tableContents } from '../../features/tables/components/table-contents.js';


export const get: RequestHandler[] = [
	async (req, res) => {
		const { name } = req.params as { name: string; };

		res.send(await tableContents(name));
	},
];
