const parser = new DOMParser();


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


class MXGetEvent extends Event {

	constructor() {
		super('mx-get',
			{ bubbles: true, cancelable: false, composed: true });
	}

}


export class MorphElement extends HTMLElement {

	protected __mxListeners = new Listeners();
	protected __mxMutObserver = new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			mutation.addedNodes.forEach(node =>
				node instanceof Element && this.initElement(node));
		}
	});

	public connectedCallback() {
		if (!this.shadowRoot)
			throw new Error('Missing shadow root');

		this.__mxMutObserver.observe(this.shadowRoot,
			{ subtree: true, childList: true });

		this.shadowRoot.addEventListener('mx-get', this.handleMXGet);

		const elements = this.shadowRoot.querySelectorAll('*');
		for (const element of elements)
			this.initElement(element);
	}

	public disconnectedCallback() {
		this.__mxListeners.disconnect();
		this.__mxMutObserver.disconnect();
	}

	protected getMethod(element: Element) {
		const methods = [ 'get', 'post', 'put', 'patch', 'delete' ] as const;

		return methods.find((method) => element.hasAttribute('mx-' + method));
	}

	protected getTrigger(element: Element) {
		return (element.getAttribute('mx-trigger') ?? 'click') as
			'click' | 'load';
	}

	protected initElement(element: Element) {
		const method = this.getMethod(element);
		if (!method)
			return;

		switch (this.getTrigger(element)) {
		case 'click': {
			switch (method) {
			case 'get': {
				this.__mxListeners.add(element, 'click', (ev: Event) =>
					ev.currentTarget?.dispatchEvent(new MXGetEvent()));

				break;
			}
			}
			break;
		}
		case 'load': {
			switch (method) {
			case 'get': {
				element.dispatchEvent(new MXGetEvent());

				break;
			}
			}
			break;
		}
		}
	}

	protected handleMXGet = async (ev: MXGetEvent) => {
		const element = ev.target as Element;

		const url = element.getAttribute('mx-get') ?? '';
		if (!url)
			return;

		const target = element.getAttribute('mx-target') ?? 'host';

		ev.stopImmediatePropagation();

		const response = await (await fetch(url)).text();
		const parsed = parser.parseFromString(response, 'text/html', {
			includeShadowRoots: true,
		});

		const el = parsed.body.firstElementChild!;
		if (target === 'host') {
			this.replaceWith(el);
		}
		else {
			const targetEl = this.shadowRoot?.querySelector(target);
			targetEl?.replaceWith(el);
		}
	};

}
