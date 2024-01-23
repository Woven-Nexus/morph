import { AppRouterCmp } from '@roenlie/mimic-elements/router';
import { render } from 'lit';

import { routes } from './features/routes/routes.js';
import { initializeStyleTokens } from '@roenlie/mimic-elements/styles';
import type { Router } from '@vaadin/router';

initializeStyleTokens();
AppRouterCmp.register();

const routerEl = document.createElement(AppRouterCmp.tagName) as AppRouterCmp;
routerEl.routes = routes;

Object.assign(window, {
	router: (routerEl as any).router,
});

declare global {
	// biome-ignore lint/style/noVar: <explanation>
	// biome-ignore lint/suspicious/noRedeclare: <explanation>
	var router: Router;
}



render(routerEl, document.body);
