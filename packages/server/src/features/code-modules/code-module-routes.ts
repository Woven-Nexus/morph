import './index.js';

import { createResponse } from '../../utilities/create-response.js';
import { Query } from '../db-utils/query.js';
import type { Module } from './modules-table.js';
import router from './router.js';


export default router;


//app.get('/code1', (req, res) => {
//	res.send(`
//	console.log('I AM FROM /CODE1');

//	export const secrets = 'this is a secret';
//	`);
//});

//app.get('/code2', (req, res) => {
//	res.send(`
//	const { secrets } = await dImport('http://localhost:42069/code1');

//	export const test = () => {
//		console.log('If you see this, this code has access to local scope');

//		return 'I am a function from the server' + secrets;
//	};
//	`);
//});

//app.get('/code-test', async (req, res) => {
//	const testModule = await dImport(
//		'http://localhost:42069/code2',
//		{ sandbox },
//	);

//	const result = testModule.test();

//	res.send(result);
//});


router.get('/all', async (req, res) => {
	const query = new Query('./database/main.db');
	const results = query
		.get<Module>('modules')
		.orderBy('active', 'asc')
		.orderBy('name', 'asc')
		.query();

	const modules: Module[] = [];
	results.forEach(res => modules.push(res.item));

	res.send(createResponse(
		modules,
		'',
	));
});


router.get('/namespaces', async (req, res) => {
	const query = new Query('./database/main.db');

	interface NamespaceDefinition extends Pick<Module, 'namespace'> {}

	const results = query
		.get<Module>('modules')
		.fields('namespace')
		.where(filter => filter.exists('namespace'))
		.groupBy('namespace')
		.orderBy('namespace', 'asc')
		.query();

	const modules: NamespaceDefinition[] = [];
	results.forEach(res => {
		modules.push(res.item);
	});

	res.send(createResponse(modules, ''));
});


router.get(`/:namespace`, async (req, res) => {
	const params = req.params;

	interface ModuleNamespace extends Omit<Module, 'code'> { }

	const query = new Query('./database/main.db');
	const results = query
		.get<Module>('modules')
		.fields('namespace', 'name', 'module_id', 'active', 'description')
		.where(filter => filter.and(
			filter.eq('namespace', params.namespace),
		))
		.orderBy('module_id', 'asc')
		.query();

	const modules: ModuleNamespace[] = [];
	results.forEach(res => modules.push(res.item));

	res.send(createResponse(
		modules,
		'No namespace found with name: ' + params.namespace,
	));
});


router.get(`/:namespace/:id`, async (req, res) => {
	const params = req.params;

	const query = new Query('./database/main.db');
	const results = query
		.get<Module>('modules')
		.where(filter => filter.and(
			filter.eq('module_id', params.id),
		))
		.limit(1)
		.orderBy('active', 'asc')
		.orderBy('name', 'asc')
		.query();

	const modules: Module[] = [];
	results.forEach(res => modules.push(res.item));

	res.send(createResponse(
		modules[0],
		'No code module with id: ' + params.id,
	));
});
