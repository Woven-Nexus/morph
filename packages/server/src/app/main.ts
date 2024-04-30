import './env.js';

import { createServer } from 'node:http';

import cors from 'cors';
import dotenv from 'dotenv';
import express, { type Express } from 'express';
import { WebSocketServer } from 'ws';


dotenv.config();


export const app: Express = express()
	.use(cors())
	.use(express.json());


export const server = createServer(app);


export const wss = new WebSocketServer({ server });
