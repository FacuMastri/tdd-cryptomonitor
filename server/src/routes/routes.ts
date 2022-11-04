import http from 'http';

type Req = http.IncomingMessage;
type Res = http.ServerResponse; //http.ServerResponse<http.IncomingMessage> & {req: http.IncomingMessage;}
type Handler = (req: Req, res: Res) => void;

type AddRoute = (method: string, path: string, handler: Handler) => void;

type Route = {
  method: string;
  path: string;
  handler: Handler;
};

const routes: Route[] = [];

const addRoute: AddRoute = (method: string, path: string, handler: Handler) => {
  // Routes are added to the front of the array so that the most recently added routes are checked first.
  // Thus more general routes should be added first, and more specific routes should be added last.
  routes.unshift({ method, path, handler });
};

const requestListener: Handler = (req: Req, res: Res) => {
  // Returns if a path matches a route that can contain a wildcard w/ regex
  const urlMatch = (path: string, route: string): boolean =>
    new RegExp(`^${route.replace(/\*/g, '.*')}$`).test(path);

  // Returns the route that matches the request
  const route = routes.find(
    (r) => r.method === req.method && urlMatch(req.url ?? '', r.path)
  );

  if (route) {
    route.handler(req, res);
  } else {
    console.log('No route found', req.method, req.url);
    res.statusCode = 404;
    res.end();
  }
};

const getBody = async (req: Req): Promise<string> => {
  const body: Uint8Array[] = [];
  return new Promise((resolve, reject) => {
    req
      .on('data', (chunk) => {
        body.push(chunk);
      })
      .on('end', () => {
        const parsedBody = Buffer.concat(body).toString();
        resolve(parsedBody);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
};

addRoute('GET', '/*', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('Hello World!');
  console.log('Routes', routes);
});

export type { Req, Res, AddRoute, Handler };
export { addRoute, getBody };
export default requestListener;
