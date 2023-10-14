import './better-table.cmp.js';

import { faker } from '@faker-js/faker';
import { range } from '@roenlie/mimic-core/array';
import { maybe } from '@roenlie/mimic-core/async';
import { customElement, MimicElement } from '@roenlie/mimic-lit/element';
import { css, html } from 'lit';

import { serverUrl } from '../../app/backend-url.js';
import type { DbResponse } from '../../app/response-model.js';
import type { Module } from '../../features/code-module/module-model.js';
import { sharedStyles } from '../../features/styles/shared-styles.js';
import { type Column, FragmentTable } from './fragment-table/fragment-table.js';

FragmentTable.register();


interface Data {
	id:        ReturnType<typeof faker.database.mongodbObjectId>,
	firstName: ReturnType<typeof faker.person.firstName>,
	lastName:  ReturnType<typeof faker.person.lastName>,
	email:     ReturnType<typeof faker.internet.email>,
	street:    ReturnType<typeof faker.location.street>,
	country:   ReturnType<typeof faker.location.country>,
	city:      ReturnType<typeof faker.location.city>,
	IBAN:      ReturnType<typeof faker.finance.iban>,
}


@customElement('m-studio-page')
export class StudioPageCmp extends MimicElement {

	protected columns: Column<Data>[] = [
		{
			label:        'ID',
			field:        'id',
			minWidth:     150,
			defaultWidth: 250,
		},
		{
			label:        'First name',
			field:        'firstName',
			minWidth:     150,
			defaultWidth: 250,
		},
		{
			label:        'Last name',
			field:        'lastName',
			minWidth:     150,
			defaultWidth: 250,
		},
		{
			label:        'Email',
			field:        'email',
			minWidth:     150,
			defaultWidth: 250,
		},
		{
			label:        'Street',
			field:        'street',
			minWidth:     150,
			defaultWidth: 250,
		},
		{
			label:        'Country',
			field:        'country',
			minWidth:     150,
			defaultWidth: 250,
		},
		{
			label:        'City',
			field:        'city',
			minWidth:     150,
			defaultWidth: 250,
		},
		{
			label:        'IBAN',
			field:        'IBAN',
			minWidth:     150,
			defaultWidth: 250,
		},
	];

	protected data: Data[] = range(100).map(() => ({
		id:        faker.database.mongodbObjectId(),
		firstName: faker.person.firstName(),
		lastName:  faker.person.lastName(),
		email:     faker.internet.email(),
		street:    faker.location.street(),
		country:   faker.location.country(),
		city:      faker.location.city(),
		IBAN:      faker.finance.iban(),
	}));

	public override async connectedCallback() {
		super.connectedCallback();

		const url = new URL(serverUrl + `/api/code-modules/all`);
		const [ result ] = await maybe<DbResponse<Module>>((await fetch(url)).json());
		if (!result)
			return;

		console.log(result);
	}

	protected override render() {
		return html`
		<f-table1
			.columns=${ this.columns }
			.data=${ this.data }
		></f-table1>
		`;
	}

	public static override styles = [
		sharedStyles,
		css`
		:host {
			display: grid;
			overflow: auto;
			margin: 24px;
		}
		f-table1 {
			--header-color:        var(--on-background);
			--header-background:   var(--shadow1);
			--header-bottom-border:2px solid var(--background-strong);
			--row-even-background: var(--surface1);
			--row-bottom-border:   2px solid var(--background-strong);
			--table-color:         var(--on-background);
			--table-background:    var(--surface);
			--table-bottom-border: 2px solid var(--shadow1);
		}
		`,
	];

}
