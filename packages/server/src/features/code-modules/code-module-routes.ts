import { createResponse } from '../../utilities/create-response.js';
import { Query } from '../db-utils/query.js';
import dImport from './dynamic-import.js';
import { content } from './index.js';
import type { Module } from './modules-table.js';
import router from './router.js';


export default router;


router.get('/code1', (req, res) => {
	res.send(`
	console.log('I AM FROM /api/code-modules/code1');

	export const secrets = 'this is a secret';
	`);
});

router.get('/code2', (req, res) => {
	res.send(`
	import { secrets } from 'db:code1';

	export const test = () => {
		console.log('If you see this, this code has access to local scope');

		throw('THIS IS A THROW');

		return 'I am a function from the server. ' + secrets;
	};
	`);
});

router.get('/code-test', async (req, res) => {
	const port = Number(process.env['PORT']);
	const host = process.env['HOST'];
	const path = 'http://' + host + ':' + port;

	try {
		const testModule = await dImport(
			path + '/api/code-modules/code2',
		);

		const result = testModule.test();
		res.send(result);
	}
	catch (error) {
		res.sendStatus(500);
	}
});


router.get('/all', async (req, res) => {
	const query = new Query('./database/main.db');
	const results = query
		.from<Module>('modules')
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
		.from<Module>('modules')
		.select('namespace')
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
		.from<Module>('modules')
		.select('namespace', 'name', 'module_id', 'active', 'description')
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
		.from<Module>('modules')
		.where(filter => filter.and(
			filter.eq('module_id', params.id),
		))
		.limit(1)
		.orderBy('active', 'asc')
		.orderBy('name', 'asc')
		.query();

	const modules: Module[] = [];
	results.forEach(res => modules.push(res.item));

	res.send(await content(params.id, modules.at(0)?.code ?? ''));
});


router.post<any, any, any, {id: string; code: string;}>(`/save`, async (req, res) => {
	const { id, code } = req.body;

	const query = new Query('./database/main.db');
	const results = query
		.update<Module>('modules')
		.set([ 'code', code ])
		.where(filter => filter.eq('module_id', id))
		.query();

	res.sendStatus(200);

	console.log(results);
});
