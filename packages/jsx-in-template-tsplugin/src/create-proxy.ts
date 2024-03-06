import type TS from  'typescript/lib/tsserverlibrary';


export const createDecoratorProxy = (info: TS.server.PluginCreateInfo) => {
	const proxy: TS.LanguageService = Object.create(null);
	for (const k of Object.keys(info.languageService) as (keyof TS.LanguageService)[]) {
		const x = info.languageService[k]!;
		// @ts-expect-error - JS runtime trickery which is tricky to type tersely
		proxy[k] = (...args: object[]) => x.apply(info.languageService, args);
	}

	return proxy;
};
