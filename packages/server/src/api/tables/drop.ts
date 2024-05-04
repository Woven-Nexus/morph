import type { RequestHandler } from 'express';

import { SQLite } from '../../features/sqlite/database.js';


export const get: RequestHandler[] = [
	(req, res) => {
		const { name } = req.query as { name: string; };

		const validTables = [ 'users', 'OTP', 'modules' ];

		if (validTables.includes(name)) {
			using db = new SQLite();
			db.prepare(/* sql */`
			DROP TABLE ${ name }
			`).run();
		}

		res.send(200);
	},
];
