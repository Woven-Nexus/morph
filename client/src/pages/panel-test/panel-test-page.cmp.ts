import { domId } from '@roenlie/mimic-core/dom';
import { customElement, MimicElement } from '@roenlie/mimic-lit/element';
import { css, html } from 'lit';
import { queryAll } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import { createRef, type Ref, ref } from 'lit/directives/ref.js';

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

	protected elRefs = new Map<string, Ref>();
	protected panels: Panel[] = [
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

	@queryAll('s-panel') protected panelEls: NodeListOf<HTMLElement>;

	protected panelResizer = new PanelResizer<Panel>(
		this.panels,
		() => this.panelEls,
		panel => panel?.id ?? '',
		() => this.requestUpdate(),
	);

	public override afterConnectedCallback(): void {
		requestAnimationFrame(() => this.requestUpdate());
	}

	protected get dynamicStyles() {
		const styles = {} as Record<string, Record<string, string>>;
		for (const panel of this.panels) {
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

		${ map(this.panels, (panel, i) => {
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
			<s-resize
				data-left-panel-id=${ panel.id }
				data-right-panel-id=${ this.panels[i + 1]?.id }
				@mousedown=${ this.panelResizer.mousedown }
			></s-resize>
			`;
		}) }
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
		}
		s-panel {
			display: grid;
			background-color: rgb(50 50 50);
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
