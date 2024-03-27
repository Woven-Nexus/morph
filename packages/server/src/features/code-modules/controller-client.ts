import bodyParser from 'body-parser';

import { template } from '../../utilities/template.js';
import { css, html } from '../../utilities/template-tag.js';
import { Query } from '../db-utils/query.js';
import { deleteModule, getByNamespaceAndID, updateModule } from './db-actions/modules-behavior.js';
import type { Module } from './db-actions/modules-create-table.js';
import { clientCtrlCodeModules as router } from './router.js';


export default router;


const head = () => html`
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Morph</title>

	<link rel="preconnect" href="https://rsms.me/">
	<link rel="stylesheet" href="https://rsms.me/inter/inter.css">

	<script src="https://unpkg.com/htmx.org@1.9.11"></script>

	<link rel="stylesheet" href="https://unpkg.com/@roenlie/monaco-editor-wc@1.0.4/dist/style.css">
	<script async src="https://unpkg.com/@roenlie/monaco-editor-wc@1.0.4/dist/monaco-editor-wc.js"></script>

	<script type="module" src="/assets/code-modules/htmx-ext.js"></script>
	<script type="module" src="/assets/code-modules/module.js"></script>
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
		aside {
			overflow: hidden;
			background-color: teal;
			width: 200px;
			display: grid;
			grid-template-rows: max-content 1fr;
		}
		main {
			overflow: hidden;
			display: grid;
			grid-template-rows: 1fr;

			& >* {
				grid-row: 1/2;
				grid-column: 1/2;
			}
		}
	</style>
</head>
`;


router.get('/', async (req, res) => {
	const template = await html`
	<!DOCTYPE html>
	<html lang="en" color-scheme="dark">
	${ head() }
	<body>
		<aside>
			<button
				hx-get="/clientapi/code-modules/new"
				hx-target="main"
				hx-swap="innerHTML"
			>
				New
			</button>
			${ sidebar() }
		</aside>
		<main>
			${ form() }
		</main>
	</body>
	</html>
	`;

	res.send(template);
});


router.get('/new', async (req, res) => {
	const module: Module = {
		active:      1,
		code:        '',
		description: '',
		name:        '',
		namespace:   '',
		module_id:   '',
	};

	res.send(await html`
	${ sidebar(module) }
	${ form(module) }
	`);
});


router.get(`/:namespace/:id`, async (req, res) => {
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

	res.send(await html`
	${ sidebar(modules.at(0)!) }
	${ form(modules.at(0)!) }
	`);
});


const sidebar = async (module?: Module) => {
	const query = new Query('./database/main.db');
	const results = query
		.from<Module>('modules')
		.orderBy('active', 'asc')
		.orderBy('name', 'asc')
		.query();

	const modules: Module[] = [];
	results.forEach(res => modules.push(res.item));

	return template({
		name:     'sidebar',
		template: html`
		<ol id="module-list" hx-swap-oob="true">
			${ modules.map(mod => html`
			<li class="${ mod.module_id === module?.module_id ? 'active' : '' }">
				<button
					hx-get="/clientapi/code-modules/${ mod.namespace }/${ mod.module_id }"
					hx-target="main"
					hx-swap="innerHTML"
				>
					${ mod.name }
				</button>
			</li>
			`) }
		</ol>
		`,
		style: css`
			ol {
				all: unset;
				display: block;
				overflow: hidden;
				overflow-y: auto;
				padding-inline-start: 24px;
				padding-block: 24px;
			}
			li {
				all: unset;
				display: block;
			}
			li.active {
				background-color: hotpink;
				outline: 2px dotted red;
				outline-offset: -2px;
			}
		`,
	});
};


const form = async (module?: Module) => {
	const fields: {
		key: keyof Module;
		hidden?: true;
		type: 'input' | 'checkbox'
	}[] = [
		{ key: 'module_id', type: 'input', hidden: true },
		{ key: 'namespace', type: 'input' },
		{ key: 'name', type: 'input' },
		{ key: 'description', type: 'input' },
		{ key: 'active', type: 'checkbox' },
	];

	return template({
		name:     'form',
		template: module ? html`
		<form
			hx-boost="true"
			method="post"
			hx-push-url="false"
			hx-target="main"
			hx-swap="innerHTML"
		>
			<div class="inputs">
				${ fields.map(field => html`
				<label style=${ field.hidden ? 'display:none;' : '' }>
					<span>${ field.key }</span>
					${ field.type === 'input' ? html`
					<input
						name="${ field.key }"
						value="${ module[field.key] ?? '' }"
					>
					` : html`
					<input
						name="${ field.key }"
						type="checkbox"
						${ module[field.key] ? 'checked' : '' }
						value="${ module[field.key] ?? '' }"
					>
					` }
				</label>
				`) }
			</div>

			<div class="actions">
				${ module.module_id ? html`
				<button formaction="/clientapi/code-modules/save">
					Save
				</button>

				<button formaction="/clientapi/code-modules/delete" formmethod="delete">
					Delete
				</button>
				` : html`
				<button formaction="/clientapi/code-modules/insert">
					Insert
				</button>
				` }
			</div>

			<monaco-editor
				id="code"
				name="code"
				value="${ module.code }"
				language="typescript"
			></monaco-editor>
		</form>
		` : html`
		<span style="place-self:center;">Select file to start editing.</span>
		`,
		style: css`
			form {
				display: grid;
				grid-template-columns: 1fr max-content;
				grid-template-rows: max-content 1fr;
				row-gap: 8px;
			}
			.inputs {
				padding-left: 24px;
				display: grid;
				gap: 8px;
    			grid-template-columns: max-content 1fr;

				& label {
					grid-column: span 2;
					display: grid;
					grid-template-columns: subgrid;
					align-items: center;
				}

				[type="checkbox"] {
					justify-self: start;
				}

			}
			.actions {
				padding-inline: 24px;
			}
			.inputs, .actions {
				padding-top: 24px;
				padding-bottom: 8px;
				border-bottom: 2px solid white;
			}
			monaco-editor {
				grid-column: span 2;
			}
		`,
		script:    () => {},
		immediate: true,
	});
};


const urlencodedParser = bodyParser.urlencoded({ extended: false });
router.post('/save', urlencodedParser, async (req, res) => {
	const module = req.body as Module;

	// In a form, a checkbox value is not sent if it is unchecked.
	// therefor we need to check if active is included or not.
	module.active = !('active' in module) ? 0 : 1;

	updateModule(module);
	const modules = getByNamespaceAndID(module.namespace, module.module_id ?? '');

	res.send(await html`
	${ sidebar(modules.at(0)!) }
	${ form(modules.at(0)!) }
	`);
});


router.delete('/delete', urlencodedParser, async (req, res) => {
	const module = req.body as Module;

	deleteModule(module);

	res.send(await html`
	${ sidebar() }
	${ form() }
	`);
});
