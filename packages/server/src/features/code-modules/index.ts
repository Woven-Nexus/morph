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
		<script type="module" src="/module.js"></script>
		<script type="module" src="/monaco/index.js"></script>
		<script type="module" src="/register-style.js"></script>

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
			main {
				display: grid;
				grid-template-rows: max-content 1fr;
			}
		</style>
	</head>
	<body>
		${ sidebar() }
		<main>
			<script type="module">
				module.define('editor', () => {
					const save = () => {
						const editor = document.querySelector('monaco-editor');
						console.log(editor)
						console.log('saving');
					}

					module.export('save', save);
				});
			</script>

			<s-content>
				<monaco-editor placeholder="no file selected"></monaco-editor>
			</s-content>
		</main>
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

	return template({
		tag:      's-sidebar',
		template: html`
			<ol>
				${ modules.map(module => html`
				<li>
					<button
						hx-get="/api/code-modules/${ module.namespace }/${ module.module_id }"
						hx-target="s-content"
						hx-swap="outerHTML"
					>
						${ module.name }
					</button>
				</li>
				`) }
			</ol>
		`,
		style: css`
			s-sidebar {
				display: block;
				background-color: teal;
				width: 200px;
			}
		`,
	});
};


export const content = async (code: string) => {
	return template({
		tag:      's-content',
		template: html`
			<button>
				Save
			</button>
			<monaco-editor
				code="${ code }"
				language="typescript"
			></monaco-editor>
		`,
		style: css`
			s-content {
				display: contents;
			}
		`,
		// Make this use esbuild internally to strip typescript types out.
		script: () => {
			const save = module.import('editor', 'save');
			const button = document.querySelector('s-content button');
			button?.addEventListener('click', () => save());
		},
		immediate: true,
	});
};
