import type { IUser } from '@roenlie/morph/models/user-model.js';

import { Query } from '../sqlite/query.js';


export const getAllUsers = () => {
	using query = new Query();
	const users = query.from<IUser>('users')
		.query();

	return users;
};
