import { existsSync, symlinkSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';

import { getSymlinkMap } from './resolve-deps.js';


const libDir = join(resolve(), 'client', 'lib');
const packageNames = [ 'lit' ];

const map = getSymlinkMap(packageNames);
map.forEach(({ root }, key) => {
	const dir = join(libDir, key.replaceAll('/', '-'));
	if (!existsSync(dir))
		symlinkSync(root, dir, 'dir');
});


const outputImportMap = (symlinkMap: ReturnType<typeof getSymlinkMap>) => {
	const imports = new Map<string, string>;

	symlinkMap.forEach(({ main, root }, key) => {
		const dir = join(libDir, key.replaceAll('/', '-'))
			.replaceAll(sep, '/');

		let resolved = relative(join(resolve(), 'client'), dir)
			.replaceAll(sep, '/');

		if (!resolved.startsWith('.'))
			resolved = './' + resolved;

		imports.set(key, resolved + main.replace(root, '').replaceAll(sep, '/'));
		imports.set(key + '/', resolved + '/');
	});

	const importmap: Record<string, string> = {};

	imports.forEach((value, key) => {
		importmap[key] = value;
	});

	console.log(importmap);
};


// TODO, it's currently resolving NODE path, try to make it resolve browser.
outputImportMap(map);
