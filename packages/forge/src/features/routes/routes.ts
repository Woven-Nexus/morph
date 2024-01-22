import { AppRouterCmp } from '@roenlie/mimic-elements/router';
import type { Route } from '@vaadin/router';

export const routes: Route[] = [
	{
		name: 'editor',
		path: '/',
		action: AppRouterCmp.routeComponent(
			() => import('../../pages/editor.cmp.js'),
		),
	},
];
