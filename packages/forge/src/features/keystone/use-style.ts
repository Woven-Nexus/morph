import type { css } from 'lit';


const randomString = (length: number) => {
	const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

	let str = '';
	str += '';
	for (let i = 0; i < length; i++) {
		const index = Math.floor(Math.random() * chars.length);
		str += chars[index];
	}

	return str;
};

export function useStyle(stylesheet: CSSStyleSheet | ReturnType<typeof css>) {
	let styles = '';

	if (stylesheet instanceof CSSStyleSheet)
		styles = [ ...stylesheet.cssRules ].map(r => r.cssText).join('\n');
	else
		styles = stylesheet.cssText;

	const id = randomString(10);
	const sheet = new CSSStyleSheet();
	styles = `@layer ${ id } {	${ styles }\n}`;

	console.log(styles);

	sheet.replaceSync(styles);
	document.adoptedStyleSheets.push(sheet);
}
