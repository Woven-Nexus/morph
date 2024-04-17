import { html } from '../../../utilities/template-tag.js';
import { type VoidElement, voidElement } from '../../assets/void/void-element.js';


export class VoidButton implements VoidElement {

	public tagName = 'm-login-form';
	public styleUrls = '/login/assets/login-form.css';
	public scriptUrls = '';

	public render(props: {
		username?: string;
		validationErrors?: string[];
	}): Promise<string> {
		return html`
		<form void-boosted>
			<fieldset class="field">
				<legend>
					<label for="username">
						Username or Email
					</label>
				</legend>
				<input
					id="username"
					name="username"
					value="${ props.username ?? '' }"
					required
					autofocus
				>
			</fieldset>

			<fieldset class="field">
				<legend>
					<label for="password">
						Password
					</label>
				</legend>
				<input
					id="password"
					name="password"
					value=""
				>
			</fieldset>

			<div class="forgot-password">
				<a>
					Forgot password?
				</a>
			</div>

			<div></div>

			<button void-post="/login" void-target="host">
				<h3>Sign in</h3>
			</button>

			<div></div>

			<s-error-messages>
				${ props.validationErrors?.map(err => html`
					<s-error>
						${ err }
					</s-error>
				`) }
			</s-error-messages>
		</form>

		<s-create-account>
			<p>Not a user ?</p>
			<a>Create an Account</a>
		</s-create-account>
		`;
		//<form void-boosted>
		//	<fieldset>
		//		<label>
		//			Hello
		//		</label>
		//		<input
		//			id="hello"
		//			name="hello"
		//			value=""
		//		>
		//	</fieldset>

		//	<button
		//		void-post="/login/info"
		//		void-target="title, greeting"
		//	>
		//		I AM A BUTTON ${ props.index }
		//	</button>
		//</form>
	}

}


export const loginForm = voidElement(VoidButton);
