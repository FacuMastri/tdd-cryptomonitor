import express, { Express } from 'express';
import { loadUsers } from './users';
import Server from './server';

const PORT = 8080;

loadUsers('db/users.json');

const app: Express = express();
const server: Server = new Server(app, PORT);
server.start();
