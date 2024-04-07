import './env.js';
import '../client/assets/server-element.js';

import { createServer } from 'node:http';

import cors from 'cors';
import dotenv from 'dotenv';
import express, { type Express } from 'express';
import { Server } from 'socket.io';

dotenv.config();


export const app: Express = express()
	.use(cors())
	.use(express.json());


export const server = createServer(app);
export const io: Server = new Server(server, {
	cors: {
		origin: '*',
	},
});
