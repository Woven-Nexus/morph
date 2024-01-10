import { faker } from '@faker-js/faker';
import { range } from '@roenlie/mimic-core/array';

import { db } from '../../database.js';
import { escapeSQLiteString } from '../db-utils/escape-string.js';


export interface Module {
	module_id?: string;
	code: string;
	name: string;
	namespace: string;
	description: string;
	active: 0 | 1;
}


export const createModulesTable = () => {
	db.prepare(/* sql */`
	CREATE TABLE IF NOT EXISTS modules (
		module_id INTEGER PRIMARY KEY,
		code TEXT DEFAULT '' NOT NULL,
		name TEXT DEFAULT '' NOT NULL,
		description TEXT DEFAULT '' NOT NULL,
		namespace TEXT DEFAULT '' NOT NULL,
		active INTEGER DEFAULT FALSE NOT NULL
	)`).run();
};


export const createModulesDemoData = () => {
	const createCodeModule = (): Module => {
		return {
			active:      1,
			namespace:   escapeSQLiteString(faker.hacker.adjective()),
			name:        escapeSQLiteString(faker.hacker.verb()),
			description: escapeSQLiteString(faker.hacker.phrase()),
			code:        escapeSQLiteString(faker.lorem.paragraph()),
		};
	};

	const insertCode = db.transaction(() => {
		range(20).forEach(() => {
			const mod = createCodeModule();

			db.prepare(/* sql */`
			INSERT INTO modules ('active', 'code', 'description', 'name', 'namespace')
			VALUES(${ mod.active },
				'${ mod.code }',
				'${ mod.description }',
				'${ mod.name }',
				'${ mod.namespace }'
			)
			`).run();
		});
	});
	insertCode();
};
