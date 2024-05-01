import { existsSync, mkdirSync, symlinkSync } from 'node:fs';
import { join } from 'node:path';

import { getPkgDepsMap } from '../../../../live-ts-imports/src/resolve-pkg-deps.js';


export const createClientSymlinks = (
	libDir: string,
	pkgDepsMap: ReturnType<typeof getPkgDepsMap>,
) => {
	mkdirSync(libDir, { recursive: true });

	pkgDepsMap.forEach(({ root }, key) => {
		const dir = join(libDir, key.replaceAll('/', '-'));
		if (!existsSync(dir))
			symlinkSync(root, dir, 'dir');
	});
};
