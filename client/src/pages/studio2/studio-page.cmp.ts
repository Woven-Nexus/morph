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
import { FragmentTable1 } from './fragment-table.js';

FragmentTable1.register();


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

	protected columns: FragmentTable1['columns'] = [
		{
			label:    'ID',
			fraction: 1,
			minWidth: 150,
			headerRender() {
				return html`${ this.label }`;
			},
			fieldRender: (data: Data) => {
				return html`<span>${ data.id }</span>`;
			},
		},
		{
			label:    'First name',
			fraction: 1.67,
			minWidth: 150,
			headerRender() {
				return html`${ this.label }`;
			},
			fieldRender: (data: Data) => {
				return html`<span>${ data.firstName }</span>`;
			},
		},
		{
			label:    'Last name',
			fraction: 1.67,
			minWidth: 150,
			headerRender() {
				return html`${ this.label }`;
			},
			fieldRender: (data: Data) => {
				return html`<span>${ data.lastName }</span>`;
			},
		},
		{
			label:    'Email',
			fraction: 1.67,
			minWidth: 150,
			headerRender() {
				return html`${ this.label }`;
			},
			fieldRender: (data: Data) => {
				return html`<span>${ data.email }</span>`;
			},
		},
		{
			label:    'Street',
			fraction: 3.33,
			minWidth: 150,
			headerRender() {
				return html`${ this.label }`;
			},
			fieldRender: (data: Data) => {
				return html`<span>${ data.street }</span>`;
			},
		},
		{
			label:    'Country',
			fraction: 1.67,
			minWidth: 150,
			headerRender() {
				return html`${ this.label }`;
			},
			fieldRender: (data: Data) => {
				return html`<span>${ data.country }</span>`;
			},
		},
		{
			label:    'City',
			fraction: 3.33,
			minWidth: 150,
			headerRender() {
				return html`${ this.label }`;
			},
			fieldRender: (data: Data) => {
				return html`<span>${ data.city }</span>`;
			},
		},
		{
			label:    'IBAN',
			fraction: 1.67,
			minWidth: 150,
			headerRender() {
				return html`${ this.label }`;
			},
			fieldRender: (data: Data) => {
				return html`<span>${ data.IBAN }</span>`;
			},
		},
	];

	protected data: Data[] = range(500).map(() => ({
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
			dynamic
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
			margin-right: 5vw;
			margin-bottom: 5vw;
			background-color: white;
		}
		`,
	];

}
