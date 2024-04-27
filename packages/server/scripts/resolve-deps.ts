import { readdirSync, readFileSync  } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, sep } from 'node:path';

import { resolve } from 'import-meta-resolve';


export const getSymlinkMap = (packageNames: string[]) => {
	const currentFile = import.meta.url.slice(8);
	const require = createRequire(currentFile);

	const tryResolve = (...args: Parameters<typeof require.resolve>) => {
		const [ id, options ] = args;

		try {
			const resolvedPath = import.meta.resolve(id)
				.slice(8)
				.replaceAll('/', sep);

			return resolvedPath;
		}
		catch (error) { /*  */ }
	};

	const depMap = new Map<string, { main: string; root: string; }>();

	const getDeps = (name: string) => {
		if (depMap.has(name))
			return;

		//const mainImportPath = tryResolve(name);
		const mainImportPath = resolve(name, import.meta.url)
			.slice(8);

		console.log(name, mainImportPath);

		if (!mainImportPath)
			return;

		const pkgPath = getClosestPkgJson(mainImportPath);
		const pkgFile = readFileSync(pkgPath, 'utf-8');
		const pkgJson = JSON.parse(pkgFile || '{}');
		const pkgDeps = getPkgDeps(pkgJson);

		depMap.set(name, {
			main: mainImportPath,
			root: dirname(pkgPath),
		});

		pkgDeps.forEach(getDeps);
	};

	packageNames.forEach(getDeps);

	return new Map();

	//return depMap;
};


const getClosestPkgJson = (initialPath: string) => {
	let count = 0;
	let pkgPath = '';
	let dir = dirname(initialPath);

	while (!pkgPath && count < 100) {
		const files = readdirSync(dir);
		pkgPath = files.some(f => f.endsWith('package.json'))
			? join(dir, 'package.json') : '';

		if (!pkgPath)
			dir = dir.split(sep).slice(0, -1).join(sep);

		count++;
	}

	return pkgPath;
};


const getPkgDeps = (pkgJson: {
	dependencies?: Record<string, string>;
}) => {
	const deps = pkgJson.dependencies ?? {};

	return Object.keys(deps);
};
