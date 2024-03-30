import type { Router } from 'express';
import express from 'express';

import { urlencodedParser } from '../../../utilities/body-parser.js';
import { createResponse } from '../../../utilities/create-response.js';
import {
	deleteModule,
	getAllInNamespace, getAllModules, getAllNamespaces,
	getByNamespaceAndID, insertModule, updateModule,
} from '../database/modules-behavior.js';
import type { IModule } from '../database/modules-create-table.js';
import dImport from '../dynamic-import.js';


export const router: Router = express.Router();
export default router;


router.get('/code1', (req, res) => {
	res.send(`
	console.log('I AM FROM /api/modules/code1');

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
			path + '/api/modules/code2',
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

router.post('/save', urlencodedParser, async (req, res) => {
	const module = req.body as IModule;

	updateModule(module);

	res.sendStatus(200);
});

router.delete('/delete', urlencodedParser, async (req, res) => {
	const module = req.body as IModule;

	deleteModule(module);

	res.sendStatus(200);
});

router.delete('/insert', urlencodedParser, async (req, res) => {
	const module = req.body as IModule;

	insertModule(module);

	res.sendStatus(200);
});
