import requestListener, { addRoute } from './routes';
import addInterpreterRoutes from './interpreter';

addInterpreterRoutes(addRoute);

export { addRoute };
export default requestListener;
