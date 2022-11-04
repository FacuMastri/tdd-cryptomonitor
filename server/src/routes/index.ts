import requestListener, { addRoute } from './routes';
import addInterpreterRoutes from './interpreter';
import addUsersRoutes from './users';

addInterpreterRoutes(addRoute);
addUsersRoutes(addRoute);

export { addRoute };
export default requestListener;
