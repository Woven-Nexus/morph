import { html } from '../../../../utilities/template-tag.js';
import { type VoidElement, voidElement } from '../../../../utilities/void-element.js';
import { voidButton } from '../../button.js';


export class LoginBody implements VoidElement {

	public tagName = 'm-login-body';
	public styleUrl = '/login/assets/dec/login-body.css';
	public scriptUrl = '';
	public render(props: unknown): Promise<string> {
		return html`
		<section void-id="image-section">
			<img src="/login/assets/images/bird.png">
		</section>

		<section void-id="form-section">
			<h1>
				Morph
			</h1>
			<h3>
				Welcome to Morph
			</h3>

			${ voidButton({ index: Math.random() * 100 }) }
		</section>
		`;
	}

}


export const loginBody = voidElement(LoginBody);
