import type { RequestHandler } from 'express';

import { template } from '../../utilities/template.js';
import { css, html } from '../../utilities/template-tag.js';


export const get: RequestHandler[] = [
	async (req, res) => {
		res.send(await html`
		<!DOCTYPE html>
		<html lang="en" color-scheme="dark">
			<head>
				${ head() }
			</head>
			<body hx-boost="true" hx-ext="multi-swap">
				${ body() }
			</body>
		</html>
		`);
	},
];


const head = () => {
	return html`
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Tables</title>

	<link rel="preconnect" href="https://rsms.me/">
	<link rel="stylesheet" href="https://rsms.me/inter/inter.css">
	<link rel="stylesheet" href="/assets/index.css"></link>

	<script src="https://unpkg.com/htmx.org@1.9.11"></script>
	<script src="https://unpkg.com/htmx.org@1.9.11/dist/ext/multi-swap.js"></script>
	`;
};


const body = () => {
	return template({
		name:     'main',
		template: html`
		<main>
			<form id="login-form">
				<label>
					<span>
						Username
					</span>
					<input value="">
				</label>
				<label>
					<span>
						Password
					</span>
					<input value="">
				</label>

				<button>
					Login
				</button>
			</form>
		</main>
		`,
		style: css`
		#login-form {
			display: grid;
			grid-auto-rows: max-content;
			grid-template-columns: max-content 1fr;
			row-gap: 12px;

			label {
				display: grid;
				grid-column: span 2;
				grid-template-columns: subgrid;
				column-gap: 8px;
			}
			button {
				grid-column: span 2;
			}
		}
		`,
	});
};
