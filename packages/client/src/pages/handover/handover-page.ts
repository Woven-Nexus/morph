import { Adapter, AegisComponent, customElement } from '@roenlie/lit-aegis';
import { FragmentTable } from '@roenlie/mimic-elements/fragment-table';
import { html } from 'lit';

import { HandoverRowScrollerCmp } from './handover-row.js';

HandoverRowScrollerCmp.register();
FragmentTable.register();


@customElement('handover-page')
export class HandoverPage extends AegisComponent {

	public static page = true;

	constructor() {
		super(HandoverPageAdapter);
	}

}


export class HandoverPageAdapter extends Adapter {

	public override afterConnectedCallback(): void {
		const scroller = this.querySelector<HandoverRowScrollerCmp>('m-handover-row-scroller')!;
		scroller.active = true;
	}

	public override render(): unknown {
		return html`
		<m-handover-row-scroller></m-handover-row-scroller>
		`;
	}

}
