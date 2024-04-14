import type { RequestHandler } from 'express';

import { createModulesDemoData } from '../../../features/modules/database/modules-table.js';
import { createUsersDemoData } from '../../../features/user/database/user-table.js';
import { html } from '../../../utilities/template-tag.js';
import { tablesContents } from '../_parts/tables-contents.js';
import { tablesList } from '../_parts/tables-list.js';


export const get: RequestHandler[] = [
	async (req, res) => {
		type ValidName = 'users' | 'modules';
		const { name } = req.params as { name: ValidName; };

		if (name === 'users')
			createUsersDemoData();
		if (name === 'modules')
			createModulesDemoData();

		res.send(await html`
		${ tablesList({
				attrs: { 'void-id': 'tables-list' },
		}) }
		${ tablesContents({
			attrs: { 'void-id': 'tables-contents' },
			props: { name },
		}) }
		`);
	},
];
