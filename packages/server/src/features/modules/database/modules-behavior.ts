import { dbPath } from '../../../constants.js';
import { Query } from '../../db-utils/query.js';
import { type IModule, Module } from './modules-create-table.js';


export const getByNamespaceAndID = (namespace: string, id: string | number | bigint) => {
	const query = new Query(dbPath);
	const results = query
		.from<IModule>('modules')
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
		.from<IModule>('modules')
		.where(filter => filter.eq('namespace', namespace))
		.orderBy('module_id', 'asc')
		.query();

	return results;
};


export const getAllNamespaces = () => {
	const query = new Query(dbPath);
	const results = query
		.from<IModule>('modules')
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
		.from<IModule>('modules')
		.orderBy('active', 'asc')
		.orderBy('name', 'asc')
		.query();

	return results;
};


export const updateModule = (module: IModule) => {
	module = new Module(module);
	const query = new Query(dbPath);

	return query
		.update<IModule>('modules')
		.values(module)
		.where(filter => filter.eq('module_id', module.module_id))
		.query();
};


export const deleteModule = (module: Pick<IModule, 'module_id'>) => {
	const query = new Query(dbPath);

	return query.delete<IModule>('modules')
		.where(filter => filter.eq('module_id', module.module_id))
		.query();
};


export const insertModule = (module: IModule) => {
	delete module.module_id;

	module = new Module(module);
	const query = new Query(dbPath);

	return query.insert<IModule>('modules')
		.values(module)
		.query();
};
