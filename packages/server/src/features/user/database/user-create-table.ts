import { faker } from '@faker-js/faker';
import { range } from '@roenlie/mimic-core/array';

import { escapeString } from '../../db-utils/escape-string.js';
import { db } from '../../sqlite/database.js';


export interface IUser {
	username: string;
	name: string;
	email: string;
	password: string;
	role: 'Guest' | 'User' | 'Admin';
}


export class User implements IUser {

	public username: string;
	public name: string;
	public email: string;
	public password: string;
	public role: 'Guest' | 'User' | 'Admin';

	constructor(values: IUser) {
		this.username = values.username;
		this.name = values.name;
		this.email = values.email;
		this.password = values.password;
		this.role = values.role;
	}

}


export const createUsersTable = () => {
	db.prepare(/* sql */`
	CREATE TABLE IF NOT EXISTS users (
		username TEXT DEFAULT '' NOT NULL,
		name     TEXT DEFAULT '' NOT NULL,
		email    TEXT DEFAULT '' NOT NULL,
		password TEXT DEFAULT '' NOT NULL,
		role     TEXT DEFAULT '' NOT NULL
	)
	`).run();
};


export const createUsersWithDemoData = () => {
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
