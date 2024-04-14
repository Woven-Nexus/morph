import { html } from '../../../utilities/template-tag.js';
import { type VoidElement, voidElement } from '../../assets/void-element.js';
import { loginForm } from './login-form.js';


export class LoginBody implements VoidElement {

	public tagName = 'm-login-body';
	public styleUrls = '/login/assets/login-body.css';
	public scriptUrls = '';
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

			${ loginForm() }
		</section>
		`;
	}

}


export const loginBody = voidElement(LoginBody);
