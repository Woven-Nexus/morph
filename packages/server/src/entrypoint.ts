import { join, resolve } from 'node:path';

import { randomUUID } from 'crypto';
import express from 'express';

import { app, io, server } from './app.js';
import { allTiles } from './features/betrayal/all-tiles.js';
import { type GameState, gameState } from './features/betrayal/gamestate.js';
import betrayal from './features/betrayal/get-tile.js';
import { registerFileRoutes } from './utilities/register-file-routes.js';


// Root
app.use('/', express.static(join(resolve(), 'public')));

await registerFileRoutes('src/api', 'api');
await registerFileRoutes('src/client');

// Betrayal game
app.use('/api/betrayal', betrayal);
app.use('/assets/betrayal/tiles', express.static(join(resolve(), 'src/features/betrayal/assets/tiles')));

io.on('connection', socket => {
	console.log('a user connected');
	socket.on('disconnect', () => {
		console.log('user disconnected');
	});
});

io.of('/betrayal').on('connection', socket => {
	const state: GameState = {
		id:             randomUUID(),
		availableTiles: [ ...allTiles ],
	};
	gameState.set(state.id, state);

	socket.on('available-tile-amount', (arg, callback) => {
		callback(5);
	});

	socket.on('get-tile', (gameId, cb) => {
		cb(state.availableTiles.shift());
		console.log(state.availableTiles);

		//const state = gameState.get(gameId);
		//if (state)
		//socket.emit('assign-tile', state.availableTiles.shift());
	});

	socket.on('disconnect', () => {
		gameState.delete(state.id);
	});
});


const port = Number(process.env['PORT']);
const host = process.env['HOST'];
server.listen(port, host, () => {
	console.log(`⚡️[server]: Server is running at http://localhost:${ port }`);
});
