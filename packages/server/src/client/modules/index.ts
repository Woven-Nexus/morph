import type { RequestHandler } from 'express';

import { auth } from '../../features/auth/auth-middleware.js';
import { html } from '../../utilities/template-tag.js';
import { modulesBody } from './_parts/modules-body.js';
import { modulesHead } from './_parts/modules-head.js';


export const get: RequestHandler[] = [
	//auth,
	async (req, res) => {
		const template = await html`
		<!DOCTYPE html>
		<html lang="en" color-scheme="dark">
		${ modulesHead() }
		<body>
			${ modulesBody() }
		</body>
		</html>
		`;

		res.send(template);
	},
];
