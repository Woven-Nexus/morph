/** @type {Map<string, Record<string, unknown>>} */
const moduleMap = new Map();


/**
 * @typedef { {
 * 	from: string;
 * 	defaultExport: string;
 * 	namedExports: string[];
 * } } Import
 * */


/**
 * Performs an import matched against the local moduleMap.
 * If module is not yet loaded, will load the module first and add it to the moduleMap.
 * This is used by any in forge script files and components.
 * @param {string} from
 * @param {string} defaultExport
 * @param {string[]} namedExports
 * @returns {Record<string, unknown> | Promise<Record<string, unknown>>}
 * */
export const importShim = (from) => {
	const module = moduleMap.get(from);
	if (module)
		return module;

	return (async () => {
		const javascript = getJavascript(from);
		const encodedJs = encodeURIComponent(javascript);
		const dataUri = `data:text/javascript;charset=utf-8,${ encodedJs }`;

		/** @type {Record<string, unknown>} */
		const module = await import(dataUri);

		moduleMap.set(from, module);

		return module;
	})();
};


const createPromise = () => {
	let resolve;

	return [ new Promise(res => resolve = res), resolve ];
};


/**
 * @param {string} from the module identifier.
 * @returns {string}
 */
const getJavascript = async (from) => {
	const moduleDbName = 'forge-filesystem';
	const moduleColName = 'files';
	const moduleReqIndex = 'path';

	// Open and setup the database callback request.
	const dbRequest = indexedDB.open(moduleDbName);
	const [ connectSuccess, resolveConnect ] = createPromise();
	dbRequest.onsuccess = ev => resolveConnect(ev.target.result);

	/** @type {IDBDatabase} */
	const db = await connectSuccess;

	// Create a transation on store, make a request for the file base on path.
	const transaction = db.transaction(moduleColName, 'readonly');
	const store = transaction.objectStore(moduleColName);
	const request = store.index(moduleReqIndex).get(from);

	// Setup the request callback.
	const [ requestSuccess, requestResolve ] = createPromise();
	request.onsuccess = ev => requestResolve(ev.target.result);

	/** @type {{ javascript: string; }} */
	const result = await requestSuccess;

	return result.javascript;
};
