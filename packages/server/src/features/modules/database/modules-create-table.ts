import { faker } from '@faker-js/faker';
import { range } from '@roenlie/mimic-core/array';

import { db } from '../../../database.js';
import { escapeSQLiteString } from '../../db-utils/escape-string.js';


export interface IModule {
	module_id?: string | number | bigint;
	code: string;
	name: string;
	namespace: string;
	description: string;
	active: 0 | 1;
}


export class Module {

	public module_id?: string | number | bigint;
	public code: string;
	public name: string;
	public namespace: string;
	public description: string;
	public active: 0 | 1;

	constructor(values: IModule) {
		this.module_id = values.module_id;
		this.code = values.code;
		this.name = values.name;
		this.namespace = values.namespace;
		this.description = values.description;

		// In a form, a checkbox value is not sent if it is unchecked.
		// therefor we need to check if active is included or not.
		const active = values.active;
		this.active = active === 0 || active === 1 ? active
			: active === '0' || active === '1' ? (Number(active) as 1 | 0)
				: ('active' in values) ? 1 : 0;
	}

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
	const createCodeModule = (): IModule => {
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
