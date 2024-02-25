import { AegisElement, customElement } from '@roenlie/lit-aegis';
import { html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';

import { ForgeFile, ForgeFileDB } from '../filesystem/forge-file.js';
import { MimicDB } from '../filesystem/mimic-db.js';


@customElement('m-file-details')
export class FileDetailsCmp extends AegisElement {

	@property() public activeId?: string;
	@state() protected file?: ForgeFile;

	protected override updated(props: Map<PropertyKey, unknown>): void {
		super.updated(props);

		if (props.has('activeId'))
			this.getFile();
	}

	protected async getFile() {
		if (!this.activeId)
			return this.file = undefined;

		this.file = await MimicDB
			.connect(ForgeFileDB)
			.collection(ForgeFile)
			.get(this.activeId);
	}

	protected override render(): unknown {
		const keyValues = [
			[ 'name', this.file?.name ],
			[ 'type', this.file?.type ],
		];


		return html`
		${ map(keyValues, ([ key, value ]) => html`
		<div>
			<span>${ key }:</span>
			<span>${ value }</span>
		</div>
		`) }
		`;
	}


}
