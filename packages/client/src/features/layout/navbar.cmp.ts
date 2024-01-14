import './repeat.cmp.js';

import { AegisElement, customElement, query, state } from '@roenlie/lit-aegis';
import { MMIcon } from '@roenlie/mimic-elements/icon';
import { type CSSResultGroup, html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { when } from 'lit/directives/when.js';

import { sharedStyles } from '../styles/shared-styles.js';
import navbarStyles from './navbar.css' with { type: 'css' };

MMIcon.register();


@customElement('m-navbar')
export class NavbarCmp extends AegisElement {

	@query('s-nav-container') protected container: HTMLElement;
	@state() protected expanded = false;

	protected link: {value?: {label: string, iconSrc: string}} = { value: undefined };
	protected links = [
		{ label: 'Handover', iconSrc: 'https://icons.getbootstrap.com/assets/icons/building.svg' },
		{ label: 'Something', iconSrc: 'https://icons.getbootstrap.com/assets/icons/app.svg' },
	];

	protected override render(): unknown {
		return html`
		<s-nav-container class=${ classMap({ active: this.expanded }) }>
			<button
				@click=${ () => this.expanded = !this.expanded }
			>
				${ when(
					this.expanded,
					() => html`
					<mm-icon
						url="https://icons.getbootstrap.com/assets/icons/chevron-left.svg"
					></mm-icon>
					`,
					() => html`
					<mm-icon
						url="https://icons.getbootstrap.com/assets/icons/chevron-right.svg"
					></mm-icon>
					`,
				) }
			</button>

			<ul>
				<x-repeat .from=${ this.links } .as=${ this.link }>
					<template>
						<li>
							<span>
								<span>
									{{label}}
								</span>
							</span>
							<span>
								<mm-icon
									url="{{iconSrc}}"
								></mm-icon>
							</span>
						</li>
					</template>
				</x-repeat>
			</ul>

		</s-nav-container>
		`;
	}

	public static override styles: CSSResultGroup = [
		sharedStyles,
		navbarStyles,
	];

}
