import {
	Adapter,
	AegisComponent,
	customElement,
	inject,
} from '@roenlie/lit-aegis';
import { sharedStyles } from '@roenlie/mimic-lit/styles';
import { html, css } from 'lit';
import { NavCmp } from '../features/ide/nav.cmp.js';
import { layoutModule } from './layout.module.js';
import { SignalWatcher, type Signal } from '@lit-labs/preact-signals';
import { classMap } from 'lit/directives/class-map.js';

NavCmp.register();

@SignalWatcher
@customElement('m-layout-page')
export class LayoutPageCmp extends AegisComponent {
	public static page = true;

	constructor() {
		super(LayoutPageAdapter, layoutModule);
	}
}

export class LayoutPageAdapter extends Adapter {
	@inject('show-info-center') showInfoCenter: Signal<boolean>;

	public override render(): unknown {
		return html`
		<s-info-center
			class=${classMap({ active: this.showInfoCenter.value })}
		></s-info-center>
		<m-nav id="nav"></m-nav>
		<slot></slot>
		`;
	}
	public static override styles = [
		sharedStyles,
		css`
		:host {
			overflow: hidden;
			display: grid;
			grid-template-columns: max-content max-content 1fr;
			grid-template-rows: 1fr;
			height: 100%;
		}
		s-info-center {
			display: block;
			background-color: rgb(30, 30, 30);
			width: 0px;
			transition: width 300ms ease-out;
		}
		s-info-center.active {
			width: 200px;
		}
		`,
	];
}


