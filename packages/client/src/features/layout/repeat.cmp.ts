export class Repeat extends HTMLElement {

	public from: any[];
	public as: { value?: any; };

	constructor() {
		super();

		this.attachShadow({ mode: 'open' });

		const styles = new CSSStyleSheet();
		styles.replaceSync(`
			:host {
				display: contents;
			}
		`);

		this.shadowRoot!.adoptedStyleSheets = [ styles ];
		this.shadowRoot?.appendChild(document.createElement('slot'));
	}

	public connectedCallback() {
		console.log({
			from: this.from,
			as:   this.as,
		});

		console.log('HTML5Element connectedCallback');

		const el = this.children[0]!;

		this.from.forEach(from => {
			this.as.value = from;
			this.shadowRoot?.appendChild(el.cloneNode(true));
		});

		//this.as.value = undefined;
	}

}

customElements.define('x-repeat', Repeat);
