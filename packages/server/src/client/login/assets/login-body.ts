import { html } from '../../../utilities/template-tag.js';
import { type VoidElement, voidElement } from '../../../utilities/void-element.js';
import { loginForm } from './login-form.js';


export class LoginBody implements VoidElement {

	public tagName = 'm-login-body';
	public styleUrl = '/login/assets/login-body.css';
	public scriptUrl = '';
	public render(): Promise<string> {
		return html`
		<section void-id="image-section">
			<img src="/login/assets/images/bird.png">
		</section>

		<section void-id="form-section">
			<h1 void-id="title">
				Morph
			</h1>
			<h3 void-id="greeting">
				Welcome to Morph
			</h3>

			${ loginForm({
				props: {
				},
			}) }
		</section>
		`;
	}

}


export const loginBody = voidElement(LoginBody);
