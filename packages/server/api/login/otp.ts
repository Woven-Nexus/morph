import type { RequestHandler } from 'express';

export const get: RequestHandler[] = [
	(req, res) => {
		console.log('got a request for a opt');
	},
];
