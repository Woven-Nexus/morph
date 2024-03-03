import { libConfig } from '@roenlie/package-toolbox/vite-utils/vite-lib-config.js';

import { jsxlikeTemplatePlugin } from '../src/jsxlike-template-plugin.js';


export default libConfig({
	logLevel: 'silent',
	build:    {
		outDir: './demo/dist',
		lib:    {
			entry:   './demo/index.ts',
			formats: [ 'es' ],
		},
	},
	plugins: [ jsxlikeTemplatePlugin() ],
});
