import express, { Express } from 'express';
import { loadUsers } from './users';
import Server from './server';
import { PORT } from './config';
import { loadContext } from './context';

export const users_db = loadUsers('db/users.json');
export const context_db = loadContext('db/context.json');

const app: Express = express();
const server: Server = new Server(app, Number(PORT));
server.start();
