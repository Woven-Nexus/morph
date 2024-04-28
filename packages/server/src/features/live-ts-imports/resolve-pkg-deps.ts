import { readdirSync, readFileSync  } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, sep } from 'node:path';


interface PkgJson {
	type?: 'module' | 'commonjs';
	main?: string;
	exports?: {
		'.'?: string | {
			browser?: string | {
				import?: string;
				default?: string;
			};
			default?: string;
		}
	};
	dependencies?: Record<string, string>;
}


export const getPkgDepsMap = (packageNames: string[]) => {
	const currentFile = import.meta.url.slice(8);
	const require = createRequire(currentFile);

	const tryResolve = (...args: Parameters<typeof require.resolve>) => {
		const [ id, options ] = args;

		try {
			return require.resolve(id, options);
		}
		catch (error) { /*  */ }
	};

	const depMap = new Map<string, { main: string; root: string; }>();

	const getDeps = (name: string) => {
		if (depMap.has(name))
			return;

		const mainImportPath = tryResolve(name);
		if (!mainImportPath)
			return;

		const pkgPath = getClosestPkgJson(mainImportPath);
		const pkgRoot = dirname(pkgPath);
		const pkgFile = readFileSync(pkgPath, 'utf-8');
		const pkgJson = JSON.parse(pkgFile || '{}') as PkgJson;
		const pkgDeps = getPkgDeps(pkgJson);

		let main = '';
		if (pkgJson.type === 'module') {
			const rootExport = pkgJson.exports?.['.'];
			if (rootExport) {
				if (typeof rootExport === 'string') {
					main = rootExport;
				}
				else if (rootExport.browser) {
					if (typeof rootExport.browser === 'string')
						main = rootExport.browser;
					else if (rootExport.browser.import)
						main = rootExport.browser.import;
					else if (rootExport.browser.default)
						main = rootExport.browser.default;
				}
				else if (rootExport.default) {
					main = rootExport.default;
				}
			}
		}

		if (main)
			main = join(pkgRoot, main);

		main ||= pkgJson.main ?? mainImportPath;

		depMap.set(name, {
			main: main,
			root: pkgRoot,
		});

		pkgDeps.forEach(getDeps);
	};

	packageNames.forEach(getDeps);

	return depMap;
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


const getPkgDeps = (pkgJson: PkgJson) => {
	const deps = pkgJson.dependencies ?? {};

	return Object.keys(deps);
};
