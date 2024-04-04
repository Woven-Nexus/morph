import type { RequestHandler } from 'express';

import { auth } from '../../features/auth/auth-middleware.js';
import { form } from '../../features/modules/components/form.js';
import { head } from '../../features/modules/components/head.js';
import { sidebar } from '../../features/modules/components/sidebar.js';
import { html } from '../../utilities/template-tag.js';


export const get: RequestHandler[] = [
	auth,
	async (req, res) => {
		const template = await html`
		<!DOCTYPE html>
		<html lang="en" color-scheme="dark">
		${ head() }
		<body>
			<aside>
				<button
					hx-get="/modules/new"
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
	},
];
