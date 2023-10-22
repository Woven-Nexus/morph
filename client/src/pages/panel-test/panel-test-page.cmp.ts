import { domId } from '@roenlie/mimic-core/dom';
import { customElement, MimicElement } from '@roenlie/mimic-lit/element';
import { css, html } from 'lit';
import { queryAll } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import { createRef, type Ref, ref } from 'lit/directives/ref.js';
import { when } from 'lit/directives/when.js';

import { sharedStyles } from '../../features/styles/shared-styles.js';
import { DynamicStyle } from '../studio2/dynamic-style.cmp.js';
import { PanelResizer } from './panel-resizer.js';

DynamicStyle.register();


interface Panel {
	id: string;
	minWidth: number;
	maxWidth: number;
	width: number;
}


@customElement('m-panel-test-page')
export class PanelTestPage extends MimicElement {

	@queryAll('s-outer-panel') protected outerPanelEls: NodeListOf<HTMLElement>;
	@queryAll('s-panel') protected panelEls: NodeListOf<HTMLElement>;

	protected elRefs = new Map<string, Ref>();

	protected outerPanels: Panel[] = [
		{
			id:       domId(),
			maxWidth: 1500,
			minWidth: 200,
			width:    800,
		},
		//{
		//	id:       domId(),
		//	maxWidth: 1500,
		//	minWidth: 500,
		//	width:    800,
		//},
	];

	protected innerPanels1: Panel[] = [
		{
			id:       domId(),
			maxWidth: 1000,
			//maxWidth: 300,
			//minWidth: Math.round(Math.random() * 100),
			minWidth: 100,
			width:    200,
		},
		{
			id:       domId(),
			maxWidth: 1000,
			//maxWidth: 300,
			//minWidth: Math.round(Math.random() * 100),
			minWidth: 100,
			width:    200,
		},
		{
			id:       domId(),
			maxWidth: 1000,
			//maxWidth: 300,
			//minWidth: Math.round(Math.random() * 100),
			minWidth: 100,
			width:    200,
		},
	];

	protected innerPanels2: Panel[] = [
		{
			id:       domId(),
			maxWidth: 1000,
			//maxWidth: 300,
			//minWidth: Math.round(Math.random() * 100),
			minWidth: 100,
			width:    200,
		},
		{
			id:       domId(),
			maxWidth: 1000,
			//maxWidth: 300,
			//minWidth: Math.round(Math.random() * 100),
			minWidth: 100,
			width:    200,
		},
		{
			id:       domId(),
			maxWidth: 1000,
			//maxWidth: 300,
			//minWidth: Math.round(Math.random() * 100),
			minWidth: 100,
			width:    200,
		},
	];

	protected outerPanelResizer = new PanelResizer<Panel>(
		this.outerPanels,
		() => this.outerPanelEls,
		panel => panel?.id ?? '',
		() => this.requestUpdate(),
	);

	protected innerPanelResizer = new PanelResizer<Panel>(
		this.innerPanels1,
		() => this.panelEls,
		panel => panel?.id ?? '',
		() => this.requestUpdate(),
		() => this.outerPanels[0]!.width - 64,
	);

	public override afterConnectedCallback(): void {
		requestAnimationFrame(() => {
			this.requestUpdate();

			this.innerPanelResizer.constrainTotalWidth();
			this.outerPanelResizer.onResize = () => this.innerPanelResizer.constrainTotalWidth();
		});
	}

	protected get dynamicStyles() {
		const styles = {} as Record<string, Record<string, string>>;
		for (const panel of [ ...this.outerPanels, ...this.innerPanels1 ]) {
			styles['#' + panel.id] = {
				width: panel.width + 'px',
			};
		}

		return styles;
	}

	protected override render(): unknown {
		return html`
		<dynamic-style
			.styles=${ this.dynamicStyles }
		></dynamic-style>

		${ map(this.outerPanels, (panel, i) => html`
		<s-outer-panel
			id=${ panel.id }
		>
			${ map(this.innerPanels1, (panel, i) => {
				const elRef = this.elRefs.get(panel.id)
					?? (() => this.elRefs.set(panel.id, createRef()).get(panel.id)!)();

				return html`
				<s-panel
					id=${ panel.id }
					${ ref(elRef) }
				>
					<div>
						rect width: ${ Math.round(elRef.value?.getBoundingClientRect().width ?? 0) }
					</div>
					<div>
						max width: ${ panel.maxWidth }
					</div>
					<div>
						min width: ${ panel.minWidth }
					</div>
					<div>
						width: ${ panel.width }
					</div>
				</s-panel>
				${ when(i !== this.innerPanels1.length - 1, () => html`
				<s-resize
					data-left-panel-id=${ panel.id }
					data-right-panel-id=${ this.innerPanels1[i + 1]?.id }
					@mousedown=${ this.innerPanelResizer.mousedown }
				></s-resize>
				`) }
				`;
			}) }
		</s-outer-panel>
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
		s-outer-panel {
			overflow: hidden;
			display: grid;
			grid-auto-flow: column;
			grid-auto-columns: max-content;
			padding: 12px;
			border: 2px solid grey;
			border-radius: 12px;
			background-color: rgb(50 50 50);
		}
		s-panel {
			display: grid;
			/*padding: 12px;*/
		}
		s-panel > div {
			white-space: nowrap;
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
