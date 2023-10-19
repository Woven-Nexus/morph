import { domId } from '@roenlie/mimic-core/dom';
import { customElement, MimicElement } from '@roenlie/mimic-lit/element';
import { css, html } from 'lit';
import { map } from 'lit/directives/map.js';
import { createRef, type Ref, ref } from 'lit/directives/ref.js';

import { sharedStyles } from '../../features/styles/shared-styles.js';
import { DynamicStyle } from '../studio2/dynamic-style.cmp.js';

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
			maxWidth: 400,
			minWidth: 50,
			width:    200,
		},
		{
			id:       domId(),
			maxWidth: 400,
			minWidth: 50,
			width:    200,
		},
		{
			id:       domId(),
			maxWidth: 400,
			minWidth: 50,
			width:    200,
		},
	];

	public override afterConnectedCallback(): void {
		requestAnimationFrame(() => this.requestUpdate());
	}

	protected resizeMousedown(ev: MouseEvent) {
		ev.preventDefault();

		const target = ev.target as HTMLElement;

		const leftPanelId = target.dataset['leftPanelId']!;
		const rightPanelId = target.dataset['rightPanelId']!;

		const leftPanelEl = this.shadowRoot!.getElementById(leftPanelId);
		const rightPanelEl = this.shadowRoot!.getElementById(rightPanelId);

		const leftPanel = this.panels.find(p => p.id === leftPanelId);
		const rightPanel = this.panels.find(p => p.id === rightPanelId);

		let offsetLeft: number | undefined;
		let offsetRight: number | undefined;
		const resizeSpacerWidth = 20;

		if (leftPanelEl) {
			const leftRect = leftPanelEl.getBoundingClientRect();
			offsetLeft = ev.clientX - leftRect.right;
		}

		if (rightPanelEl) {
			const rightRect = rightPanelEl?.getBoundingClientRect();
			offsetRight = rightRect.left - ev.clientX;
		}

		const mousemove = (ev: MouseEvent) => {
			const leftRect = leftPanelEl?.getBoundingClientRect();
			const rightRect = rightPanelEl?.getBoundingClientRect();
			let rerender = false;

			let leftPanelWidthDiff = 0;
			const rightPanelWidthDiff = 0;

			if (leftPanel && leftRect && offsetLeft !== undefined) {
				const leftWidth = ev.clientX - leftRect.left - offsetLeft;
				const newWidth = Math.max(Math.min(leftPanel.maxWidth, leftWidth), leftPanel.minWidth);
				leftPanelWidthDiff = leftPanel.width - newWidth;

				if (newWidth === leftPanel.maxWidth)
					return;

				if (newWidth === leftPanel.minWidth) {
					//
					console.log('hit minimum width on left panel');

					return;
				}

				leftPanel.width = newWidth;
				rerender = true;
			}

			if (rightPanel && rightRect && offsetRight !== undefined) {
				const rightWidth = rightRect.right - ev.clientX - offsetRight!;
				const newWidth = Math.max(Math.min(rightPanel.maxWidth, rightWidth), rightPanel.minWidth);

				if (newWidth === rightPanel.maxWidth)
					return;


				if (newWidth === rightPanel.minWidth) {
					console.log('hit minimum width on right panel');
					// Get the new offset for cursor to the next panel to the resized.
					let panelIncr = 0;
					let nextPanel: Panel | undefined;
					do {
						panelIncr ++;
						nextPanel = this.panels[this.panels.indexOf(rightPanel) + panelIncr];
					} while (nextPanel && nextPanel?.width === nextPanel?.minWidth);

					if (!nextPanel)
						return;

					const nextPanelEl = this.shadowRoot?.getElementById(nextPanel?.id);
					if (!nextPanelEl)
						return;

					const nextPanelRect = nextPanelEl?.getBoundingClientRect();
					const offset = offsetRight + rightPanel.width + resizeSpacerWidth;

					const nextRightWidth = nextPanelRect.right - (ev.clientX + offset);
					nextPanel.width = Math.max(Math.min(nextPanel.maxWidth, nextRightWidth), nextPanel.minWidth);
					this.requestUpdate();

					return;
				}

				rightPanel.width = newWidth;
				rerender = true;
			}

			if (rerender)
				this.requestUpdate();
		};

		const mouseup = () => {
			window.removeEventListener('mousemove', mousemove);
			window.removeEventListener('mouseup', mouseup);
		};

		window.addEventListener('mousemove', mousemove);
		window.addEventListener('mouseup', mouseup);
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
				${ elRef.value?.getBoundingClientRect().width }
			</s-panel>
			<s-resize
				data-left-panel-id=${ panel.id }
				data-right-panel-id=${ this.panels[i + 1]?.id ?? '' }
				@mousedown=${ this.resizeMousedown }
			></s-resize>
			`;
		}) }
		`;
	}

	public static override styles = [
		sharedStyles,
		css`
		:host {
			display: grid;
			grid-auto-flow: column;
			grid-auto-columns: max-content;
			place-content: stretch center;
		}
		s-panel {
			display: grid;
			background-color: rgb(50 50 50);
			padding: 12px;
		}
		s-resize {
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
