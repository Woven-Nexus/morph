import type TS from  'typescript/lib/tsserverlibrary';

import { createDecoratorProxy } from './create-proxy.js';

const allTagsExpr = /<([A-Z]\w+)/g;
const tagnameExpr = /'(\w+)'/;


// eslint-disable-next-line @typescript-eslint/no-unused-vars
function init(modules: { typescript: typeof TS }) {
	function create(info: TS.server.PluginCreateInfo) {
		// Diagnostic logging
		info.project.projectService.logger.info(
			'jsxlike-template-tsplugin: ' + new Date(Date.now()).toISOString(),
		);

		// Set up decorator object
		const proxy = createDecoratorProxy(info);
		proxy.getSuggestionDiagnostics = (fileName) => {
			const prior = info.languageService.getSuggestionDiagnostics(fileName);
			const file = info.project.readFile(fileName);

			const tagsInUse = new Set<string>();
			for (const [ , group1 ] of file?.matchAll(allTagsExpr) ?? [])
				group1 && tagsInUse.add(group1);

			// We iterate backwards, as we will be removing any nodes
			// that we deem are in use, based on their existance in template.
			for (let i = prior.length - 1; i >= 0; i--) {
				const node = prior[i]!;

				// We are only interested in the rule that marks a variable as unused.
				if (node.code !== 6133)
					continue;

				// Message always starts with 'variable name' xxx
				// So we use a regex to extract the var name, as cba to figure out api to get the node.
				const varName = tagnameExpr.exec(node.messageText.toString())?.[1] ?? '';
				if (tagsInUse.has(varName))
					prior.splice(i, 1);
			}

			return prior;
		};

		return proxy;
	}

	return { create };
}


export default init;
