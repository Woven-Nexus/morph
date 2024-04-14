import type { RequestHandler } from 'express';

import { SQLite } from '../../../features/sqlite/database.js';
import { html } from '../../../utilities/template-tag.js';
import { tablesContents } from '../_parts/tables-contents.js';
import { tablesList } from '../_parts/tables-list.js';


export const get: RequestHandler[] = [
	async (req, res) => {
		const { name } = req.params as { name: string; };

		const validTables = [ 'users', 'OTP', 'modules' ];

		if (validTables.includes(name)) {
			using db = new SQLite();
			db.prepare(/* sql */`
			DROP TABLE ${ name }
			`).run();
		}

		res.send(await html`
		${ tablesList({
			attrs: { 'void-id': 'tables-list' },
		}) }
		${ tablesContents({
			attrs: { 'void-id': 'tables-contents' },
		}) }
		`);
	},
];
