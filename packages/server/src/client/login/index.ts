import { type RequestHandler, urlencoded } from 'express';

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


export const post: RequestHandler[] = [
	urlencoded({ extended: false }),
	async (req, res) => {
		const { username, password } = req.body as {
			username: string;
			password: string;
		};

		//validation on email and password
		if (!username || !password) {
			return res.send(await body({
				username,
				validationErrors: [
					//
					'Missing username or password',
				],
			}));
		}

		console.log(username, password);
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


const body = (options: {
	username?: string;
	validationErrors?: string[];
} = {}) => {
	const {
		username,
		validationErrors,
	} = options;

	return template({
		name:     'main',
		template: html`
		<main id="main">
			<form
				id="login-form"
				hx-push-url="false"
				hx-target="#main"
				hx-swap="outerHTML"
			>
				<s-field>
					<label for="username">Username</label>
					<input
						id="username"
						name="username"
						value="${ username ?? '' }"
						required
					>
				</s-field>

				<s-field>
					<label for="password">Password</label>
					<input id="password" name="password" value="" required>
				</s-field>

				<button hx-post="/login" autofocus>
					Login
				</button>

				${ validationErrors && html`
				<s-error-messages>
					${ validationErrors.map(err => html`
						<s-error>
							${ err }
						</s-error>
					`) }
				</s-error-messages>
				` }
			</form>
		</main>
		`,
		style: css`
		#login-form {
			display: grid;
			grid-auto-rows: max-content;
			grid-template-columns: max-content 1fr;
			row-gap: 12px;

			s-field {
				all: unset;
				display: grid;
				grid-column: span 2;
				grid-template-columns: subgrid;
				column-gap: 8px;
			}
			s-error-messages {
				grid-column: span 2;
				display: grid;
				font-size: 10px;
				color: red;
			}
			button {
				grid-column: span 2;
			}
		}
		`,
	});
};
