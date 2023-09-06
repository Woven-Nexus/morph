import { app } from '../../app.js';
import dImport from './dynamic-import.js';
import { sandbox } from './sandbox.js';


app.get('/code1', (req, res) => {
	res.send(`
	console.log('I AM FROM /CODE1');

	export const secrets = 'this is a secret';
	`);
});

app.get('/code2', (req, res) => {
	res.send(`
	const { secrets } = await dImport('http://localhost:42069/code1');

	export const test = () => {
		console.log('If you see this, this code has access to local scope');

		return 'I am a function from the server' + secrets;
	};
	`);
});

app.get('/code-test', async (req, res) => {
	const testModule = await dImport(
		'http://localhost:42069/code2',
		{ sandbox },
	);

	const result = testModule.test();

	res.send(result);
});
