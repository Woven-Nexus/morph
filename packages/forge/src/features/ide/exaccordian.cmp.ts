import { AegisElement, customElement } from '@roenlie/lit-aegis';
import { html } from 'lit';
import { property } from 'lit/decorators.js';
import exaccordianStyles from './exaccordian.css' with { type: 'css' };
import { sharedStyles } from '@roenlie/mimic-lit/styles';
import { map } from 'lit/directives/map.js';
import { tooltip } from '@roenlie/mimic-elements/tooltip';

@customElement('m-exaccordian', true)
export class ExaccordianCmp extends AegisElement {
	@property() public header?: string;
	@property({ type: Array }) public actions?: {
		label: string;
		icon: string;
		action: () => void;
	}[];

	protected renderHeader(text: string) {
		return html`
		<s-accordian-header>
			<mm-icon
				style="font-size:18px;"
				url=${'https://icons.getbootstrap.com/assets/icons/chevron-right.svg'}
			></mm-icon>
			<span>
				${text}
			</span>
			<s-actions>
				${map(this.actions ?? [], def => {
					return html`
					<mm-button
						${tooltip(def.label)}
						type="icon"
						variant="text"
						size="small"
						shape="rounded"
					>
						<mm-icon
							style="font-size:18px;"
							url=${def.icon}
						></mm-icon>
					</mm-button>
					`;
				})}
			</s-actions>
		</s-accordian-header>
		`;
	}

	protected renderContent() {
		return html`
		<s-accordian-content>
			${this.renderItem('Item 1')}
		</s-accordian-content>
		`;
	}

	renderItem(text: string) {
		return html`
		<s-accordian-item>
			${text}
		</s-accordian-item>
		`;
	}

	protected override render(): unknown {
		return html`
		<s-accordian>
			${this.renderHeader(this.header ?? '')}
			${this.renderContent()}
		</s-accordian>
		`;
	}

	public static override styles = [sharedStyles, exaccordianStyles];
}