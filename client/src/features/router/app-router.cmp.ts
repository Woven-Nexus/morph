import { customElement, MimicElement } from '@roenlie/mimic-lit/element';
import { type Route, Router } from '@vaadin/router';
import { css } from 'lit';


@customElement('m-app-router')
export class AppRouterCmp extends MimicElement {

	protected router = new Router();
	protected routes: Route[] = [
		{
			name:   'root',
			path:   '/',
			action: async (ctx) => {
				const cmp = (await import('../layout/layout.cmp.js')).AppLayoutCmp;
				ctx.route.component = cmp.tagName;
				cmp.register();
			},
			children: [
				{ path: '/', redirect: '/studio' },
				{
					path:      '/studio',
					component: '',
					action:    async (ctx) => {
						const cmp = (await import('../studio/studio-page.cmp.js')).StudioPageCmp;
						ctx.route.component = cmp.tagName;
						cmp.register();
					},
				},
			],
		},
	];

	public override connectedCallback(): void {
		super.connectedCallback();

		this.router.setOutlet(this.shadowRoot);
		this.router.setRoutes(this.routes);
	}

	public static override styles = [
		css`
		:host {
			display: contents;
		}
		`,
	];

}
