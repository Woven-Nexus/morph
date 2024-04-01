import { Query } from '../../sqlite/query.js';
import { type IModule, Module } from './modules-table.js';


export const getByNamespaceAndID = (
	namespace: string, id: number,
) => {
	using query = new Query();
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
	using query = new Query();
	const results = query
		.from<IModule>('modules')
		.where(filter => filter.eq('namespace', namespace))
		.orderBy('module_id', 'asc')
		.query();

	return results;
};


export const getAllNamespaces = () => {
	using query = new Query();
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
	using query = new Query();

	const results = query
		.from<IModule>('modules')
		.orderBy('active', 'asc')
		.orderBy('name', 'asc')
		.query();

	return results;
};


export const updateModule = (module: IModule) => {
	using query = new Query();
	module = new Module(module);

	return query
		.update<IModule>('modules')
		.values(module)
		.where(filter => filter.eq('module_id', module.module_id))
		.query();
};


export const deleteModule = (module: Pick<IModule, 'module_id'>) => {
	using query = new Query();

	return query.delete<IModule>('modules')
		.where(filter => filter.eq('module_id', module.module_id))
		.query();
};


export const insertModule = (module: IModule) => {
	using query = new Query();

	delete (module as any).module_id;
	module = new Module(module);

	return query.insert<IModule>('modules')
		.values(module)
		.query();
};
