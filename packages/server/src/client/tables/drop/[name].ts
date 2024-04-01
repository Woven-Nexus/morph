import type { RequestHandler } from 'express';

import { SQLite } from '../../../features/sqlite/database.js';
import { tableList } from '../../../features/tables/components/table-list.js';


export const get: RequestHandler[] = [
	async (req, res) => {
		const { name } = req.params as { name: string; };

		console.log('asking to drop:', name);


		const validTables = [ 'users', 'OTP', 'modules' ];

		if (validTables.includes(name)) {
			using db = new SQLite();
			db.prepare(/* sql */`
			DROP TABLE ${ name }
			`).run();
		}

		res.send(await tableList());
	},
];
