import { createServer } from 'node:http';

import cors from 'cors';
import dotenv from 'dotenv';
import express, { type Express } from 'express';
import { Server } from 'socket.io';

import { jsonParser } from './utilities/body-parser.js';


dotenv.config();


export const app: Express = express()
	.use(cors())
	.use(jsonParser);


export const server = createServer(app);
export const io: Server = new Server(server, {
	cors: {
		origin: '*',
	},
});
