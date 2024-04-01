import type { RequestHandler } from 'express';

import { Query } from '../../features/sqlite/query.js';
import { tableExists } from '../../features/sqlite/table-exists.js';
import { tableContents } from '../../features/tables/components/table-contents.js';


export const get: RequestHandler[] = [
	async (req, res) => {
		const { name } = req.params as { name: string; };

		let items: object[] = [];
		if (tableExists(name)) {
			using query = new Query();
			items = query.from(name).query();
		}

		res.send(await tableContents(name, items));
	},
];
