import { makeLoginController, makeVerifyJwtController } from './users';
import { createUserJwt, findUserByJwt } from '../users/';
import { makeAddRulesController, makeGetRulesController } from './interpreter';

export { makeGetRulesController } from './interpreter';
export { makeAddRulesController } from './interpreter';
export { makeVerifyJwtController } from './users';
export { verifyRulesBody } from './middleware';
export { verifyCredentialsBody } from './middleware';
export { verifyJwtHeader } from './middleware';

export const loginController = makeLoginController(createUserJwt);
export const verifyJwtController = makeVerifyJwtController(findUserByJwt);
export const getRulesController = makeGetRulesController(findUserByJwt);
export const addRulesController = makeAddRulesController(findUserByJwt);
