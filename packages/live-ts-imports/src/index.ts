import type { Server as HTTPServer } from 'node:http';
import type { Server as HTTPSServer } from 'node:https';
import { join, resolve } from 'node:path';

import type express from 'express';
import { WebSocketServer } from 'ws';

import { createClientSymlinks } from './create-client-symlinks.js';
import { createImportMap } from './create-import-map.js';
import { tsStatic } from './custom-serve-static.js';
import { getPkgDepsMap } from './resolve-pkg-deps.js';


export interface LiveTsImportsConfig {
	importMeta: ImportMeta,
	server: HTTPServer | HTTPSServer,
	app: express.Express,
	packages: string[],
	vendorDir?: string,
	clientDir?: string,
	clientPath?: string,
	vendorPath?: string,
}


export const liveTsImports = (config: LiveTsImportsConfig) => {
	let {
		vendorDir = '_vendor',
		clientDir = 'client',
	} = config;

	const {
		app,
		server,
		importMeta,
		packages: clientPackages,
		clientPath = '/',
		vendorPath = '/vendor',
	} = config;

	vendorDir = join(resolve(), 'node_modules', vendorDir);
	clientDir = join(resolve(), clientDir);

	const pkgDepsMap = getPkgDepsMap(importMeta, clientPackages);
	const importmap = createImportMap(vendorPath, pkgDepsMap);

	createClientSymlinks(vendorDir, pkgDepsMap);

	app.use(clientPath, tsStatic(clientDir, importmap, vendorPath));
	app.use(vendorPath, tsStatic(vendorDir, importmap, vendorPath));

	return {
		wss: new WebSocketServer({ server }),
	};
};
