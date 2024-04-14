import type { RequestHandler } from 'express';

import { html } from '../../utilities/template-tag.js';
import { tablesContents } from './_parts/tables-contents.js';


export const get: RequestHandler[] = [
	async (req, res) => {
		const { name } = req.params as { name: string; };

		res.send(await html`
		${ tablesContents({
			attrs: { 'void-id': 'tables-contents' },
			props: { name },
		}) }
		`);
	},
];
