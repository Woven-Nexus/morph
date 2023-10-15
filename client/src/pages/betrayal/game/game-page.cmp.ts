import { range } from '@roenlie/mimic-core/array';
import { customElement, MimicElement } from '@roenlie/mimic-lit/element';
import { css, html } from 'lit';
import { state } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';

import { sharedStyles } from '../../../features/styles/shared-styles.js';
import { DynamicStyle } from '../../studio2/dynamic-style.cmp.js';

DynamicStyle.register();


@customElement('m-betrayal-game')
export class BetrayalGamePage extends MimicElement {

	@state() protected tileSize = '200px';
	@state() protected boardSize = 100;
	@state() protected hoverGridTop = '0px';
	@state() protected hoverGridLeft = '0px';

	protected get dynamicStyles() {
		return {
			'main': {
				'--_game-size':       this.boardSize,
				'--_tile-size':       this.tileSize,
				'--_hover-grid-top':  this.hoverGridTop,
				'--_hover-grid-left': this.hoverGridLeft,
			},
		};
	}

	public override connectedCallback() {
		super.connectedCallback();

		this.addEventListener('wheel', (ev: WheelEvent) => {
			if (!ev.ctrlKey)
				return;

			ev.preventDefault();
			if (ev.deltaY < 0)
				this.tileSize = (parseInt(this.tileSize) + 1) + 'px';
			else
				this.tileSize = (parseInt(this.tileSize) - 1) + 'px';
		});

		this.addEventListener('mousemove', (ev: MouseEvent) => {
			const mainRect = this.renderRoot.querySelector('main')?.getBoundingClientRect();
			if (!mainRect)
				return;

			const x = ev.clientX - mainRect.x;
			const y = ev.clientY - mainRect.y;

			const tileSize = parseInt(this.tileSize);
			const rowIndex = Math.floor(y / tileSize);
			const columnIndex = Math.floor(x / tileSize);

			this.hoverGridTop = (rowIndex * tileSize) + 'px';
			this.hoverGridLeft = (columnIndex * tileSize) + 'px';
		});
	}

	public override afterConnectedCallback() {
		setTimeout(() => {
			this.scrollTop = (this.scrollHeight - this.offsetHeight) / 2;
			this.scrollLeft = (this.scrollWidth - this.offsetWidth) / 2;
		});
	}

	protected override render() {
		return html`
		<dynamic-style .styles=${ this.dynamicStyles }></dynamic-style>
		<main>
			<s-hover-tile></s-hover-tile>
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
			background-color: hotpink;

			top: var(--_hover-grid-top);
			left: var(--_hover-grid-left);

			height: var(--_tile-size);
			width: var(--_tile-size);
		}
		`,
	];

}
