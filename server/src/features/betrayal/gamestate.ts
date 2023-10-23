import type { Tile } from './all-tiles.js';


export interface GameState {
	id: string;
	availableTiles: Tile[];
}


export const gameState = new Map<string, GameState>();
