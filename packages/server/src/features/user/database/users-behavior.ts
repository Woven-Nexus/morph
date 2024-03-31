import { Query } from '../../db-utils/query.js';
import type { IUser } from './user-create-table.js';


export const getAllUsers = () => {
	const query = new Query(process.env.SQLITE_URL);
	const users = query.from<IUser>('users')
		.query();

	return users;
};
