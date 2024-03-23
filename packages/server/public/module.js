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


//const originalCreateElement = document.createElement;
//document.createElement = function(...args) {
//	// If this is not a script tag, bypass
//	if (args[0].toLowerCase() !== 'script')
//		return originalCreateElement.call(this, ...args);

//	const el = originalCreateElement.call(this, ...args);
//	const originalSetAttribute = el.setAttribute.bind(el);

//	Object.defineProperty(el, 'moduleName', {
//		set(v) {
//			el.type = 'javascript/blocked';
//			originalSetAttribute('module-name', v);
//		},
//	});

//	el.setAttribute = function(name, value) {
//		if (name === 'module-name')
//			el['moduleName'] = value;
//		else
//			originalSetAttribute(name, value);
//	};

//   return el;
//};


//const mutObs = new MutationObserver((entries) => {
//	for (const entry of entries) {
//		for (const node of entry.addedNodes) {
//			if (node instanceof HTMLScriptElement) {
//				const moduleName = node.getAttribute('module-name');
//				if (moduleName) {
//					const script = document.createElement('script');
//					script.type = 'module';
//					script.innerHTML = `module.define('${ moduleName }', () => {`
//						+ node.innerHTML + '});';

//					if (node.getAttribute('immediate') !== null)
//						script.innerHTML += `\nmodule.import('${ moduleName }');`;

//					node.insertAdjacentElement('afterend', script);
//					//node.remove();
//					//script.remove();
//				}
//			}
//		}
//	}
//});

//mutObs.observe(document, { subtree: true, childList: true });
