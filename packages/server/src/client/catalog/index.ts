/* eslint-disable lit/attribute-value-entities */
import { type RequestHandler } from 'express';

import { html } from '../../utilities/template-tag.js';


export const get: RequestHandler[] = [
	async (req, res) => {
		res.send(await html`
		<!DOCTYPE html>
		<html lang="en" color-scheme="dark">
			<head>
			<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Tables</title>

				<link rel="preconnect" href="https://fonts.googleapis.com">
				<link rel="preconnect" href="https://fonts.gstatic.com">
				<link href="https://fonts.googleapis.com/css2?family=Tilt+Neon&display=swap" rel="stylesheet">

				<link rel="preconnect" href="https://rsms.me/">
				<link rel="stylesheet" href="https://rsms.me/inter/inter.css">

				<link rel="stylesheet" href="/assets/index.css"></link>
				<script type="module" src="/catalog/assets/components/root.cmp.ts"></script>
			</head>
			<body>
				<m-root></m-root>
			</body>
		</html>
		`);
	},
];
