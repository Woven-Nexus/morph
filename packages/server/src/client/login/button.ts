import type { RequestHandler } from 'express';

import { html } from '../../utilities/template-tag.js';


export const get: RequestHandler[] = [
	async (req, res) => {
		res.send(await button(Math.random() * 100));
	},
];


export const button = (index: number) => {
	return html`
	<m-button>
		<template shadowrootmode="open">
			<button mx-get="/login/button">
				${ index }
			</button>

			<link rel="stylesheet" href="/login/assets/parts/button.css">
			<script type="module" src="/login/assets/parts/button.cmp.ts"></script>
		</template>
	</m-button>
	`;
};
