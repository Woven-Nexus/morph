import type { RequestHandler } from 'express';

import { createModulesTable } from '../../features/modules/database/modules-table.js';
import { createOTPtable } from '../../features/otp/database/otp-table.js';
import { createUsersTable } from '../../features/user/database/user-table.js';


export const get: RequestHandler[] = [
	(req, res) => {
		type ValidName = 'users' | 'OTP' | 'modules';
		const { name } = req.query as { name: ValidName; };

		if (name === 'users')
			createUsersTable();
		if (name === 'OTP')
			createOTPtable();
		if (name === 'modules')
			createModulesTable();

		res.sendStatus(200);
	},
];
