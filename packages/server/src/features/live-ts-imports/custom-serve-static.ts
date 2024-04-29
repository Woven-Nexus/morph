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
		let filePath: string = join(root, path);

		const ecmaScript = await handleEcmascript(root, path);
		if (ecmaScript)
			[file, filePath] = ecmaScript;

		if (!ecmaScript && !existsSync(filePath))
			return next();

		const type = mime.getType(filePath);
		if (!type)
			return res.sendStatus(500);

		const charset = mimeCharsets(type);
		res.setHeader(
			'Content-Type',
			type + (charset ? '; charset=' + charset : '')
		);

		file ??= await readFile(filePath);

		return res.send(file);
	}) satisfies RequestHandler;
};


const handleEcmascript = async (
	root: string,
	path: string
): Promise<[file: string, path: string] | undefined> => {
	if (!path.endsWith('.ts'))
		return;

	const filePath = join(root, path);

	if (!existsSync(filePath))
		return;

	if (!tsCache.has(path)) {
		const content = await readFile(filePath, 'utf-8');
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

	return [
		tsCache.get(path)!,
		filePath.replace('.ts', '.js')
	];
};


const mimeCharsets = (mimeType: string, fallback?: string) => {
	// Assume text types are utf8
	return (/^text\/|^application\/(javascript|json)/)
		.test(mimeType) ? 'UTF-8' : fallback ?? '';
};