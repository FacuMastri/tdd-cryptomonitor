import express, { Express } from 'express';
import { loadUsers } from './users';
import Server from './server';
import { loadContext } from './controllers/interpreter';
import { PORT } from './config';

loadUsers('db/users.json');
loadContext('db/context.json');

const app: Express = express();
const server: Server = new Server(app, Number(PORT));
server.start();
