import { type RequestHandler, urlencoded } from 'express';

import { html } from '../../utilities/template-tag.js';
import { loginBody } from './_parts/body.js';
import { loginForm } from './_parts/form.js';
import { head } from './_parts/head.js';


export const get: RequestHandler[] = [
	async (req, res) => {
		res.send(await html`
		<!DOCTYPE html>
		<html lang="en" color-scheme="dark">
			<head>
				${ head() }
			</head>
			<body>
				${ loginBody() }
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
			return res.send(await loginForm({
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
