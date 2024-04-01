import type { RequestHandler } from 'express';

import { createUsersWithDemoData } from '../../features/user/database/user-table.js';
import { getAllUsers } from '../../features/user/database/users-behavior.js';
import { createResponse } from '../../utilities/create-response.js';


export const get: RequestHandler[] = [
	async (req, res) => {
		createUsersWithDemoData();

		const users = getAllUsers();

		res.send(createResponse(users, ''));
	},
];
