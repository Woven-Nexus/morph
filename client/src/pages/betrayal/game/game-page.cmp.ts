import { SignalWatcher } from '@lit-labs/preact-signals';
import { range } from '@roenlie/mimic-core/array';
import { domId } from '@roenlie/mimic-core/dom';
import { customElement, MimicElement } from '@roenlie/mimic-lit/element';
import { css, html } from 'lit';
import { query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { map } from 'lit/directives/map.js';
import { styleMap } from 'lit/directives/style-map.js';
import { when } from 'lit/directives/when.js';
import { Socket } from 'socket.io-client';

import { DynamicStyle } from '../../../features/components/dynamic-style/dynamic-style.cmp.js';
import { manager } from '../../../features/socketio/manager.js';
import { sharedStyles } from '../../../features/styles/shared-styles.js';
import { BoardConfig } from './board-config.ts.js';

DynamicStyle.register();


interface Tile {
	id: string;
	row: number;
	column: number;
	rotate: number;
	connection: ('top' | 'bottom' | 'left' | 'right')[];
	locked: boolean;
	floor: 0 | 1 | 2;
	img: string;
}

interface TileDTO {
	connection: ('top' | 'bottom' | 'left' | 'right')[];
	floor: (0 | 1 | 2)[];
	name: string;
	img: string;
}


@SignalWatcher
@customElement('m-betrayal-game')
export class BetrayalGamePage extends MimicElement {

	@query('main') protected mainEl?: HTMLElement;
	@state() protected floor: [Tile[], Tile[], Tile[]] = [
		[],
		[],
		[],
	];

	@state() protected bottomFloorTiles: Tile[] = [];
	@state() protected firstFloorTiles: Tile[] = [];
	@state() protected secondFloorTiles: Tile[] = [];
	protected socket: Socket;
	protected readonly boardConfig = new BoardConfig();

	public override connectedCallback() {
		super.connectedCallback();

		this.socket = manager.socket('/betrayal');
		//this.socket.emit('available-tile-amount', '', (response: any) => {
		//	console.log(response); // "got it"
		//});

		this.socket.emit('get-tile', '', (tile: TileDTO) => {
			this.floor[1].push({
				column:     15,
				row:        15,
				connection: tile.connection,
				floor:      1,
				id:         domId(),
				img:        tile.img,
				locked:     false,
				rotate:     0,
			});
			this.firstFloorTiles = [ ...this.firstFloorTiles ];
		});

		setTimeout(() => this.boardConfig.connect(this, this.mainEl!));
	}

	public override disconnectedCallback() {
		super.disconnectedCallback();
		this.socket.disconnect();
	}

	protected doorLocation(con: 'top' | 'bottom' | 'left' | 'right') {
		return con === 'top' ? {
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
		} : {};
	}

	protected isDoorConnected(tile: Tile, door: Tile['connection'][number]) {
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

		const indexOfCon = dir.indexOf(door);
		const checkRow = [ 0, -1, 0, 1 ];
		const checkColumn = [ -1, 0, 1, 0 ];

		const columnStart = tile.column + checkColumn[indexOfCon]!;
		const rowStart = tile.row + checkRow[indexOfCon]!;

		const doesTileExist = this.floor[tile.floor]
			.some(tile => tile.column === columnStart && tile.row === rowStart);

		return { doesTileExist, columnStart, rowStart };
	}

	protected Tile(tile: Tile) {
		return html`
		<s-tile style=${ styleMap({
			gridRow:    tile.row + '/' + (tile.row + 1),
			gridColumn: tile.column + '/' + (tile.column + 1),
			transform:  'rotate(' + tile.rotate + 'deg)',
		}) }>
			<img src=${ tile.img }></img>
			${ map(tile.connection, con => html`
			<s-door
				@click=${ () => {
					const { doesTileExist, rowStart, columnStart } = this.isDoorConnected(tile, con);
					if (doesTileExist)
						return;

					this.socket.emit('get-tile', '', (res?: TileDTO) => {
						if (!res)
							return;

						tile.locked = true;
						this.floor[tile.floor].push({
							row:        rowStart,
							column:     columnStart,
							floor:      tile.floor,
							connection: res.connection,
							id:         domId(),
							img:        res.img,
							locked:     false,
							rotate:     0,
						});

						this.floor = [ ...this.floor ];
					});
				} }
				style=${ styleMap({
					...this.doorLocation(con),
					display: this.isDoorConnected(tile, con).doesTileExist && tile.locked ? 'none' : 'initial',
				}) }
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
		<dynamic-style .styles=${ this.boardConfig.styles }></dynamic-style>
		<main>
			<s-hover-tile class=${ classMap({ hide: !this.boardConfig.showHoverOutline.value }) }></s-hover-tile>
			${ map(
				this.floor.flat(2),
				tile => this.Tile(tile),
			) }
		</main>

		<s-tile-stack>
		</s-tile-stack>
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
		s-tile img {
			height: var(--_tile-size);
			width: var(--_tile-size);
			grid-row: 1/8;
			grid-column: 1/8;
			object-fit: fill;
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
		css`
		s-tile-stack {
			position: fixed;
			top: 25px;
			right: 25px;

			height: 200px;
			width: 100px;
			background-color: hotpink;
		}
		`,
	];

}
