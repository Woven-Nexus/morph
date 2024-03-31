import type { RequestHandler } from 'express';

import { getAllUsers } from '../../features/user/database/users-behavior.js';
import { createResponse } from '../../utilities/create-response.js';


export const get: RequestHandler[] = [
	async (req, res) => {
		const users = getAllUsers();

		res.send(createResponse(users, ''));
	},
];
