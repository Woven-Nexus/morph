import { Adapter, AegisComponent, customElement } from '@roenlie/lit-aegis';
import { html } from 'lit';


@customElement('handover-page')
export class HandoverPage extends AegisComponent {

	public static page = true;

	constructor() {
		super(HandoverPageAdapter);
	}

}


export class HandoverPageAdapter extends Adapter {

	public override render(): unknown {
		return html`
		hei
		`;
	}

}
