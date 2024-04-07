import type { RequestHandler } from 'express';

import { CounterElement } from './assets/parts/server-button.js';


export const post: RequestHandler[] = [
	async (req, res) => {
		const { count } = req.body as {count: number;};

		res.send(await CounterElement.generate({ count: count + 1 }));
	},
];
