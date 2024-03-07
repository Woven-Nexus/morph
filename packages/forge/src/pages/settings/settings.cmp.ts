import { AegisElement, customElement } from '@roenlie/lit-aegis';
import { css, html } from 'lit';

import { Keystone, type KeystoneComponent, type SubProps } from '../../features/keystone/keystone.js';
import { useStyle } from '../../features/keystone/use-style.js';


interface Card {
	(): KeystoneComponent;
	Header(props: {text: string}): KeystoneComponent;
	Body(props: {text: string}): KeystoneComponent;
	Footer(props: {text: string}): KeystoneComponent;
}


const Card = Keystone(props => {
	useStyle(css`
	s-card {
		display: block;
		height: 200px;
		aspect-ratio: 1/1;
		border: 2px solid green;
	}
	`);

	return () => html`
	<s-card class="card">
		${ props.children }
	</s-card>
	`;
}) as Card;

Card.Header = Keystone<SubProps<Card['Header']>>(props => {
	useStyle(css`
	s-card-header {
		display: block;
	}
	`);

	return () => html`
	<s-card-header>
		${ props.text }
	</s-card-header>
	`;
});

Card.Body = Keystone<SubProps<Card['Body']>>(props => {
	useStyle(css`
	s-card-body {
		display: block;
	}
	`);

	return () => html`
	<s-card-body>
		${ props.text }
	</s-card-body>
	`;
});

Card.Footer = Keystone<SubProps<Card['Footer']>>(props => {
	useStyle(css`
	s-card-footer {
		display: block;
	}
	`);

	return () => html`
	<s-card-footer>
		${ props.text }
	</s-card-footer>
	`;
});


@customElement('m-settings-page', true)
export class EditorPageCmp extends AegisElement {

	public static page = true;

	protected override createRenderRoot(): HTMLElement | DocumentFragment {
		return this;
	}

	protected override render(): unknown {
		return html`
		<Card>
			<Card.Header text="header goes here">
			</Card.Header>

			<Card.Body text="body goes here">
			</Card.Body>

			<Card.Footer text="footer goes here">
			</Card.Footer>
		</Card>
		`;
	}

}
