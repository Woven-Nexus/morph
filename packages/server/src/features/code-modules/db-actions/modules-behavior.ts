import { Query } from '../../db-utils/query.js';
import type { Module } from './modules-create-table.js';


export const getByNamespaceAndID = (namespace: string, id: string) => {
	const query = new Query('./database/main.db');
	const results = query
		.from<Module>('modules')
		.where(filter => filter.and(
			filter.eq('namespace', namespace),
			filter.eq('module_id', id),
		))
		.limit(1)
		.orderBy('active', 'asc')
		.orderBy('name', 'asc')
		.query();

	const modules: Module[] = [];
	results.forEach(res => modules.push(res.item));

	return modules;
};


export const getAllInNamespace = (namespace: string) => {
	const query = new Query('./database/main.db');
	const results = query
		.from<Module>('modules')
		.where(filter => filter.and(
			filter.eq('namespace', namespace),
		))
		.orderBy('module_id', 'asc')
		.query();

	const modules: Module[] = [];
	results.forEach(res => modules.push(res.item));
};


export const getAllNamespaces = () => {
	type NamespaceDefinition = Pick<Module, 'namespace'>;

	const query = new Query('./database/main.db');
	const results = query
		.from<Module>('modules')
		.select('namespace')
		.where(filter => filter.exists('namespace'))
		.groupBy('namespace')
		.orderBy('namespace', 'asc')
		.query();

	const modules: NamespaceDefinition[] = [];
	results.forEach(res => modules.push(res.item));

	return modules;
};


export const getAllModules = () => {
	const query = new Query('./database/main.db');
	const results = query
		.from<Module>('modules')
		.orderBy('active', 'asc')
		.orderBy('name', 'asc')
		.query();

	const modules: Module[] = [];
	results.forEach(res => modules.push(res.item));

	return modules;
};

export const updateModuleCodeByID = (id: string, code: string) => {
	const query = new Query('./database/main.db');

	return query
		.update<Module>('modules')
		.set([ 'code', code ])
		.where(filter => filter.eq('module_id', id))
		.query();
};
