import { ScriptTarget, transpile } from 'typescript';


const importRegex = /import *(.*?)? *?(?:from)? *?["'](.*?)["'];/g;
const namedExportRegex = /{(.*)}/;

interface Import {
	from: string;
	named: string[];
	default: string;
}


self.onmessage = (ev: MessageEvent<string>) => {
	let code = ev.data;

	const matches: [imports: string, from: string][] = [];
	code = code.replaceAll(importRegex, (_, imports, from) => {
		return matches.push([ imports, from ]), '';
	}).trim();

	const imports = matches.map(([ imports, from ]) => {
		const namedImports: string[] = [];
		const defaultImport = imports?.replace(namedExportRegex, (_, group1: string) => {
			return namedImports.push(...group1.split(',').map(s => s.trim())), '';
		}).replace(/[, ]+$/, '') ?? '';

		return {
			default: defaultImport,
			named:   namedImports,
			from:    from!,
		} as Import;
	});

	code = [
		'import {importShim} from "import-shim";',
		'importShim();',
		code,
	].join('\n');


	console.log(code);
	console.log(...imports);

	const transpiledCode = transpile(code ?? '', {
		target:                 ScriptTarget.ESNext,
		experimentalDecorators: true,
	});
	postMessage(transpiledCode);
};
