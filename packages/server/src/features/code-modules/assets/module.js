let currentName = '';

const definitionMap = new Map();
const moduleMap = new Map();
const module = {
	define: (moduleName, definition) => {
		definitionMap.set(moduleName, definition);
	},
	export: (exportName, declaration) => {
		const exports = moduleMap.get(currentName) ??
		moduleMap.set(currentName, {}).get(currentName);

		exports[exportName] = declaration;
	},
	import: (moduleName, exportName) => {
		const definition = definitionMap.get(moduleName);
		if (definition) {
			const oldName = currentName;
			currentName = moduleName;

			definition();

			currentName = oldName;
			definitionMap.delete(moduleName);
		}

		if (!exportName)
			return;

		return moduleMap.get(moduleName)[exportName];
	},
};

Object.assign(window, {
	module,
});
