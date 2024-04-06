const parser = new DOMParser();


export class Button extends HTMLElement {

	protected buttonEl: HTMLButtonElement;

	constructor() {
		super();
	}

	public connectedCallback() {
		this.buttonEl = this.shadowRoot!.querySelector<HTMLButtonElement>('button')!;
		this.buttonEl.addEventListener('click', this.handleClick);
	}

	public disconnectedCallback() {
		this.buttonEl.removeEventListener('click', this.handleClick);
	}

	protected handleClick = async () => {
		const requestUrl = this.buttonEl.getAttribute('mx-get')!;

		const response = await (await fetch(requestUrl)).text();
		const parsed = parser.parseFromString(response, 'text/html', {
			includeShadowRoots: true,
		});

		const el = parsed.body.firstElementChild!;
		this.replaceWith(el);
	};

}

customElements.define('m-button', Button);
