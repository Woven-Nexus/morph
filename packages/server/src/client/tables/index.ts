import type { RequestHandler } from 'express';

import { auth } from '../../features/auth/auth-middleware.js';
import { html } from '../../utilities/template-tag.js';
import { tablesBody } from './_parts/tables-body.js';
import { tablesHead } from './_parts/tables-head.js';


export const get: RequestHandler[] = [
	//auth,
	async (req, res) => {
		res.send(await html`
		<!DOCTYPE html>
		<html lang="en" color-scheme="dark">
			<head>
				${ tablesHead() }
			</head>
			<body>
				${ tablesBody() }
			</body>
		</html>
		`);
	},
];
