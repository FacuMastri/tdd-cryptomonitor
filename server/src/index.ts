import http from 'http';
import requestListener from './routes/';
import { loadUsers } from './users';
const PORT = 8080;

loadUsers('db/users.json');

http.createServer(requestListener).listen(PORT);

console.log(`Server running at http://localhost:${PORT}/`);
