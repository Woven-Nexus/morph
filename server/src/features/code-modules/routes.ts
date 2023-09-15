import express, { type Router } from 'express';

import { app } from '../../app.js';
import { createResponse } from '../../utilities/create-response.js';
import { Filter, Query } from '../db-utils/query.js';
import dImport from './dynamic-import.js';
import type { IModule } from './modules-table.js';
import { sandbox } from './sandbox.js';

const router: Router = express.Router();

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

router.get('/', async (req, res) => {
	res.send('CODE MODULES!');
});


router.get('/namespaces', async (req, res) => {
	const query = new Query('./database/main.db');

	interface NamespaceDefinition extends Pick<IModule, 'namespace'> {}

	const results = query
		.get<IModule>('modules')
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

	interface ModuleNamespace extends Omit<IModule, 'code'> { }

	const query = new Query('./database/main.db');
	const results = query
		.get<IModule>('modules')
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


router.get(`/:namespace/:name`, async (req, res) => {
	const params = req.params;

	const query = new Query('./database/main.db');
	const results = query
		.get<IModule>('modules')
		.where(filter => filter.and(
			filter.eq('namespace', params.namespace),
			filter.eq('name', params.name),
		))
		.limit(1)
		.orderBy('active', 'asc')
		.orderBy('name', 'asc')
		.query();

	const modules: IModule[] = [];
	results.forEach(res => modules.push(res.item));

	res.send(createResponse(
		modules[0],
		'No code module with name: ' + params.name + ' in namespace: ' + params.namespace,
	));
});


export default router;
