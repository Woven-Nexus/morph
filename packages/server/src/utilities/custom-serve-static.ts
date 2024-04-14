// Based on https://github.com/expressjs/serve-static

import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import * as esbuild from 'esbuild';
import type { RequestHandler } from 'express';
import mime from 'mime';
import parseUrl from 'parseurl';


const tsCache = new Map<string, string>();

const mimeCharsets = (mimeType: string, fallback?: string) => {
	// Assume text types are utf8
	return (/^text\/|^application\/(javascript|json)/)
		.test(mimeType) ? 'UTF-8' : fallback ?? '';
};


export const tsStatic = (root: string): RequestHandler => {
	if (!root)
		throw new TypeError('root path required');

	if (typeof root !== 'string')
		throw new TypeError('root path must be a string');

	const handler: RequestHandler = async (req, res, next) => {
		if (req.method !== 'GET')
			return next();

		const originalUrl = parseUrl.original(req);
		let path = parseUrl(req)?.pathname ?? '';

		// make sure redirect occurs at mount
		if (path === '/' && originalUrl?.pathname?.substring(-1) !== '/')
			path = '';

		// paths trying to go upwards are bad.
		if (path?.startsWith('..'))
			return res.sendStatus(404);

		let file: Buffer | string | undefined;

		const ecmaScript = await handleTypescript(root, path);
		if (ecmaScript) {
			file = ecmaScript.file;
			path = ecmaScript.path;
		}

		const filePath = join(root, path);

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
	};

	return handler;
};


const handleTypescript = async (root: string, path: string): Promise<{
	path: string;
	file: string;
} | undefined> => {
	// If the path request is a .js file, we want to first check if we have a .ts version of it.
	// If one does not exist, then defer back to the .js and skip the typescript transpiling.
	if (path.endsWith('.js')) {
		const filePath = join(root, path.replace('.js', '.ts'));
		if (existsSync(filePath))
			path = path.replace('.js', '.ts');
	}

	if (path?.endsWith('.ts')) {
		const filePath = join(root, path);
		if (!existsSync(filePath))
			return;

		if (!tsCache.has(path)) {
			const content = await readFile(filePath, 'utf-8');
			const code = (await esbuild.transform(content, { loader: 'ts' })).code;
			tsCache.set(path, code);
		}

		return {
			file: tsCache.get(path)!,
			path: path.replace('.ts', '.js'),
		};
	}
};
