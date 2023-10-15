import { customElement, MimicElement } from '@roenlie/mimic-lit/element';
import { type Context, type Route, Router } from '@vaadin/router';
import { css } from 'lit';


@customElement('m-app-router')
export class AppRouterCmp extends MimicElement {

	protected router = new Router();
	protected routes: Route[] = [
		{
			name:   'root',
			path:   '/',
			action: this.routeComponent(
				() => import('../layout/layout.cmp.js').then(m => m.AppLayoutCmp),
			),
			children: [
				{ path: '/', redirect: '/studio' },
				{
					path:   '/studio',
					action: this.routeComponent(
						() => import('../studio/studio-page.cmp.js').then(m => m.StudioPageCmp),
					),
				},
				{
					path:   '/studio2',
					action: this.routeComponent(
						() => import('../../pages/studio2/studio-page.cmp.js').then(m => m.StudioPageCmp),
					),
				},
				{
					path:     '/betrayal',
					children: [
						{
							path:   '/game',
							action: this.routeComponent(
								() => import('../../pages/betrayal/game/game-page.cmp.js').then(m => m.BetrayalGamePage),
							),
						},
					],
				},
				{
					path:   '/demo',
					action: this.routeComponent(
						() => import('../demo/demo-page.cmp.js').then(m => m.Demopage),
					),
				},
			],
		},
	];

	public override connectedCallback(): void {
		super.connectedCallback();

		this.router.setOutlet(this.shadowRoot);
		this.router.setRoutes(this.routes);
	}

	protected routeComponent<T extends() => Promise<typeof MimicElement>>(importFn: T) {
		return async (context: Context) => {
			const cmp = await importFn();
			context.route.component = cmp.tagName;
			cmp.register();
		};
	}

	public static override styles = [
		css`
		:host {
			display: contents;
		}
		`,
	];

}
