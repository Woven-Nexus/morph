// Based on https://github.com/expressjs/serve-static
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import * as esbuild from 'esbuild';
import type { RequestHandler } from 'express';
import mime from 'mime';
import parseUrl from 'parseurl';


const tsCache = new Map<string, string>();


export const tsStatic = (root: string): RequestHandler => {
	if (!root)
		throw new TypeError('root path required');

	if (typeof root !== 'string')
		throw new TypeError('root path must be a string');

	return (async (req, res, next) => {
		if (req.method !== 'GET')
			return next();

		const originalUrl = parseUrl.original(req);
		let path = parseUrl(req)?.pathname ?? '';

		// make sure redirect occurs at mount
		if (path === '/' && originalUrl?.pathname?.substring(-1) !== '/')
			path = '';

		if (path.at(-1) === '/')
			path += 'index.html';

		// paths trying to go upwards are bad.
		if (path?.startsWith('..'))
			return res.sendStatus(404);

		let file: Buffer | string | undefined;
		let filePath: string | undefined;

		const ecmaScript = await handleEcmascript(root, path);
		if (ecmaScript)
			[file, filePath] = ecmaScript;

		filePath ??= join(root, path);
		if (!ecmaScript && !existsSync(filePath))
			return next();

		const type = mime.getType(filePath);
		if (!type)
			return res.sendStatus(500);

		const charset = mimeCharsets(type);
		res.setHeader('Content-Type', type + (charset ? '; charset=' + charset : ''));

		try {
			file ??= await readFile(filePath);
			if (!file)
				return res.sendStatus(404);

			res.send(file);
		}
		catch {
			res.sendStatus(404);
		}
	}) satisfies RequestHandler;
};


const handleEcmascript = async (root: string, path: string): Promise<
	[file: string, path: string] | undefined
> => {
	// Not a js or ts file, just exit.
	if (!path.endsWith('.js') && !path.endsWith('.ts'))
		return;

	const jsPath = join(root, path).replace('.ts', '.js');
	const tsPath = jsPath.replace('.js', '.ts');

	// If the path request is a .js file, we want to first check if we have a .ts version of it.
	// If one does not exist, then defer back to the .js and skip the typescript transpiling.
	if (path.endsWith('.js')) {
		if (existsSync(tsPath))
			path = path.replace('.js', '.ts');
		else if (!existsSync(jsPath))
			return;
	}

	let file: string;

	if (path?.endsWith('.ts')) {
		if (!existsSync(tsPath))
			return;

		if (!tsCache.has(path)) {
			const content = await readFile(tsPath, 'utf-8');
			const code = (await esbuild.transform(content, {
				loader:      'ts',
				tsconfigRaw: {
					compilerOptions: {
						experimentalDecorators:  true,
						useDefineForClassFields: false,
					},
				},
			})).code;
			tsCache.set(path, code);
		}

		file = tsCache.get(path) ?? '';
	}

	file ??= await readFile(jsPath, 'utf-8');

	return [file, jsPath];
};


const mimeCharsets = (mimeType: string, fallback?: string) => {
	// Assume text types are utf8
	return (/^text\/|^application\/(javascript|json)/)
		.test(mimeType) ? 'UTF-8' : fallback ?? '';
};