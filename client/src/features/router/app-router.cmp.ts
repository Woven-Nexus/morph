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
						() => import('../../pages/studio/studio-page.cmp.js').then(m => m.StudioPageCmp),
					),
				},
				{
					path:   '/table',
					action: this.routeComponent(
						() => import('../../pages/table/table-page.cmp.js').then(m => m.TablePageCmp),
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
					path:   '/scroll',
					action: this.routeComponent(
						() => import('../../pages/scroll/scroll-page.cmp.js').then(m => m.Demopage),
					),
				},
				{
					path:   '/panel-test',
					action: this.routeComponent(
						() => import('../../pages/panel-test/panel-test-page.cmp.js').then(m => m.PanelTestPage),
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
