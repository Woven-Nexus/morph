import './env.js';

import { createServer } from 'node:http';

import cors from 'cors';
import dotenv from 'dotenv';
import express, { type Express } from 'express';
import { Server } from 'socket.io';

import { auth } from '../features/auth/auth-middleware.js';

dotenv.config();


export const app: Express = express()
	.use(cors())
	.use(express.json())
	.use(auth);


export const server = createServer(app);
export const io: Server = new Server(server, {
	cors: {
		origin: '*',
	},
});
