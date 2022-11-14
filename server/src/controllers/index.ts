import { makeLoginController, makeVerifyJwtController } from './users';
import { createUserJwt, findUserByJwt } from '../users/';

export { makeVerifyJwtController } from './users';
export { verifyRulesBody } from './middleware';
export { verifyCredentialsBody } from './middleware';
export { verifyJwtHeader } from './middleware';
export { addRulesController, getRulesController } from './interpreter';

export const loginController = makeLoginController(createUserJwt);
export const verifyJwtController = makeVerifyJwtController(findUserByJwt);
