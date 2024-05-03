import { html } from '../../../utilities/template-tag.js';


export const modulesHead = () => html`
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Morph</title>

	<link rel="preconnect" href="https://rsms.me/">
	<link rel="stylesheet" href="https://rsms.me/inter/inter.css">

	<script type="module" src="https://unpkg.com/@roenlie/monaco-editor-wc@1.0.6/dist/monaco-editor-wc.js"></script>

	<link rel="stylesheet" href="/assets/index.css">
	<script type="module" src="/assets/void/void.js"></script>
	<script type="module" src="/modules/assets/module.js"></script>
</head>
`;
