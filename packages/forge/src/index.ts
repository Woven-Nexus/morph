import { AppRouterCmp } from '@roenlie/mimic-elements/router';
import { render } from 'lit';

import { routes } from './features/routes/routes.js';
import { initializeStyleTokens } from '@roenlie/mimic-elements/styles';

initializeStyleTokens();
AppRouterCmp.register();

const router = document.createElement(AppRouterCmp.tagName) as AppRouterCmp;
router.routes = routes;

render(router, document.body);
