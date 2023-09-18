import { provide } from '@roenlie/lit-context';
import { customElement, MimicElement } from '@roenlie/mimic-lit/element';
import { css, html } from 'lit';

import { LayoutStore } from './layout-store.js';
import { NavbarCmp } from './navbar.cmp.js';

NavbarCmp.register();


@customElement('app-layout')
export class AppLayoutCmp extends MimicElement {

	@provide('store') protected store = new LayoutStore();

	public override connectedCallback(): void {
		super.connectedCallback();
	}

	protected override render(): unknown {
		return html`
		<m-navbar></m-navbar>
		<slot></slot>
		`;
	}

	public static override styles = [
		css`
		:host {
			display: grid;
			grid-template-columns: auto 1fr;
			gap: 20px;
			background-color: var(--background);
			color: var(--on-background);
		}
		`,
	];

}
