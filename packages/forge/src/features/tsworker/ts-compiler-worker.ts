import { ScriptTarget, transpile } from 'typescript';

import { ForgeFile, ForgeFileDB } from '../filesystem/forge-file.js';
import { MimicDB } from '../filesystem/mimic-db.js';


const importRegex = /import *(.*?)? *?(?:from)? *?["'](.*?)["'];/g;
const namedExportRegex = /{(.*)}/;

interface Import {
	from: string;
	namedExports: string[];
	defaultExport: string;
}


self.onmessage = async (ev: MessageEvent<{id: string; content: string;}>) => {
	const { id, content } = ev.data;

	const matches: [imports: string, from: string][] = [];
	let code = content.replaceAll(importRegex, (_, imports, from) => {
		return matches.push([ imports, from ]), '';
	}).trim();

	const imports = matches.map(([ imports, from ]) => {
		const namedImports: string[] = [];
		const defaultImport = imports?.replace(namedExportRegex, (_, group1: string) => {
			return namedImports.push(...group1.split(',').map(s => s.trim())), '';
		}).replace(/[, ]+$/, '') ?? '';

		return {
			defaultExport: defaultImport,
			namedExports:  namedImports,
			from:          from!,
		} as Import;
	});

	code = [
		'import {importShim} from "import-shim";',
		...imports.map(({ defaultExport, namedExports: exports, from }) => {
			const exportNames = [ defaultExport, ...exports ].filter(Boolean);

			return exportNames.length
				? `const {${ exportNames }} = await importShim('${ from }')`
				: `await importShim('${ from }')`;
		}),
		code,
	].join('\n');

	const transpiledCode = transpile(code ?? '', {
		target:                 ScriptTarget.ESNext,
		experimentalDecorators: true,
	});

	// After transpiling, we get the current file, and update its content and javascript entries.
	const collection = MimicDB.connect(ForgeFileDB).collection(ForgeFile);
	const file = (await collection.get(id))!;
	const encodedJs = encodeURIComponent(transpiledCode);
	const dataUri = 'data:text/javascript;charset=utf-8,' + encodedJs;

	if (file.content !== content) {
		file.uriImport = dataUri;
		file.content = content;

		await collection.put(file);
	}

	postMessage({
		specifier: file.path.replace(/^\/+/, ''),
		uri:       dataUri,
	});
};
