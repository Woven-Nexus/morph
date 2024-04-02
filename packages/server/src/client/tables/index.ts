import type { RequestHandler } from 'express';

import { createModulesTable } from '../../features/modules/database/modules-table.js';
import { createOTPtable } from '../../features/otp/database/otp-table.js';
import { tableContents } from '../../features/tables/components/table-contents.js';
import { tableList } from '../../features/tables/components/table-list.js';
import { createUsersTable } from '../../features/user/database/user-table.js';
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

	<script src="https://unpkg.com/htmx.org@1.9.11"></script>
	<script src="https://unpkg.com/htmx.org@1.9.11/dist/ext/multi-swap.js"></script>

	<style>
		:root { font-family: Inter, sans-serif; }
		@supports (font-variation-settings: normal) {
			:root { font-family: InterVariable, sans-serif; }
		}
		body {
			height: 100svh;
			width: 100vw;
			padding: 0;
			margin: 0;
			color: white;
			background-color: rgb(30 30 30);

			display: grid;
			grid-template-columns: max-content 1fr;
			grid-template-rows: 1fr;
			grid-auto-rows: 0px;
		}
		ol, ul, li {
			all: unset;
			display: block;
		}
		aside {
			overflow: hidden;
			background-color: teal;
			width: fit-content;
			display: grid;
			grid-template-rows: max-content 1fr;
		}
		main {
			overflow: hidden;
			display: grid;
			grid-template-rows: 1fr;

			& > * {
				grid-row: 1/2;
				grid-column: 1/2;
			}
		}
	</style>
	`;
};


const body = () => {
	return template({
		name:     'main',
		template: html`
		<aside>
			${ tableList() }
		</aside>
		<main>
			${ tableContents() }
		</main>
		`,
		style: css`
		`,
	});
};
