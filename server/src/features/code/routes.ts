import { app } from '../../app.js';
import dynamicImport from './dynamic-import.js';


app.get('/code', (req, res) => {
	res.send(`
	export const test = () => {
		console.log('If you see this, this code has access to local scope');

		return 'I am a function from the server';
	};
	`);
});


app.get('/code-test', async (req, res) => {
	const testModule = await dynamicImport(
		'http://localhost:42069/code',
	);

	const result = testModule.test();

	res.send(result);
});
