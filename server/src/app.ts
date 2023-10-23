import { createServer } from 'node:http';

import cors from 'cors';
import express, { type Express } from 'express';
import { Server } from 'socket.io';


export const app: Express = express().use(cors());
export const server = createServer(app);
export const io: Server = new Server(server, {
	cors: {
		origin: '*',
	},
});
