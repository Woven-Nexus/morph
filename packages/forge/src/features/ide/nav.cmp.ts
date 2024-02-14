import { type Signal } from '@lit-labs/preact-signals';
import {
	Adapter,
	AegisComponent,
	customElement,
	inject,
	state,
} from '@roenlie/lit-aegis';
import { domId } from '@roenlie/mimic-core/dom';
import { MMIcon } from '@roenlie/mimic-elements/icon';
import { tooltip } from '@roenlie/mimic-elements/tooltip';
import { sharedStyles } from '@roenlie/mimic-lit/styles';
import { html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { map } from 'lit/directives/map.js';
import { styleMap } from 'lit/directives/style-map.js';

import navStyles from './nav.css' with { type: 'css' };

MMIcon.register();


interface LinkBase { id: string; tooltip: string; icon: string }
type Link = LinkBase & { path: string };
type Action = LinkBase & { action: () => any };


@customElement('m-nav')
export class NavCmp extends AegisComponent {

	static {
		const sheet = new CSSStyleSheet();
		sheet.replaceSync(`
			::view-transition-group(activenav) {
				animation-duration: 300ms;
				animation-timing-function: ease-out;
			}
		`);

		document.adoptedStyleSheets = [ ...document.adoptedStyleSheets, sheet ];
	}

	constructor() {
		super(NavAdapter);
	}

}

export class NavAdapter extends Adapter {

	@inject('show-info-center') protected showInfoCenter: Signal<boolean>;
	@state() protected active: string;
	protected links: (Link | Action)[] = [
		{
			id:      domId(),
			tooltip: 'forge',
			icon:    'https://icons.getbootstrap.com/assets/icons/sourceforge.svg',
			path:    router.urlForName('forge'),
		},
		{
			id:      domId(),
			tooltip: 'settings',
			icon:    'https://icons.getbootstrap.com/assets/icons/sliders2.svg',
			path:    router.urlForName('settings'),
		},
		{
			id:      domId(),
			tooltip: 'help',
			icon:    'https://icons.getbootstrap.com/assets/icons/patch-question.svg',
			action:  () => {
				this.showInfoCenter.value = !this.showInfoCenter.value;
			},
		},
	];

	public override connectedCallback(): void {
		this.active = this.links[0]!.id;
	}

	protected handleClickNav(ev: MouseEvent) {
		const id = (ev.currentTarget as HTMLElement).id;
		if (this.active === id)
			return;

		const link = this.links.find(l => l.id === id)!;
		if (!('path' in link))
			return;

		document.startViewTransition?.(async () => {
			this.active = id;
			await this.updateComplete;
		});
	}

	protected handleClickAction(ev: MouseEvent) {
		const id = (ev.currentTarget as HTMLElement).id;
		const link = this.links.find(l => l.id === id)!;
		if ('action' in link)
			link.action();
	}

	protected renderItem(link: Link | Action) {
		return html`
		<s-nav-item class=${ classMap({ active: this.active === link.id }) }>
			<mm-icon
				style=${ `view-transition-name:nav-${ link.id }` }
				url=${ link.icon }
			></mm-icon>
		</s-nav-item>
		`;
	}

	protected renderLink(link: Link) {
		return html`
		<a
			id=${ link.id }
			href=${ link.path }
			style=${ styleMap({
				viewTransitionName: this.active === link.id ? 'activenav' : '',
			}) }
			class=${ classMap({ active: this.active === link.id }) }
			@click=${ this.handleClickNav.bind(this) }
			${ tooltip(link.tooltip, { placement: 'right' }) }
		>
			${ this.renderItem(link) }
		</a>
		`;
	}

	protected renderAction(link: Action) {
		return html`
		<a
			id=${ link.id }
			style=${ styleMap({
				viewTransitionName: this.active === link.id ? 'activenav' : '',
			}) }
			class=${ classMap({ active: this.active === link.id }) }
			@click=${ this.handleClickAction.bind(this) }
			${ tooltip(link.tooltip, { placement: 'right' }) }
		>
			${ this.renderItem(link) }
		</a>
		`;
	}

	public override render(): unknown {
		return map(this.links, (link, i) =>
			'path' in link ? this.renderLink(link) : this.renderAction(link));
	}

	public static override styles = [ sharedStyles, navStyles ];

}
