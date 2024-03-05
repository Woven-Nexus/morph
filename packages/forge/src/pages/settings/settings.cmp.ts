import { AegisElement, customElement } from '@roenlie/lit-aegis';
import { html, type TemplateResult } from 'lit';


export function DirComponent(create: () => () => TemplateResult) {
	//

	return () => html`
	<div>
		Hello
	</div>
	`;
}

const Hello = (props: {label: string; click: () => void}) => {
	console.log({ props });

	return html`
	<button @click=${ props.click }>
		${ props.label }
	</button>
	`;
};


@customElement('m-settings-page', true)
export class EditorPageCmp extends AegisElement {

	public static page = true;

	protected override render(): unknown {
		return html`
		<Hello label="it wurked" @click=${ () => console.log('clickety') } />
		`;
	}

}
