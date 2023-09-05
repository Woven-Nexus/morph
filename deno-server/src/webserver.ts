import { get, requestDelegator } from './request-delegator.ts';

get('/code', (request) => {
	console.log('I got a request');

	return new Response('console.log("test");', {
		headers: {
			'content-type': 'application/json; charset=utf-8',
		},
	});
});

get('/code-test', async () => {
	const result = import('http://localhost:4269/code');
	console.log(result);

	return new Response();
});

Deno.serve({ port: 4269 }, async (req, info) => {
	console.log('got request', req);

	return await requestDelegator(req, info);
});
