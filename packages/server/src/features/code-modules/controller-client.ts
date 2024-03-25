import { template } from '../../utilities/template.js';
import { css, html } from '../../utilities/template-tag.js';
import { Query } from '../db-utils/query.js';
import type { Module } from './db-actions/modules-create-table.js';
import { clientCtrlCodeModules } from './router.js';


export default clientCtrlCodeModules;


clientCtrlCodeModules.get('/', async (req, res) => {
	const template = await html`
	<!DOCTYPE html>
	<html lang="en" color-scheme="dark">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Forge</title>

		<link rel="preconnect" href="https://rsms.me/">
		<link rel="stylesheet" href="https://rsms.me/inter/inter.css">
		<link rel="stylesheet" href="/assets/code-modules/monaco/style.css">

		<script src="https://unpkg.com/htmx.org@1.9.11"></script>

		<script type="module" src="/assets/code-modules/htmx-ext.js"></script>
		<script type="module" src="/assets/code-modules/module.js"></script>
		<script type="module" src="/assets/code-modules/monaco/index.js"></script>
		<script type="module" src="/assets/code-modules/register-style.js"></script>

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
				overflow: hidden;
				display: grid;
				grid-template-rows: 1fr;
			}
		</style>
	</head>
	<body>
		${ sidebar() }
		<main>
			<span style="place-self:center;">Select file to start editing.</span>
		</main>
	</body>
	</html>
	`;

	res.send(template);
});


clientCtrlCodeModules.get(`/:namespace/:id`, async (req, res) => {
	const params = req.params;

	const query = new Query('./database/main.db');
	const results = query
		.from<Module>('modules')
		.where(filter => filter.and(
			filter.eq('module_id', params.id),
		))
		.limit(1)
		.orderBy('active', 'asc')
		.orderBy('name', 'asc')
		.query();

	const modules: Module[] = [];
	results.forEach(res => modules.push(res.item));

	res.send(await content(modules.at(0)!));
});


const sidebar = async () => {
	const query = new Query('./database/main.db');
	const results = query
		.from<Module>('modules')
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
						hx-get="/clientapi/code-modules/${ module.namespace }/${ module.module_id }"
						hx-target="main"
						hx-swap="innerHTML"
					>
						${ module.name }
					</button>
				</li>
				`) }
			</ol>
		`,
		style: css`
			s-sidebar {
				overflow: hidden;
				display: grid;
				background-color: teal;
				width: 200px;
			}
			ol {
				all: unset;
				display: block;
				overflow: hidden;
				overflow-y: auto;
				padding-inline-start: 24px;
				padding-block: 24px;
			}
		`,
	});
};


const content = async (module: Module) => {
	return template({
		tag:      's-content',
		template: html`
			<form
				hx-boost="true"
				action="/api/code-modules/save"
				method="post"
				hx-swap="none"
				hx-push-url="false"
			>
				<div>
					<input
						id="module_id"
						name="module_id"
						style="display: none;"
						value="${ module.module_id ?? '' }"
					>

					<label>
						<span>namespace</span>
						<input id="namespace" name="namespace" value="${ module.namespace }">
					</label>
					<label>
						<span>name</span>
						<input id="name" name="name" value="${ module.name }">
					</label>
					<label>
						<span>description</span>
						<input id="description" name="description" value="${ module.description }">
					</label>
					<label>
						<span>active</span>
						<input
							id="active"
							name="active"
							type="checkbox"
							${ module.active ? 'checked' : '' }
							value="${ module.active }"
						>
					</label>
				</div>

				<button>
					Save
				</button>

				<monaco-editor
					id="code"
					name="code"
					value="${ module.code }"
					language="typescript"
				></monaco-editor>
			</form>
		`,
		style: css`
			s-content {
				display: contents;
			}
			form {
				display: grid;
				grid-template-rows: max-content max-content 1fr;
			}
		`,
		script:    () => {},
		immediate: true,
	});
};
