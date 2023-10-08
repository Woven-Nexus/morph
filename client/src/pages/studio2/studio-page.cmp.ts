import './better-table.cmp.js';

import { range } from '@roenlie/mimic-core/array';
import { maybe } from '@roenlie/mimic-core/async';
import { customElement, MimicElement } from '@roenlie/mimic-lit/element';
import { css, html } from 'lit';
import { map } from 'lit/directives/map.js';

import { serverUrl } from '../../app/backend-url.js';
import type { DbResponse } from '../../app/response-model.js';
import type { Module } from '../../features/code-module/module-model.js';
import { sharedStyles } from '../../features/styles/shared-styles.js';
import { FragmentTable1 } from './fragment-table.js';

FragmentTable1.register();

@customElement('m-studio-page')
export class StudioPageCmp extends MimicElement {

	public override async connectedCallback() {
		super.connectedCallback();

		const url = new URL(serverUrl + `/api/code-modules/all`);
		const [ result ] = await maybe<DbResponse<Module>>((await fetch(url)).json());
		if (!result)
			return;

		console.log(result);
	}

	protected override render(): unknown {
		return html`
		<f-table1 dynamic></f-table1>
		`;
	}


	public static override styles = [
		sharedStyles,
		css`
		:host {
			display: grid;
			overflow: auto;
			width: 50vw;
		}
		`,
	];

}
