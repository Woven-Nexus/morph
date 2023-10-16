import { sleep } from '@roenlie/mimic-core/async';
import { debounce } from '@roenlie/mimic-core/timing';
import { customElement, MimicElement } from '@roenlie/mimic-lit/element';
import { css, html } from 'lit';
import { query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { roundToNearest } from '../../../app/round-to-nearest.js';
import { scrollElementTo } from '../../../app/scroll-element-to.js';
import { sharedStyles } from '../../../features/styles/shared-styles.js';
import { DynamicStyle } from '../../studio2/dynamic-style.cmp.js';

DynamicStyle.register();


@customElement('m-betrayal-game')
export class BetrayalGamePage extends MimicElement {

	@state() protected tileSize = '200px';
	@state() protected boardSize = 100;
	@state() protected showHoverOutline = true;

	@state() protected hoverGridRow = 0;
	@state() protected hoverGridColumn = 0;

	@state() protected hoverGridTop = '0px';
	@state() protected hoverGridLeft = '0px';
	@query('main') protected mainEl?: HTMLElement;

	protected get dynamicStyles() {
		return {
			'main': {
				'--_game-size':       this.boardSize,
				'--_tile-size':       this.tileSize,
				'--_hover-grid-top':  this.hoverGridRow * parseInt(this.tileSize) + 'px',
				'--_hover-grid-left': this.hoverGridColumn * parseInt(this.tileSize) + 'px',
			},
		};
	}

	public override connectedCallback() {
		super.connectedCallback();

		this.addEventListener('wheel', this.handleZoomWheel);
		this.addEventListener('mousemove', this.handleHoverOutline);
	}

	public override afterConnectedCallback() {
		setTimeout(() => {
			this.scrollTop = (this.scrollHeight - this.offsetHeight) / 2;
			this.scrollLeft = (this.scrollWidth - this.offsetWidth) / 2;
		});
	}

	public override disconnectedCallback() {
		super.disconnectedCallback();
		this.removeEventListener('wheel', this.handleZoomWheel);
		this.removeEventListener('mousemove', this.handleHoverOutline);
	}

	protected handleZoomWheel = (ev: WheelEvent) => {
		if (!ev.ctrlKey)
			return;

		ev.preventDefault();
		if (ev.deltaY < 0)
			this.tileSize = roundToNearest((parseInt(this.tileSize) * 1.1), 5) + 'px';
		else
			this.tileSize = roundToNearest((parseInt(this.tileSize) * 0.9), 5) + 'px';

		this.showHoverOutline = false;
		this.debounceShowHoverOutline();
	};

	protected handleHoverOutline = (ev: MouseEvent) => {
		const mainRect = this.mainEl?.getBoundingClientRect();
		if (!mainRect)
			return;

		const x = ev.clientX - mainRect.x;
		const y = ev.clientY - mainRect.y;

		const tileSize = parseInt(this.tileSize);
		const rowIndex = Math.floor(y / tileSize);
		const columnIndex = Math.floor(x / tileSize);

		this.hoverGridRow = rowIndex;
		this.hoverGridColumn = columnIndex;
	};

	protected handleGameDragToMove = () => {
		const previousXY: [number | undefined, number | undefined] = [ undefined, undefined ];
		let xDiff = 0;
		let yDiff = 0;

		const mousemove = (ev: MouseEvent) => {
			if (ev.buttons < 1)
				return mouseup();

			xDiff = previousXY[0] ? ev.clientX - previousXY[0] : 0;
			yDiff = previousXY[1] ? ev.clientY - previousXY[1] : 0;

			previousXY[0] = ev.clientX;
			previousXY[1] = ev.clientY;

			this.scrollLeft -= xDiff;
			this.scrollTop -= yDiff;
		};

		const mouseup = () => {
			scrollElementTo(this, {
				x:        this.scrollLeft - (xDiff * 10),
				y:        this.scrollTop - (yDiff * 10),
				duration: 500,
			});

			window.removeEventListener('mousemove', mousemove);
			window.removeEventListener('mouseup', mouseup);
			previousXY[0] = undefined;
			previousXY[1] = undefined;
			xDiff = 0;
			yDiff = 0;
		};

		window.addEventListener('mousemove', mousemove);
		window.addEventListener('mouseup', mouseup);
	};

	protected debounceShowHoverOutline = debounce(() => this.showHoverOutline = true, 500);

	protected override render() {
		return html`
		<dynamic-style .styles=${ this.dynamicStyles }></dynamic-style>
		<main @mousedown=${ this.handleGameDragToMove }>
			<s-hover-tile class=${ classMap({ hide: !this.showHoverOutline }) }></s-hover-tile>
		</main>
		`;
	}

	public static override styles = [
		sharedStyles,
		css`
		:host {
			--_grid-color: rgb(200 200 200 / 25%);
			display: grid;
			overflow: scroll;

			touch-action: none;
			-webkit-overflow-scrolling: none;
			/*overflow: hidden;*/
			overscroll-behavior: none;
		}
		main {
			background-image:  linear-gradient(var(--_grid-color) 1px, transparent 1px),
				linear-gradient(to right, var(--_grid-color) 1px, transparent 1px);
			background-size: var(--_tile-size) var(--_tile-size);

			position: relative;
			display: grid;
			grid-template-rows: repeat(var(--_game-size), var(--_tile-size));
			grid-template-columns: repeat(var(--_game-size), var(--_tile-size));
			height: calc(var(--_game-size) * var(--_tile-size));
			width: calc(var(--_game-size) * var(--_tile-size));
		}
		s-hover-tile {
			position: absolute;
			display: block;

			outline: 5px dashed hotpink;

			top: var(--_hover-grid-top);
			left: var(--_hover-grid-left);

			height: var(--_tile-size);
			width: var(--_tile-size);
		}
		s-hover-tile.hide {
			visibility: hidden;
		}
		`,
	];

}
