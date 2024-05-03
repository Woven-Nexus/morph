import { liveTsImports } from '@roenlie/live-ts-imports';

import { registerFileRoutes } from '../utilities/register-file-routes.js';
import { app, server } from './main.js';


liveTsImports({
	app,
	server,
	importMeta: import.meta,
	packages:   [
		'lit',
		'@lit-labs/preact-signals',
		'@roenlie/mimic-core',
		'@roenlie/monaco-editor-wc',
	],
	vendorDir: '_vendor',
	clientDir: 'client',
});

await registerFileRoutes('src/api', 'api');
await registerFileRoutes('src/client');

server.listen(Number(process.env.PORT), process.env.HOST, () => {
	console.log(`⚡️[server]: Server is running at http://localhost:${ Number(process.env.PORT) }`);
});
