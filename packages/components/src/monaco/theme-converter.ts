import type { editor } from 'monaco-editor';


// This is the structure of a vscode theme file.
export interface IThemeObject {
	name: string;
	type?: string;
	colors?: Record<string, string>;
	tokenColors?: ITokenEntry[];
}

export interface ITokenEntry {
	name?: string;
	scope: string[] | string;
	settings: {
		foreground?: string;
		background?: string;
		fontStyle?: string;
	};
}


/** Converts a vscode theme into a monaco theme */
export const updateTheme = (
	theme: IThemeObject,
): editor.IStandaloneThemeData & {name: string} => {
	const tokenRules: editor.ITokenThemeRule[] = (theme.tokenColors ?? []).flatMap(value => {
		const scopeValue = value.scope || [];
		const scopes = Array.isArray(scopeValue) ? scopeValue : scopeValue.split(',');

		return scopes.map(scope => ({
			token:      scope,
			foreground: value.settings.foreground,
			background: value.settings.background,
			fontStyle:  value.settings.fontStyle,
		}));
	});

	return {
		name:    theme.name,
		base:    theme.type === 'light' ? 'vs' : 'vs-dark',
		inherit: true,
		rules:   tokenRules,
		colors:  theme.colors ?? {},
		//colors:  {},
	};
};
