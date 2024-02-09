import { AppRouterCmp } from '@roenlie/mimic-elements/router';
import type { Route } from '@vaadin/router';
import { LayoutPageCmp } from '../../pages/layout.cmp.js';

// We cache the layout, as we don't want to reinitialize it.
let layoutCmp: HTMLElement | undefined = undefined;

export const routes: Route[] = [
	{
		name: 'layout',
		path: '/',
		action: async () => {
			if (layoutCmp) return layoutCmp;

			(await import('../../pages/layout.cmp.js')).LayoutPageCmp.register();
			layoutCmp = document.createElement(LayoutPageCmp.tagName);

			return layoutCmp;
		},
		children: [
			{ path: '', redirect: '/editor' },
			{
				name: 'editor',
				path: '/editor',
				action: AppRouterCmp.routeComponent(
					() => import('../../pages/editor.cmp.js'),
				),
			},
			{
				name: 'settings',
				path: '/settings',
				action: AppRouterCmp.routeComponent(
					() => import('../../pages/settings.cmp.js'),
				),
			},
		],
	},
];