import { existsSync, mkdirSync, symlinkSync } from 'node:fs';
import { getPkgDepsMap } from './resolve-pkg-deps.js';
import { join } from 'node:path';


export const createClientSymlinks = (
	libDir: string,
	pkgDepsMap: ReturnType<typeof getPkgDepsMap>
) => {
	mkdirSync(libDir, { recursive: true });

	pkgDepsMap.forEach(({ root }, key) => {
		const dir = join(libDir, key.replaceAll('/', '-'));
		if (!existsSync(dir))
			symlinkSync(root, dir, 'dir');
	});
}
