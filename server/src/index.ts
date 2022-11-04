import http from 'http';
import requestListener from './routes/';
const PORT = 8080;

http.createServer(requestListener).listen(PORT);

console.log(`Server running at http://localhost:${PORT}/`);
