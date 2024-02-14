import { ScriptTarget, transpile } from 'typescript';


self.onmessage = (ev: MessageEvent<string>) => {
	const transpiledCode = transpile(ev.data ?? '', {
		target:                 ScriptTarget.ESNext,
		experimentalDecorators: true,
	});
	postMessage(transpiledCode);
};
