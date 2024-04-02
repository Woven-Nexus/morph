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

	public readonly module_id: number;
	public code: string;
	public name: string;
	public namespace: string;
	public description: string;
	public active: 0 | 1;

	private constructor(values: Optional<IModule, 'module_id'>) {
		if (values.module_id !== undefined)
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

	public static parse(values: IModule) {
		return new Module(values);
	}

	public static initialize(values: Omit<IModule, 'module_id'>) {
		return new Module(values);
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
};


export const createModulesDemoData = () => {
	using db = new SQLite();

	const createCodeModule = (): IModule => {
		const module = Module.initialize({
			active:      1,
			namespace:   escapeString(faker.hacker.adjective()),
			name:        escapeString(faker.hacker.verb()),
			description: escapeString(faker.hacker.phrase()),
			code:        escapeString(faker.lorem.paragraph()),
		});

		return module;
	};

	using query = new Query();
	db.transaction(() => range(20).forEach(() => {
		const mod = createCodeModule();

		query.insert<IModule>('modules')
			.values(mod)
			.query();
	}))();
};
