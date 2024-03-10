import type { css } from 'lit';


export function useStyle(stylesheet: CSSStyleSheet | ReturnType<typeof css>, layer?: string) {
	let sheet: CSSStyleSheet;

	if (stylesheet instanceof CSSStyleSheet) {
		sheet = stylesheet;
	}
	else {
		sheet = new CSSStyleSheet();
		sheet.replaceSync(stylesheet.cssText);
	}

	if (layer) {
		let styles = '';
		for (const rule of sheet.cssRules)
			styles += rule.cssText;

		styles = `@layer keystone.${ layer } {` + styles + '}';
		sheet.replaceSync(styles);
	}

	document.adoptedStyleSheets.push(sheet);
}
