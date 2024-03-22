/* eslint-disable lit/binding-positions */
import { css, html, template } from '../../utilities/template-tag.js';
import { Query } from '../db-utils/query.js';
import type { Module } from './modules-table.js';
import router from './router.js';


router.get('/', async (req, res) => {
	const template = await html`
	<!DOCTYPE html>
	<html lang="en" color-scheme="dark">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Forge</title>

		<link rel="preconnect" href="https://rsms.me/">
		<link rel="stylesheet" href="https://rsms.me/inter/inter.css">
		<link rel="stylesheet" href="/monaco/style.css">

		<script src="https://unpkg.com/htmx.org@1.9.11"></script>
		<script type="module" src="/monaco/index.js"></script>
		<script type="module">
			window.registerStyle = (id, tag, style) => {
				if (document.head.querySelector('#' + tag))
					return document.getElementById(id).remove();

				const styleEl = document.createElement('style');
				styleEl.id = tag;
				styleEl.innerHTML = style
				document.head.appendChild(styleEl);

				document.getElementById(id).remove();
			}
		</script>

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
			#content {
				display: grid;
			}
		</style>
	</head>
	<body>
		${ sidebar() }
		<div id="content">
			<monaco-editor placeholder="no file selected"></monaco-editor>
		</div>
	</body>
	</html>
	`;

	res.send(template);
});


const sidebar = async () => {
	const query = new Query('./database/main.db');
	const results = query
		.get<Module>('modules')
		.orderBy('active', 'asc')
		.orderBy('name', 'asc')
		.query();

	const modules: Module[] = [];
	results.forEach(res => modules.push(res.item));

	return template('s-sidebar', html`
	<ol>
		${ modules.map(module => html`
		<li>
			<button
				hx-get="/api/code-modules/${ module.namespace }/${ module.module_id }"
				hx-target="#content"
			>
				${ module.name }
			</button>
		</li>
		`) }
	</ol>
	`, css`
		s-sidebar {
			display: block;
			background-color: teal;
			width: 200px;
		}
	`);
};


export const content = async (code: string) => {
	return template('s-content', html`
	<monaco-editor code="${ code }" language="typescript"></monaco-editor>
	`, css`
	s-content {
		display: contents;
	}
	`);
};


const button = () => {
	return template('s-button', html`
		<button>
			CLICK ME!?
		</button>
	`, css`
		s-button {
			width: 100px;
			height: 100px;
			color: green;
			background-color: hotpink;
			font-size: 24px;

			button {
				all: unset;
			}
		}
	`);
};
