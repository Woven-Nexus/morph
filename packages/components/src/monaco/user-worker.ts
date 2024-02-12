import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

export const setUserWorker = (() => {
	let initialized = false;

	const fn = () => {
		if (initialized)
			return;

		initialized = true;
		self.MonacoEnvironment = {
			getWorker(_: unknown, label: string) {
				if (label === 'json')
					return new jsonWorker();

				if (label === 'css' || label === 'scss' || label === 'less')
					return new cssWorker();

				if (label === 'html' || label === 'handlebars' || label === 'razor')
					return new htmlWorker();

				if (label === 'typescript' || label === 'javascript')
					return new tsWorker();

				return new editorWorker();
			},
		};

		const ts = monaco.languages.typescript;
		ts.typescriptDefaults.setEagerModelSync(true);
		ts.typescriptDefaults.setCompilerOptions({
			...ts.typescriptDefaults.getCompilerOptions(),
			experimentalDecorators:             true,
			target:                             ts.ScriptTarget.ESNext,
			module:                             ts.ModuleKind.ESNext,
			moduleResolution:                   ts.ModuleResolutionKind.Classic,
			pretty:                             true,
			strict:                             true,
			noUncheckedIndexedAccess:           true,
			noPropertyAccessFromIndexSignature: true,
			strictPropertyInitialization:       false,
			forceConsistentCasingInFileNames:   true,
			allowSyntheticDefaultImports:       true,
			noImplicitOverride:                 true,
			useDefineForClassFields:            false,
			noEmitOnError:                      true,
			incremental:                        false,
			verbatimModuleSyntax:               true,
			esModuleInterop:                    true,
			skipLibCheck:                       true,
			resolveJsonModule:                  true,
			noUnusedLocals:                     false,
			noUnusedParameters:                 false,
			noFallthroughCasesInSwitch:         true,
			strictNullChecks:                   true,
			emitDecoratorMetadata:              true,
			noImplicitReturns:                  false,
			noImplicitAny:                      true,
			noImplicitThis:                     true,
			isolatedModules:                    true,
		});
	};

	fn();

	return fn;
})();
