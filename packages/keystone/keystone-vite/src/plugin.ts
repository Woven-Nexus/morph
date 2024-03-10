import { type Plugin } from 'vite';

import { KeystoneTemplateTransformer } from './transformer.js';


/**
 * Enables using <Hello></Hello> and <Hello /> type Keystone syntax to automatically
 * insert the keystone component function in its place, with related props and children.
 */
export const keystone = (options?: {
	/** List of tagged template literal expression names
	 * that will be parsed for Keystone components. */
	names: string | string[]
}) => {
	let { names = 'html' } = options ?? {};
	names = Array.isArray(names) ? names : [ names ];

	const transformer = new KeystoneTemplateTransformer(names);

	return {
		name: 'vite-plugin-keystone',
		async transform(code, id) {
			if (!id.endsWith('.ts') && !id.endsWith('js'))
				return;

			return transformer.transform(code, id);
		},
	} as Plugin;
};
