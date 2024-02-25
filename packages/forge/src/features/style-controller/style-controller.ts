import { LitElement, type ReactiveController, type ReactiveControllerHost } from 'lit';


export class StyleController implements ReactiveController {

	protected stylesheet = new CSSStyleSheet();
	protected host: LitElement & { shadowRoot: ShadowRoot };

	constructor(
		host: ReactiveControllerHost,
		protected updateStyle: (css: StyleController['css']) => string,
	) {
		if (!this.isLitElement(host)) {
			throw new Error('Dynamic style controller uses adoptedStyleSheets'
				+ ' therefor it only works on elements that have a ShadowRoot');
		}

		(this.host = host).addController(this);
	}

	public css = (strings: TemplateStringsArray, ...values: any[]): string => {
		let result = '';
		for (let i = 0; i < strings.length; i++) {
			const string = strings[i]!;
			result += string;

			const value = values[i];
			if (value)
				result += value;
		}

		result = result.replaceAll(/[\t\n ]+/g, '');

		return result;
	};

	protected isLitElement(obj: any): obj is LitElement & {shadowRoot: ShadowRoot} {
		return obj instanceof LitElement && obj['shadowRoot'] instanceof ShadowRoot;
	}

	public async hostConnected(): Promise<void> {
		await this.host.updateComplete;

		const root = this.host.shadowRoot;
		root.adoptedStyleSheets.push(this.stylesheet);
	}

	public hostDisconnected(): void {
		const root = this.host.shadowRoot;
		const index = root.adoptedStyleSheets.indexOf(this.stylesheet);
		if (index > -1)
			root.adoptedStyleSheets.splice(index, 1);
	}

	public hostUpdate(): void {
		this.stylesheet.replaceSync(this.updateStyle(this.css));
	}

}
