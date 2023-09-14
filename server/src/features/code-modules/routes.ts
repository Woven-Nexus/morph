import express, { type Router } from 'express';

import { app } from '../../app.js';
import type { IModule } from '../../database.js';
import { Filter, Query } from '../db-utils/query.js';
import dImport from './dynamic-import.js';
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
	const filter = new Filter<IModule>();
	const query = new Query('./database/main.db');

	const whereRecord = query
		.get<IModule>('modules')
		.where(
			filter.exists('name'),
		)
		.orderBy('active', 'asc')
		.query();

	const modules: IModule[] = [];

	while (whereRecord.next()) {
		modules.push({
			active:      whereRecord.active,
			code:        whereRecord.code,
			description: whereRecord.description,
			name:        whereRecord.name,
			namespace:   whereRecord.namespace,
			module_id:   whereRecord.module_id,
		});
	}

	res.send(modules);
});


router.get(`/:namespace`, async (req, res) => {
	const params = req.params;

	res.send(params);
});


router.get(`/:namespace/:name`, async (req, res) => {
	const params = req.params;

	res.send(params);
});


export default router;
