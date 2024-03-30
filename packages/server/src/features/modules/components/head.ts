import { html } from '../../../utilities/template-tag.js';


export const head = () => html`
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Morph</title>

	<link rel="preconnect" href="https://rsms.me/">
	<link rel="stylesheet" href="https://rsms.me/inter/inter.css">

	<script src="https://unpkg.com/htmx.org@1.9.11"></script>

	<link rel="stylesheet" href="https://unpkg.com/@roenlie/monaco-editor-wc@1.0.4/dist/style.css">
	<script defer src="https://unpkg.com/@roenlie/monaco-editor-wc@1.0.4/dist/monaco-editor-wc.js"></script>

	<script type="module" src="/assets/modules/htmx-ext.js"></script>
	<script type="module" src="/assets/modules/module.js"></script>

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
			width: 200px;
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
</head>
`;
