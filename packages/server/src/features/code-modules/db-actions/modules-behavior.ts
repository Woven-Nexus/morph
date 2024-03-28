import { dbPath } from '../../../constants.js';
import { Query } from '../../db-utils/query.js';
import type { Module } from './modules-create-table.js';


export const getByNamespaceAndID = (namespace: string, id: string | number | bigint) => {
	const query = new Query(dbPath);
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

	return results.at(0);
};


export const getAllInNamespace = (namespace: string) => {
	const query = new Query(dbPath);
	const results = query
		.from<Module>('modules')
		.where(filter => filter.and(
			filter.eq('namespace', namespace),
		))
		.orderBy('module_id', 'asc')
		.query();

	return results;
};


export const getAllNamespaces = () => {
	const query = new Query(dbPath);
	const results = query
		.from<Module>('modules')
		.select('namespace')
		.where(filter => filter.exists('namespace'))
		.groupBy('namespace')
		.orderBy('namespace', 'asc')
		.query();

	return results;
};


export const getAllModules = () => {
	const query = new Query(dbPath);
	const results = query
		.from<Module>('modules')
		.orderBy('active', 'asc')
		.orderBy('name', 'asc')
		.query();

	return results;
};


export const updateModule = (module: Module) => {
	// In a form, a checkbox value is not sent if it is unchecked.
	// therefor we need to check if active is included or not.
	module.active = !('active' in module) ? 0 : 1;

	const query = new Query(dbPath);
	const keyvalues = Object.entries(module) as [keyof Module, string][];

	return query
		.update<Module>('modules')
		.set(...keyvalues)
		.where(filter => filter.eq('module_id', module.module_id))
		.query();
};


export const deleteModule = (module: Pick<Module, 'module_id'>) => {
	const query = new Query(dbPath);

	return query.delete<Module>('modules')
		.where(filter => filter.eq('module_id', module.module_id))
		.query();
};


export const insertModule = (module: Module) => {
	// In a form, a checkbox value is not sent if it is unchecked.
	// therefor we need to check if active is included or not.
	module.active = !('active' in module) ? 0 : 1;
	delete module.module_id;

	const query = new Query(dbPath);
	const values = Object.entries(module) as [keyof Module, any][];

	return query.insert<Module>('modules')
		.values(...values)
		.query();
};
