import { RequestBodyPostUserSchema } from '@shared/schemas/users/requestUserValidation';
import express from 'express';

import { db } from './controllers/userController';
import { validateBody } from '../middleware/validationMiddleware';

import { asyncWrapper } from '@/utils/asyncHandler';

export const userRouter: express.Router = express.Router();

userRouter.get('/all', db.getUsers);
userRouter.get('/:id', db.getUserById);
userRouter.post(
  '/register',
  validateBody(RequestBodyPostUserSchema),
  asyncWrapper(db.createUser),
);
userRouter.post('/confirmEmail', db.getConfirmEmail); //post because we need the body to send sensible data
userRouter.post('/login', db.getLogin); //post because we need the body to send sensible data
userRouter.put('/', asyncWrapper(db.putUser)); //after confirm an email and receive the message in that email
userRouter.delete('/:id', asyncWrapper(db.deleteUser));
