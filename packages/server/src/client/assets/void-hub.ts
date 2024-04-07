const voidCache = new Map<string, WeakRef<HTMLElement>>();


globalThis.addEventListener('void-connect', (_ev: Event) => {
	const ev = _ev as CustomEvent<string>;
	const tagName = ev.detail;

	//if (!customElements.get(tagName)) {
	//	customElements.define(tagName, class extends VoidElement {});
	//}
});


// eslint-disable-next-line @typescript-eslint/no-unused-vars
class VoidElement extends HTMLElement {

	constructor() {
		super();

		console.log('a void element has been registered and constructed');
	}

}

class VoidInitializer extends HTMLElement {

	protected static sheet = (() => {
		const sheet = new CSSStyleSheet();
		sheet.replaceSync(`:host{display:none;}`);

		return sheet;
	})();

	constructor() {
		super();

		const root = this.attachShadow({ mode: 'open' });
		root.adoptedStyleSheets = [ VoidInitializer.sheet ];
	}

	public connectedCallback() {
		const root = this.getHostRoot();
		if (!root)
			return;

		this.syncElements(root);
		console.log(voidCache);
	}

	protected getHostRoot() {
		let el: Node | undefined = this.shadowRoot?.host;
		while (!(el instanceof ShadowRoot) && el)
			el = el?.parentNode ?? undefined;

		return el;
	}

	protected invalidElements = [ HTMLScriptElement, HTMLLinkElement, VoidInitializer ];
	protected syncElements(root: ShadowRoot) {
		const elements = [ ...root.querySelectorAll('*') ]
			.filter((node): node is HTMLElement => node instanceof HTMLElement
				&& !this.invalidElements.some(el => node instanceof el));

		elements.forEach(el => {
			const id = el.getAttribute('void-id');
			id && this.addToCache(id, el);
		});

		console.log(elements);
	}

	protected addToCache(id: string, element: HTMLElement) {
		const reference = voidCache.get(id);
		const value = reference?.deref();
		if (value)
			throw new Error('Duplicate void-id: ' + id);

		voidCache.set(id, new WeakRef(element));
	}

}
customElements.define('void-initializer', VoidInitializer);
