import type { RequestHandler } from 'express';

import { Module } from '../../../models/modules-model.js';
import { html } from '../../utilities/template-tag.js';
import { modulesForm } from './_parts/modules-form.js';
import { modulesSidebar } from './_parts/modules-sidebar.js';


export const get: RequestHandler[] = [
	async (req, res) => {
		const module = Module.initialize({
			active:      0,
			code:        '',
			description: '',
			name:        '',
			namespace:   '',
		});

		res.send(await html`
		${ modulesSidebar({
			attrs: { 'void-id': 'modules-sidebar' },
			props: { module },
		}) }
		${ modulesForm({
			attrs: { 'void-id': 'modules-form' },
			props: { module },
		}) }
		`);
	},
];
