import { range } from '@roenlie/mimic-core/array';
import { domId } from '@roenlie/mimic-core/dom';
import { debounce } from '@roenlie/mimic-core/timing';
import { customElement, MimicElement } from '@roenlie/mimic-lit/element';
import { css, html } from 'lit';
import { query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { map } from 'lit/directives/map.js';
import { styleMap } from 'lit/directives/style-map.js';
import { when } from 'lit/directives/when.js';

import { roundToNearest } from '../../../app/round-to-nearest.js';
import { scrollElementTo } from '../../../app/scroll-element-to.js';
import { sharedStyles } from '../../../features/styles/shared-styles.js';
import { DynamicStyle } from '../../studio2/dynamic-style.cmp.js';

DynamicStyle.register();


interface Tile {
	id: string;
	row: number;
	column: number;
	rotate: number;
	connection: ('top' | 'bottom' | 'left' | 'right')[];
	locked: boolean;
	floor: 0 | 1 | 2;
}


@customElement('m-betrayal-game')
export class BetrayalGamePage extends MimicElement {

	@state() protected tileSize = '200px';
	@state() protected boardSize = 100;
	@state() protected showHoverOutline = true;
	@state() protected hoverGridRow = 0;
	@state() protected hoverGridColumn = 0;
	@state() protected bottomFloorTiles: Tile[] = [
		{
			id:         domId(5),
			column:     19,
			row:        49,
			rotate:     0,
			connection: [ 'left', 'top', 'right', 'bottom' ],
			locked:     true,
			floor:      0,
		},
	];

	@state() protected firstFloorTiles: Tile[] = [
		{
			id:         domId(5),
			column:     49,
			row:        49,
			rotate:     0,
			connection: [ 'left', 'top', 'right' ],
			locked:     true,
			floor:      1,
		},
	];

	@state() protected secondFloorTiles: Tile[] = [
		{
			id:         domId(5),
			column:     79,
			row:        49,
			rotate:     0,
			connection: [ 'left', 'top', 'right' ],
			locked:     true,
			floor:      2,
		},
	];

	protected availableTiles: Tile[] = range(100).map(() => ({
		column:     0,
		row:        0,
		id:         domId(5),
		locked:     false,
		rotate:     0,
		connection: (() => {
			const arr = [ 'left', 'top', 'right', 'bottom' ] as
				('top' | 'bottom' | 'left' | 'right')[];
			arr.length = Math.floor(Math.random() * 4) + 1;

			return arr;
		})(),
		floor: 1,
	}));

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

	protected handleZoomWheel = async (ev: WheelEvent) => {
		if (!ev.ctrlKey)
			return;

		ev.preventDefault();

		const topScroll = this.scrollHeight;
		const leftScroll = this.scrollWidth;

		if (ev.deltaY < 0)
			this.tileSize = roundToNearest((parseInt(this.tileSize) * 1.1), 5) + 'px';
		else
			this.tileSize = roundToNearest((parseInt(this.tileSize) * 0.9), 5) + 'px';

		this.showHoverOutline = false;
		this.debounceShowHoverOutline();

		await this.updateComplete;

		this.scrollTop -= (topScroll - this.scrollHeight) / 2;
		this.scrollLeft -= (leftScroll - this.scrollWidth) / 2;
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

	protected handleGameDragToMove = (ev: MouseEvent) => {
		ev.preventDefault();
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
				duration: 300,
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

	protected Tile(tile: Tile) {
		return html`
		<s-tile style=${ styleMap({
			gridRow:    tile.row + '/' + (tile.row + 1),
			gridColumn: tile.column + '/' + (tile.column + 1),
			transform:  'rotate(' + tile.rotate + 'deg)',
		}) }>
			${ map(tile.connection, con => html`
			<s-door
				@click=${ () => {
					console.log('go in the door!');

					const dir = [ 'left', 'top', 'right', 'bottom' ];
					const shuffle = tile.rotate === 0 ? 0
						: tile.rotate === 90 ? 1
						: tile.rotate === 180 ? 2
						: tile.rotate === 270 ? 3
						: 0;

					range(shuffle).forEach(() => {
						const item = dir.pop()!;
						dir.unshift(item);
					});

					const indexOfCon = dir.indexOf(con);

					const checkRow = [ 0, -1, 0, 1 ];
					const checkColumn = [ -1, 0, 1, 0 ];

					const newColumnStart = tile.column + checkColumn[indexOfCon]!;
					const newRowStart = tile.row + checkRow[indexOfCon]!;

					const doesTileExist = this.firstFloorTiles
						.some(tile => tile.column === newColumnStart && tile.row === newRowStart);

					if (!doesTileExist) {
						const newTile = this.availableTiles.pop();
						if (newTile) {
							newTile.row = newRowStart;
							newTile.column = newColumnStart;
							newTile.floor = tile.floor;
							this.firstFloorTiles.push(newTile);
							this.firstFloorTiles = [ ...this.firstFloorTiles ];
						}
					}
				} }
				style=${ styleMap(
					con === 'top' ? {
						gridRow:    '1/3',
						gridColumn: '4/5',
					} : con === 'bottom' ? {
						gridRow:    '6/8',
						gridColumn: '4/5',
					} : con === 'left' ? {
						gridRow:    '4/5',
						gridColumn: '1/3',
					} : con === 'right' ? {
						gridRow:    '4/5',
						gridColumn: '6/8',
					} : {},
				) }
			></s-door>
			`) }
			${ when(!tile.locked, () => html`
			<s-rotate
				@click=${ () => {
					tile.rotate = (tile.rotate + 90) % 360;

					this.requestUpdate();
				} }
			></s-rotate>
			`) }
		</s-tile>
		`;
	}


	protected override render() {
		return html`
		<dynamic-style .styles=${ this.dynamicStyles }></dynamic-style>
		<main @mousedown=${ this.handleGameDragToMove }>
			<s-hover-tile class=${ classMap({ hide: !this.showHoverOutline }) }></s-hover-tile>
			${ map(
				[
				...this.firstFloorTiles,
				...this.bottomFloorTiles,
				...this.secondFloorTiles,
				],
				tile => this.Tile(tile),
			) }
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
			overscroll-behavior: none;
			/*overflow: hidden;*/
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

			/*outline: 5px dashed hotpink;*/
			top: var(--_hover-grid-top);
			left: var(--_hover-grid-left);
			height: var(--_tile-size);
			width: var(--_tile-size);
		}
		s-hover-tile.hide {
			visibility: hidden;
		}
		s-tile {
			display: block;
			background-color: forestgreen;
			display: grid;
			grid-template-rows: 5% 5% 25% 1fr 25% 5% 5%;
			grid-template-columns: 5% 5% 25% 1fr 25% 5% 5%;
		}
		s-door {
			background-color: hotpink;
		}
		s-door:hover {
			background-color: red;
		}
		s-rotate {
			grid-row: 4/5;
			grid-column: 4/5;
			background-color: blue;
		}
		`,
	];

}
