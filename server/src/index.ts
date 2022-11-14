import express, { Express } from 'express';
import { loadUsers } from './users';
import Server from './server';
import { loadContext } from './controllers/interpreter';

const PORT = 8080;

loadUsers('db/users.json');
loadContext('db/context.json');

const app: Express = express();
const server: Server = new Server(app, PORT);
server.start();
