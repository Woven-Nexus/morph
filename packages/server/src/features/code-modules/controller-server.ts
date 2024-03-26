import bodyParser from 'body-parser';

import { createResponse } from '../../utilities/create-response.js';
import {
	getAllInNamespace, getAllModules, getAllNamespaces,
	getByNamespaceAndID, updateModule,
} from './db-actions/modules-behavior.js';
import type { Module } from './db-actions/modules-create-table.js';
import dImport from './dynamic-import.js';
import { serverCtrlCodeModules as router } from './router.js';


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
		console.error(error);
		res.sendStatus(500);
	}
});

router.get('/all', async (req, res) => {
	const modules = getAllModules();

	res.send(createResponse(modules, ''));
});

router.get('/namespaces', async (req, res) => {
	const modules = getAllNamespaces();

	res.send(createResponse(modules, ''));
});

router.get(`/:namespace`, async (req, res) => {
	const { namespace } = req.params;
	const modules = getAllInNamespace(namespace);

	res.send(createResponse(
		modules,
		'No namespace found with name: ' + namespace,
	));
});

router.get(`/:namespace/:moduleId`, async (req, res) => {
	const { namespace, moduleId } = req.params;
	const modules = getByNamespaceAndID(namespace, moduleId);

	res.send(createResponse(modules, ''));
});

const urlencodedParser = bodyParser.urlencoded({ extended: false });
router.post<
	any, any, any, Module
>('/save', urlencodedParser, async (req, res) => {
	const module = req.body;

	// In a form, a checkbox value is not sent if it is unchecked.
	// therefor we need to check if active is included or not.
	module.active = !('active' in module) ? 0 : 1;

	updateModule(module);

	res.sendStatus(200);
});
