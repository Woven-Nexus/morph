import { type DeclarativeElement, declarativeElement } from '../../../../utilities/declarative-element.js';
import { html } from '../../../../utilities/template-tag.js';


export class LoginBody implements DeclarativeElement {

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
		</section>
		`;
	}

}


export const loginBody = declarativeElement(LoginBody);
