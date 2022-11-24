import express, { Express } from 'express';
import Server from './server';
import { PORT } from './config';
import swaggerUi from 'swagger-ui-express';
import openapiSpecification from './openapi.json';

const app: Express = express();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));
const server: Server = new Server(app, Number(PORT));
server.start();

console.log('Server started on port ' + PORT);
