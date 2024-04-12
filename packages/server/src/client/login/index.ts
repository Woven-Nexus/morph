import { type RequestHandler, urlencoded } from 'express';

import { html } from '../../utilities/template-tag.js';
import { head } from './_parts/head.js';
import { loginBody } from './assets/login-body.js';
import { loginForm } from './assets/login-form.js';


export const get: RequestHandler[] = [
	async (req, res) => {
		res.send(await html`
		<!DOCTYPE html>
		<html lang="en" color-scheme="dark">
			<head>
				${ head() }
			</head>
			<body>
				${ loginBody({}) }
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
				props: {
					username,
					validationErrors: [
					//
						'Missing username or password',
					],
				},
			}));
		}

		console.log(username, password);
	},
];
