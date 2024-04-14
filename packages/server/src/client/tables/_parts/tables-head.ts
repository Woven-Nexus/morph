import { html } from '../../../utilities/template-tag.js';


export const tablesHead = () => {
	return html`
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Tables</title>

	<link rel="preconnect" href="https://rsms.me/">
	<link rel="stylesheet" href="https://rsms.me/inter/inter.css">

	<link rel="stylesheet" href="https://unpkg.com/@roenlie/monaco-editor-wc@1.0.5/dist/style.css">
	<script defer src="https://unpkg.com/@roenlie/monaco-editor-wc@1.0.5/dist/monaco-editor-wc.js"></script>

	<link rel="stylesheet" href="/assets/index.css">
	<script type="module" src="/assets/void.js"></script>
	`;
};
