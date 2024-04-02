import { faker } from '@faker-js/faker';
import { range } from '@roenlie/mimic-core/array';

import type { Optional } from '../../../utilities/optional.js';
import { SQLite } from '../../sqlite/database.js';
import { escapeString } from '../../sqlite/escape-string.js';
import { Query } from '../../sqlite/query.js';


export interface IUser {
	user_id: number;
	username: string;
	name: string;
	email: string;
	password: string;
	role: 'Guest' | 'User' | 'Admin';
}


export class User implements IUser {

	public user_id: number;
	public username: string;
	public name: string;
	public email: string;
	public password: string;
	public role: 'Guest' | 'User' | 'Admin';

	private constructor(values: Optional<IUser, 'user_id'>) {
		if (values.user_id !== undefined)
			this.user_id = values.user_id;

		this.username = values.username;
		this.name = values.name;
		this.email = values.email;
		this.password = values.password;
		this.role = values.role;
	}

	public static parse(values: IUser) {
		return new User(values);
	}

	public static initialize(values: Omit<IUser, 'user_id'>) {
		return new User(values);
	}

}


export const createUsersTable = () => {
	using query = new Query();

	query.define<IUser>('users')
		.primaryKey('user_id')
		.column('username', 'TEXT', { value: '', nullable: false })
		.column('name',     'TEXT', { value: '', nullable: false })
		.column('email',    'TEXT', { value: '', nullable: false })
		.column('password', 'TEXT', { value: '', nullable: false })
		.column('role',     'TEXT', { value: '', nullable: false })
		.query();
};


export const createUsersDemoData = () => {
	using db = new SQLite();
	const roles: IUser['role'][] = [ 'User', 'Guest', 'Admin' ];

	using query = new Query();
	db.transaction(() => range(5).forEach(() => {
		const user = User.initialize({
			username: escapeString(faker.internet.userName()),
			name:     escapeString(faker.person.fullName()),
			email:    escapeString(faker.internet.email()),
			password: escapeString(faker.internet.password()),
			role:     roles[Math.floor(Math.random() * 3)]!,
		});

		query.insert<IUser>('users')
			.values(user)
			.query();
	}))();
};
