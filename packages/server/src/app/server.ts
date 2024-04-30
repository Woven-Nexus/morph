import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { createClientSymlinks } from '../features/live-ts-imports/create-client-symlinks.js';
import { createImportMap as createClientImportMap } from '../features/live-ts-imports/create-import-map.js';
import { tsStatic } from '../features/live-ts-imports/custom-serve-static.js';
import { getPkgDepsMap } from '../features/live-ts-imports/resolve-pkg-deps.js';
import { registerFileRoutes } from '../utilities/register-file-routes.js';
import { app, server } from './main.js';


// setup symlinks and importmap.
const libDir = join(resolve(), 'node_modules', '_client_lib');
const packageNames = [ 'lit', '@roenlie/mimic-core' ];

const pkgDepsMap = getPkgDepsMap(packageNames);
const importmap = createClientImportMap('/vendor', pkgDepsMap);

createClientSymlinks(libDir, pkgDepsMap);

const htmlIndexPath = join(resolve(), 'client', 'index.html');

const importmapExpr = /(?<=<script type="importmap">).*?(?=<\/script>)/gs;
let htmlContent = readFileSync(htmlIndexPath, 'utf-8');
htmlContent = htmlContent.replace(importmapExpr, () =>
`\n${ importmap.split('\n').map(l => '\t\t' + l).join('\n') }\n\t\t`);

writeFileSync(htmlIndexPath, htmlContent);

// Root
app.use('/', tsStatic(join(resolve(), 'client')));
app.use('/vendor', tsStatic(join(resolve(), 'node_modules', '_client_lib')));

await registerFileRoutes('src/api', 'api');
await registerFileRoutes('src/client');

server.listen(Number(process.env.PORT), process.env.HOST, () => {
	console.log(`⚡️[server]: Server is running at http://localhost:${ Number(process.env.PORT) }`);
});
