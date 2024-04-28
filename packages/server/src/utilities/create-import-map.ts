import { join, relative, resolve, sep } from 'node:path';
import { getPkgDepsMap } from './resolve-pkg-deps.js';


export const createImportMap = (
	prefix: string,
	pkgDepsMap: ReturnType<typeof getPkgDepsMap>
) => {
	const imports = new Map<string, string>;

	pkgDepsMap.forEach(({ main, root }, key) => {
		const pathKey = key.replaceAll('/', '-');
		const mainPath = main.replace(root, '').replaceAll(sep, '/');

		if (!prefix.startsWith('.'))
			prefix = '.' + prefix;

		imports.set(key, prefix + '/' + pathKey + mainPath);
		imports.set(key + '/', prefix + '/' +  pathKey + '/');
	});

	const importmap: Record<string, string> = {};

	imports.forEach((value, key) => {
		importmap[key] = value;
	});

	return JSON.stringify({
		imports: importmap
	}, null, '\t')
};
