import { AegisElement, customElement, state } from '@roenlie/lit-aegis';
import { MMIcon } from '@roenlie/mimic-elements/icon';
import { html } from 'lit';
import navStyles from './nav.css' with { type: 'css' };
import { sharedStyles } from '@roenlie/mimic-lit/styles';
import { map } from 'lit/directives/map.js';
import { domId } from '@roenlie/mimic-core/dom';
import { tooltip } from '@roenlie/mimic-elements/tooltip';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';

MMIcon.register();

@customElement('m-nav')
export class NavCmp extends AegisElement {
	static {
		const sheet = new CSSStyleSheet();
		sheet.replaceSync(`
		::view-transition-group(activenav) {
			animation-duration: 500ms;
		}
		`);

		document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
	}

	@state() protected active: string;
	protected links: {
		id: string;
		tooltip: string;
		icon: string;
		path: string;
	}[] = [
		{
			id: domId(),
			tooltip: 'forge',
			icon: 'https://icons.getbootstrap.com/assets/icons/sourceforge.svg',
			path: '',
		},
		{
			id: domId(),
			tooltip: 'settings',
			icon: 'https://icons.getbootstrap.com/assets/icons/sliders2.svg',
			path: '',
		},
		{
			id: domId(),
			tooltip: 'help',
			icon: 'https://icons.getbootstrap.com/assets/icons/patch-question.svg',
			path: '',
		},
	];

	override connectedCallback(): void {
		super.connectedCallback();

		this.active = this.links[0]!.id;
	}

	protected handleClickNav(ev: MouseEvent) {
		const id = (ev.currentTarget as HTMLElement).id;
		document.startViewTransition?.(async () => {
			this.active = id;
			await this.updateComplete;
		});
	}

	protected override render(): unknown {
		return html`
		${map(
			this.links,
			link => html`
			<s-nav-item
				id=${link.id}
				style=${styleMap({
					viewTransitionName: this.active === link.id ? 'activenav' : '',
				})}
				class=${classMap({
					active: this.active === link.id,
				})}
				@click=${this.handleClickNav.bind(this)}
				${tooltip(link.tooltip, { placement: 'right' })}
			>
				<mm-icon
					url=${link.icon}
				></mm-icon>
			</s-nav-item>
			`,
		)}
		`;
	}
	public static override styles = [sharedStyles, navStyles];
}