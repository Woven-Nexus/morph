declare global {
	interface WindowEventMap {
		'void-load': CustomEvent<{element: HTMLElement; host: HTMLElement;}>;
		'void-get': CustomEvent<{element: HTMLElement; host: HTMLElement;}>;
		'void-form-post': CustomEvent<{
			element: HTMLFormElement;
			host: HTMLElement;
			submitter: HTMLElement;
		}>;
	}
}


const parser = new DOMParser();
const voidCache = new Map<string, WeakRef<HTMLElement>>();

const cacheGet = (id: string | null | undefined) => {
	if (!id)
		return;

	const ref = voidCache.get(id);

	return ref?.deref();
};

globalThis.addEventListener('void-load', async ev => {
	const source = ev.detail;
	console.log({ type: 'load', source });
});

globalThis.addEventListener('void-get', async ev => {
	const { element, host } = ev.detail;
	const url = element.getAttribute('void-get')!;

	const response = await (await fetch(url)).text();
	const parsed = parser.parseFromString(response, 'text/html', {
		includeShadowRoots: true,
	});

	const newElement = parsed.body.firstElementChild!;

	let targetEl = element;
	let targetId = element.getAttribute('void-target');
	if (targetId) {
		if (targetId === 'host')
			targetEl = host;

		if (targetId.startsWith('#')) {
			targetId = targetId.slice(1);

			const ref = cacheGet(targetId);
			if (ref) {
				voidCache.delete(targetId);
				targetEl = ref;
			}
		}
	}

	targetEl.replaceWith(newElement);
});

globalThis.addEventListener('void-form-post', async ev => {
	ev.preventDefault();

	const { element, host, submitter } = ev.detail;

	console.log({ element, host, submitter });
});


class Listeners {

	protected cache: [ target: Element, event: string, fn: EventListener ][] = [];

	public add(target: Element, event: string, fn: EventListener) {
		target.addEventListener(event, fn);
		this.cache.push([ target, event, fn ]);
	}

	public disconnect() {
		for (const [ t, e, f ] of this.cache)
			t.removeEventListener(e, f);

		this.cache.length = 0;
	}

}


class VoidInitializer extends HTMLElement {

	protected static invalidElements: typeof HTMLElement[] = [
		HTMLScriptElement,
		HTMLLinkElement,
		VoidInitializer,
	];

	protected static sheet = (() => {
		const sheet = new CSSStyleSheet();
		sheet.replaceSync(`:host{display:none;}`);

		return sheet;
	})();

	protected listeners = new Listeners();
	protected parentHost: HTMLElement;
	protected parentRoot: ShadowRoot;

	constructor() {
		super();

		const root = this.attachShadow({ mode: 'open' });
		root.adoptedStyleSheets = [ VoidInitializer.sheet ];
	}

	public connectedCallback() {
		let root: Node | undefined = this.shadowRoot?.host;
		while (!(root instanceof ShadowRoot) && root)
			root = root?.parentNode ?? undefined;

		if (!root)
			throw new Error('No parent root available');

		this.parentRoot = root;
		this.parentHost = root.host as HTMLElement;

		this.syncElements(this.parentRoot);
	}

	public disconnectedCallback() {
		this.listeners.disconnect();
	}

	protected getElementForm(el: HTMLElement) {
		const host = this.parentHost;

		return ('form' in el ? el.form
			: 'form' in host ? host.form
				: undefined) as HTMLFormElement | undefined;
	}

	protected syncElements(root: ShadowRoot) {
		for (const element of root.querySelectorAll('*')) {
			const isHTMLElement = element instanceof HTMLElement;
			const isValid = !VoidInitializer.invalidElements.some(el => element instanceof el);
			if (isHTMLElement && isValid)
				this.parseElement(element);
		}
	}

	protected addToCache(id: string, element: HTMLElement) {
		voidCache.set(id, new WeakRef(element));
	}

	protected parseElement(el: HTMLElement) {
		const id = el.getAttribute('void-id');
		id && this.addToCache(id, el);

		this.evalClickHandler(el);
		this.evalLoadHandler(el);
		this.evalFormHandler(el);
	}

	protected methods = [ 'get', 'post', 'put', 'patch', 'delete' ] as const;
	protected getMethod(el: HTMLElement) {
		return this.methods.find(method => el.hasAttribute('void-' + method));
	}

	protected evalClickHandler(el: HTMLElement) {
		const method = this.getMethod(el);
		if (!method)
			return;

		const trigger = el.getAttribute('void-trigger') ?? 'click';
		if (trigger !== 'click')
			return;

		const form = this.getElementForm(el);
		if (form)
			return;

		this.listeners.add(el, 'click', ev => {
			ev.preventDefault();

			const detail: any = {
				element: el,
				host:    this.parentHost,
			};

			const event = new CustomEvent('void-' + method, { detail });
			window.dispatchEvent(event);
		});
	}

	protected evalLoadHandler(el: HTMLElement) {
		const method = this.getMethod(el);
		if (!method)
			return;

		const trigger = el.getAttribute('void-trigger');
		if (trigger !== 'load')
			return;

		const detail: any = {
			element: el,
			host:    this.parentHost,
		};

		const event = new CustomEvent('void-load', { detail });
		window.dispatchEvent(event);
	}

	protected evalFormHandler(el: HTMLElement) {
		if (!(el instanceof HTMLFormElement))
			return;
		if (!el.hasAttribute('void-boosted'))
			return;

		el.addEventListener('submit', (ev) => {
			ev.preventDefault();

			const submitter = ev.submitter!;
			const method = this.getMethod(submitter) ?? this.getMethod(el);
			const detail: any = {
				element: el,
				host:    this.parentHost,
				submitter,
			};

			const event = new CustomEvent('void-form-' + method, { detail });
			window.dispatchEvent(event);
		});
	}

}
customElements.define('void-initializer', VoidInitializer);


export default '';
