import { CounterElement } from '../parts/server-button.js';


interface Props {

}


export class LoginBody extends ServerElement<Props> {

	public static override tagName = 'm-login-body';
	public static override styleUrl = '/login/assets/parts/login-body.css';
	public static override scriptUrl = '/login/assets/parts/login-body.js';
	public static override updateUrl = '';

	static { customElements.define(this.tagName, this); }

	public static override async render(props: Props) {
		return `
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
			${ await CounterElement.generate({ count: 5 }) }
		</section>
		`;
	}

}
