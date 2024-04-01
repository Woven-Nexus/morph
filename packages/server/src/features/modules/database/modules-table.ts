import { faker } from '@faker-js/faker';
import { range } from '@roenlie/mimic-core/array';

import type { Optional } from '../../../utilities/optional.js';
import { SQLite } from '../../sqlite/database.js';
import { escapeString } from '../../sqlite/escape-string.js';
import { Query } from '../../sqlite/query.js';


export interface IModule {
	module_id: number;
	code: string;
	name: string;
	namespace: string;
	description: string;
	active: 0 | 1;
}


export class Module implements IModule {

	public module_id: number;
	public code: string;
	public name: string;
	public namespace: string;
	public description: string;
	public active: 0 | 1;

	constructor(values: Optional<IModule, 'module_id'>) {
		this.module_id = values.module_id ?? 0;
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
	using query = new Query();

	query.define<IModule>('modules')
		.primaryKey('module_id')
		.column('code',        'TEXT',    { value: '',    nullable: false })
		.column('name',        'TEXT',    { value: '',    nullable: false })
		.column('description', 'TEXT',    { value: '',    nullable: false })
		.column('namespace',   'TEXT',    { value: '',    nullable: false })
		.column('active',      'INTEGER', { value: false, nullable: false })
		.query();

	//using db = new SQLite();
	//db.prepare(/* sql */`
	//CREATE TABLE IF NOT EXISTS modules (
	//	module_id   INTEGER PRIMARY KEY,
	//	code        TEXT    DEFAULT ''    NOT NULL,
	//	name        TEXT    DEFAULT ''    NOT NULL,
	//	description TEXT    DEFAULT ''    NOT NULL,
	//	namespace   TEXT    DEFAULT ''    NOT NULL,
	//	active      INTEGER DEFAULT FALSE NOT NULL
	//)`).run();
};


export const createModulesWithDemoData = () => {
	using db = new SQLite();

	const createCodeModule = (): IModule => {
		return new Module({
			active:      1,
			namespace:   escapeString(faker.hacker.adjective()),
			name:        escapeString(faker.hacker.verb()),
			description: escapeString(faker.hacker.phrase()),
			code:        escapeString(faker.lorem.paragraph()),
		});
	};

	const insertCode = db.transaction(() => {
		range(20).forEach(() => {
			const mod = createCodeModule();

			db.prepare(/* sql */`
			INSERT INTO modules (
				'active',
				'code',
				'description',
				'name',
				'namespace'
			)
			VALUES (
				${ mod.active },
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
