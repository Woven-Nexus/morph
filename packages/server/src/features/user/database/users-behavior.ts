import { Query } from '../../sqlite/query.js';
import type { IUser } from './user-table.js';


export const getAllUsers = () => {
	const query = new Query();
	const users = query.from<IUser>('users')
		.query();

	return users;
};
