import express from 'express';

import { mockError } from './controllers/mockErrorController';
export const mockErrorRouter: express.Router = express.Router();

mockErrorRouter.get('/error', mockError.defaultErrorHandler);
mockErrorRouter.post('/customerror', mockError.customErrorHandler);
mockErrorRouter.get('/pgerror', mockError.pgErrorHandler);
mockErrorRouter.get('/unerror', mockError.unknownErrorHandler);
mockErrorRouter.get('/zoderror', mockError.zodErrorHandler);
