import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import type { LoginStore } from './login-store.ts';


@customElement('m-login-form')
export class LoginForm extends LitElement {

	@property({ type: Object }) public store: LoginStore;
	protected validationErrors: any[] = [];

	protected override render() {
		return html`
		<form @submit=${ (ev: Event) => ev.preventDefault() }>
			<fieldset class="field">
				<legend>
					<label for="username">
						Username or Email
					</label>
				</legend>
				<input
					id="username"
					name="username"
					value=""
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
				${ this.validationErrors?.map(err => html`
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
	}

	public static override styles = css`
	:host {
		display: grid;
		grid-auto-rows: max-content;
	}

	form {
		display: grid;
		grid-auto-rows: max-content;
		row-gap: 12px;
		width: clamp(100px, 30vw, 500px);

		fieldset.field {
			all: unset;
			display: block;
			padding-bottom: 4px;
			border-bottom: 1px solid rgb(160 160 160);

			legend {
				padding-bottom: 8px;
				padding-inline: 0px;
				font-size: 14px;
				color: rgb(160 160 160);
			}
			input {
				all: unset;
				font-size: 24px;
				width: 100%;
			}
			input:-webkit-autofill, input:-webkit-autofill:focus {
				box-shadow: 0 0 0 1000px hotpink inset;
				-webkit-text-fill-color: #333;
			}
		}
		s-error-messages {
			display: grid;
			grid-auto-rows: max-content;
			place-items: start center;
			font-size: 10px;
			color: red;
			height: 15vh;
		}
		div.forgot-password {
			display: flex;
			justify-content: end;

			a {
				font-size: 12px;
				color: rgb(119 154 98);
			}
		}
		div.create-account {
			place-self: center;

		}
		button {
			all: unset;
			cursor: pointer;
			place-self: center;
			display: grid;
			place-items: center;
			background-color: rgb(200 200 200);
			border-radius: 999px;
			height: 50px;
			padding-inline: 64px;

			h3 {
				color: rgb(0 0 0);
			}
		}
		button:hover {
			background-color: rgb(160 160 160);
		}
		button:focus-visible {
			outline: 4px solid rgb(240 240 240);
			outline-offset: -4px;
		}
	}
	s-create-account {
		display: block;
		place-self: start center;
		color: rgb(160 160 160);

		a {
			color: rgb(119 154 98);
			border-bottom: 2px solid rgb(119 154 98);
			padding-bottom: 4px;
		}
	}
	`;

}
