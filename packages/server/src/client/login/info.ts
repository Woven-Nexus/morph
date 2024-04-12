import { faker } from '@faker-js/faker';
import { type RequestHandler, urlencoded } from 'express';

import { html } from '../../utilities/template-tag.js';


export const post: RequestHandler[] = [
	urlencoded({ extended: false }),
	async (req, res) => {
		res.send(await html`
		<h1 void-id="title">${ faker.animal.bear() }</h1>
		<h3 void-id="greeting">${ faker.company.buzzPhrase() }</h3>
		`);
	},
];
