import { AppRouterCmp } from '@roenlie/mimic-elements/router';
import { initializeStyleTokens } from '@roenlie/mimic-elements/styles';
import type { Router } from '@vaadin/router';
import { render } from 'lit';

import { routes } from './features/routes/routes.js';


initializeStyleTokens();
AppRouterCmp.register();

const routerEl = document.createElement(AppRouterCmp.tagName) as AppRouterCmp;
routerEl.routes = routes;

Object.assign(window, {
	router: (routerEl as any).router,
});

declare global {
	// eslint-disable-next-line no-var
	var router: Router;
}


render(routerEl, document.body);
