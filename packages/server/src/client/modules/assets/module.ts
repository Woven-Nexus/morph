let currentName = '';

const definitionMap = new Map<string, Function>();
const moduleMap = new Map<string, Record<keyof any, any>>();

const imports = {
	define: (moduleName: string, definition: Function) => {
		definitionMap.set(moduleName, definition);
	},
	export: (exportName: string, declaration: object) => {
		const exports = moduleMap.get(currentName) ??
		moduleMap.set(currentName, {}).get(currentName)!;

		exports[exportName] = declaration;
	},
	import: (moduleName: string, exportName: string) => {
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

		return moduleMap.get(moduleName)?.[exportName];
	},
};

Object.assign(window, {
	module: imports,
});
