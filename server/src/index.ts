import express, { Express } from 'express';
import Server from './server';
import { PORT } from './config';

const app: Express = express();
const server: Server = new Server(app, Number(PORT));
server.start();
