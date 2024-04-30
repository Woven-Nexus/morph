import { sep } from 'node:path';

import { getPkgDepsMap } from './resolve-pkg-deps.js';


export const createImportMap = (
	prefix: string,
	pkgDepsMap: ReturnType<typeof getPkgDepsMap>,
) => {
	const imports = new Map<string, string>;

	pkgDepsMap.forEach(({ main, root, exports }, key) => {
		const pathKey = key.replaceAll('/', '-');
		const mainPath = main.replace(root, '')
			.replaceAll(sep, '/');

		if (!prefix.startsWith('.'))
			prefix = '.' + prefix;

		imports.set(key, prefix + '/' + pathKey + mainPath);

		Object.entries(exports ?? {}).forEach(([ expName, expValue ]) => {
			let rawExportPath = '';
			if (typeof expValue === 'string') {
				rawExportPath = expValue;
			}
			else if (typeof expValue.browser === 'string') {
				rawExportPath = expValue.browser;
			}
			else {
				rawExportPath = expValue.browser?.import
					|| expValue.browser?.default
					|| expValue.import
					|| expValue.default
					|| '';
			}

			if (!rawExportPath)
				return;

			let exportKey = key + expName
				.replace(/^./, '')
				.replace(/\/\*$/, '');

			let exportPath = (
				prefix
				+ '/'
				+ pathKey
				+ '/'
				+ rawExportPath.replace(/^\./, '')
			).replaceAll(/\/{2,}/g, '/')
				.replace(/\/\*$/, '');

			if (exportKey.endsWith('/*'))
				exportKey = exportKey.slice(0, -1);

			if (exportPath.endsWith('/*'))
				exportPath = exportPath.slice(0, -1);

			imports.set(key + expName.replace(/^./, ''), exportPath);
		});

		imports.set(key + '/', prefix + '/' +  pathKey + '/');
	});

	const importmap: Record<string, string> = {};

	imports.forEach((value, key) => {
		importmap[key] = value;
	});

	const obj = JSON.stringify({
		imports: importmap,
	}, null, '\t');

	const lines = obj.split('\n');
	const importLines = lines.slice(2, -2);

	const longestKey = importLines.reduce((acc, cur) => {
		const keyLength = cur.split('":').at(0)?.length ?? 0;

		return keyLength > acc ? keyLength : acc;
	}, 0);

	const newLines = importLines.map(line => {
		const [ key, value ] = line.split('":') as [string, string];

		return key + '":' + ' '.repeat(longestKey - key.length) + value;
	});

	lines.splice(2, newLines.length, ...newLines);

	return lines.join('\n');
};
