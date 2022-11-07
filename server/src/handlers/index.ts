import { makeLoginController, makeVerifyJwtController } from './users';
import { createUserJwt, findUserByJwt } from '../users/';

export { getRulesHandler } from './interpreter';
export { addRulesHandler } from './interpreter';
export { makeVerifyJwtController } from './users';
export { verifyRulesBody } from './middleware';
export { verifyCredentialsBody } from './middleware';
export { verifyJwtHeader } from './middleware';

export const loginController = makeLoginController(createUserJwt);
export const verifyJwtController = makeVerifyJwtController(findUserByJwt);
