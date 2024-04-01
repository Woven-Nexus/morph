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

	constructor(values: Optional<IUser, 'user_id'>) {
		this.user_id = values.user_id ?? 0;
		this.username = values.username;
		this.name = values.name;
		this.email = values.email;
		this.password = values.password;
		this.role = values.role;
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

	//db.prepare(/* sql */`
	//CREATE TABLE IF NOT EXISTS users (
	//	user_id  INTEGER PRIMARY KEY,
	//	username TEXT DEFAULT '' NOT NULL,
	//	name     TEXT DEFAULT '' NOT NULL,
	//	email    TEXT DEFAULT '' NOT NULL,
	//	password TEXT DEFAULT '' NOT NULL,
	//	role     TEXT DEFAULT '' NOT NULL
	//)
	//`).run();
};


export const createUsersWithDemoData = () => {
	using db = new SQLite();
	const roles: IUser['role'][] = [ 'User', 'Guest', 'Admin' ];

	const insertUsers = db.transaction(() => {
		range(5).forEach(() => {
			const user = new User({
				username: escapeString(faker.internet.userName()),
				name:     escapeString(faker.person.fullName()),
				email:    escapeString(faker.internet.email()),
				password: escapeString(faker.internet.password()),
				role:     roles[Math.floor(Math.random() * 3)]!,
			});

			const statement = /* sql */`
			INSERT INTO users (
				'username',
				'name',
				'email',
				'password',
				'role'
			)
			VALUES (
				'${ user.username }',
				'${ user.name }',
				'${ user.email }',
				'${ user.password }',
				'${ user.role }'
			)
			`;

			db.prepare(statement).run();
		});
	});

	createUsersTable();
	insertUsers();
};
