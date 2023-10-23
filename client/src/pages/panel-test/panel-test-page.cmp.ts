import { domId } from '@roenlie/mimic-core/dom';
import { customElement, MimicElement } from '@roenlie/mimic-lit/element';
import { css, html } from 'lit';
import { queryAll } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import { type Ref } from 'lit/directives/ref.js';

import { sharedStyles } from '../../features/styles/shared-styles.js';
import { DynamicStyle } from '../studio2/dynamic-style.cmp.js';
import { TestPanelCmp } from './panel.cmp.js';
import { PanelResizer } from './panel-resizer.js';

DynamicStyle.register();
TestPanelCmp.register();


interface Panel {
	id: string;
	minWidth: number;
	maxWidth: number;
	width: number;
}


@customElement('m-panel-test-page')
export class PanelTestPage extends MimicElement {

	@queryAll('m-test-panel') protected outerPanelEls: NodeListOf<TestPanelCmp>;

	protected outerPanels: Panel[] = [
		{
			id:       domId(),
			maxWidth: 1500,
			minWidth: 200,
			width:    600,
		},
		{
			id:       domId(),
			maxWidth: 1500,
			minWidth: 200,
			width:    600,
		},
	];

	protected outerPanelResizer = new PanelResizer<Panel>(
		this.outerPanels,
		() => this.outerPanelEls,
		panel => panel?.id ?? '',
		() => this.requestUpdate(),
	);

	public override afterConnectedCallback() {
		requestAnimationFrame(() => {
			this.requestUpdate();

			this.outerPanelResizer.onResize = () => {
				for (const el of this.outerPanelEls)
					el.calculcateWidth();
			};
		});
	}

	protected get dynamicStyles() {
		const styles = {} as Record<string, Record<string, string>>;
		for (const panel of this.outerPanels)
			styles['#' + panel.id] = { width: panel.width + 'px' };

		return styles;
	}

	protected override render(): unknown {
		return html`
		<dynamic-style
			.styles=${ this.dynamicStyles }
		></dynamic-style>

		${ map(this.outerPanels, (panel, i) => html`
		<m-test-panel
			id=${ panel.id }
			.getMaxWidth=${ () => panel.width }
		></m-test-panel>
		<s-resize
			data-left-panel-id=${ panel.id }
			data-right-panel-id=${ this.outerPanels[i + 1]?.id }
			@mousedown=${ this.outerPanelResizer.mousedown }
		></s-resize>
		`) }

		`;
	}

	public static override styles = [
		sharedStyles,
		css`
		:host {
			overflow: hidden;
			display: grid;
			grid-auto-flow: column;
			grid-auto-columns: max-content;
			place-content: stretch center;
			padding-block: 12px;
		}
		s-resize {
			overflow: hidden;
			display: grid;
			background-color: rgb(50 100 100);
			width: 20px;
			cursor: grab;
		}
		s-resize:active {
			cursor: grabbing;
		}
		`,
	];

}
