import { expect, test } from 'vitest';

import { extractExports } from '../src/resolve-pkg-deps.js';


test('test', () => {
	const packageName = 'tslib';
	const wierdExports = {
		'.': {
			'module': {
				'types':   './modules/index.d.ts',
				'default': './tslib.es6.mjs',
			},
			'import': {
				'node':    './modules/index.js',
				'default': {
					'types':   './modules/index.d.ts',
					'default': './tslib.es6.mjs',
				},
			},
			'default': './tslib.js',
		},
		'./*': './*',
		'./':  './',
	};

	const exports = extractExports(packageName, wierdExports);

	expect([ ...exports ]).to.be.deep.equal([
		[ 'tslib', 'tslib/tslib.es6.mjs' ],
		[ 'tslib/', 'tslib/' ],
	]);
});
