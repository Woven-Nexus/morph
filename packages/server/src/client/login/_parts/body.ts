import { html } from '../../../utilities/template-tag.js';
import { CounterElement } from '../assets/parts/server-button.js';
import { button } from '../button.js';
import { loginForm } from './form.js';


export interface BodyOptions {
	username?: string;
	validationErrors?: string[];
}


export const loginBody = (options: BodyOptions = {}) => {
	return html`
	<m-login-body id="login">
		<template shadowrootmode="open">
			<section id="image-section">
				<img src="/login/assets/images/bird.png">
			</section>

			<section id="form-section">
				<h1>
					Morph
				</h1>
				<h3>
					Welcome to Morph
				</h3>
				${ CounterElement.generate({ count: 5 }) }
			</section>

			<link rel="stylesheet" href="/login/assets/parts/login-body.css">
			<script type="module" src="/login/assets/parts/login-body.ts"></script>
		</template>
	</m-login-body>
	`;
};
