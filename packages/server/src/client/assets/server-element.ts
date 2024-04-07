// This is just for the server not getting angry when the element is used for generating the
!(globalThis as any).HTMLElement && ((globalThis as any).HTMLElement = class HTMLElement {});
!(globalThis as any).customElements && ((globalThis as any).customElements = { define: () => {} });


class _ServerElement<T extends Record<keyof any, any>> extends HTMLElement {

	public $__props: T;
	public static tagName = '';
	public static styleUrl = '';
	public static scriptUrl = '';
	public static updateUrl = '';

	public static async generate<M extends _ServerElement<any>>(
		this: new () => M,
		props: M['$__props'],
	): Promise<string> {
		const me = this as unknown as typeof _ServerElement<any>;
		const content = await me.render(props as any);

		return `
		<${ me.tagName }>
			<template shadowrootmode="open">
				${ content }
				<link rel="stylesheet" href="${ me.styleUrl }">
				<script type="module" src="${ me.scriptUrl }"></script>
				<script type="application/json" id="data">${
					JSON.stringify(props)
				}</script>
			</template>
		</${ me.tagName }>
		`;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public static render(props: Record<keyof any, any>): Promise<string> | string {
		return ``;
	}

	constructor() {
		super();

		const dataEl = this.shadowRoot!.getElementById('data') as HTMLScriptElement;
		this.data = JSON.parse(dataEl?.text ?? '{}');
	}

	public data: T;
	public updateEnqueued = false;

	public async requestUpdate() {
		const base = this.constructor as typeof _ServerElement<any>;

		if (!base.updateUrl)
			return;

		if (this.updateEnqueued)
			return;

		this.updateEnqueued = true;

		const response = await (await fetch(base.updateUrl, {
			method:  'POST',
			body:    JSON.stringify(this.data),
			headers: {
				'Content-Type': 'application/json',
			},
		})).text();

		const parsed = new DOMParser().parseFromString(
			response, 'text/html', {
				includeShadowRoots: true,
			},
		);

		const el = parsed.body.firstElementChild!;
		this.replaceWith(el);
	}

}

(globalThis as any).ServerElement = _ServerElement;


export default '';


declare global {
	class ServerElement<T extends Record<keyof any, any>> extends _ServerElement<T> {}
}
