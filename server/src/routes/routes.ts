import http from 'http';

type Req = http.IncomingMessage;
type Res = http.ServerResponse; //http.ServerResponse<http.IncomingMessage> & {req: http.IncomingMessage;}
type Handler = (req: Req, res: Res) => Promise<void>;

class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.status = status;
  }
}

type AddRoute = (method: string, path: string, handler: Handler) => void;

type Route = {
  method: string;
  path: string;
  handler: Handler;
};

const routes: Route[] = [];

const headers = {
  'Content-Type': 'text/html',
  'Access-Control-Allow-Origin': '*' /* @dev First, read about security */,
  'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
  'Access-Control-Max-Age': 2592000, // 30 days
  // Make it work :)
  'Access-Control-Allow-Headers':
    'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, jwt'
};
const jsonHeaders = {
  ...headers,
  'Content-Type': 'application/json'
};

const resText = (res: Res, text: string, status = 200) => {
  res.writeHead(status, headers);
  res.end(text);
};

const resJson = (res: Res, json: any, status = 200) => {
  res.writeHead(status, jsonHeaders);
  res.end(JSON.stringify(json));
};

const addRoute: AddRoute = (method: string, path: string, handler: Handler) => {
  // Routes are added to the front of the array so that the most recently added routes are checked first.
  // Thus more general routes should be added first, and more specific routes should be added last.
  routes.unshift({ method, path, handler });
};

const requestListener: Handler = async (req: Req, res: Res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, headers);
    res.end('Ok');
    return;
  }

  // Returns if a path matches a route that can contain a wildcard w/ regex
  const urlMatch = (path: string, route: string): boolean =>
    new RegExp(`^${route.replace(/\*/g, '.*')}$`).test(path);

  // Returns the route that matches the request
  const route = routes.find(
    (r) => r.method === req.method && urlMatch(req.url ?? '', r.path)
  );

  const returnError = (err: HttpError) => {
    const code = err?.status ?? 500;
    res.writeHead(code, headers);
    res.end(err.message);
  };

  if (!route) {
    return returnError(new HttpError(404, 'Not Found'));
  }

  route.handler(req, res).catch((err) => {
    returnError(err);
  });
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

addRoute('GET', '/*', async (req, res) => {
  res.writeHead(200, headers);
  res.end('Hello World!');
  console.log('Routes', routes);
});

export type { Req, Res, AddRoute, Handler };
export { HttpError, resText, resJson };
export { addRoute, getBody };
export default requestListener;
