import type { SuccessBody } from '@shared/interfaces/IResponses';
import { RequestBodyPostUser } from '@shared/schemas/users/requestUserValidation';
import {
  InnerBodyPostUser,
  InnerBodyPostUserSchema,
} from '@shared/schemas/users/responseUserValidation';
import { Request, Response, NextFunction } from 'express';
import { QueryResult } from 'pg';

import { checkQueryResultError, zodValidationResult } from './helperCheckResultError';

import { pool } from '@/dotConfig';
import { createSuccessResponse, SuccessStatus } from '@/utils/createSuccessResponses';
import {
  BadRequestError,
  NotFoundError,
  ValidationError,
} from '@/utils/CustomErrorClasses';

/*
  A successful database result aka QueryResult<T> follows 4 types: a schema type, VetUserId, VetUser, PartialVetUserWithId.
  A schema is always used as the body´s inner data and can be used with QueryResult when we don´t need to do logic with some 
  property which is not included in the response´s body
*/

//just the id
interface VetUserId {
  readonly id: number;
}
//all user´s properties
interface VetUser {
  readonly id: number;
  readonly name: string;
  readonly lastName: string;
  readonly email: string;
  readonly password: string;
}

//id and more properties
type PartialVetUserWithId = Partial<VetUser> & VetUserId;

const resourceNotFound = 'User';

const checkIdIsValidString = (requestId: string | undefined, request: Request) => {
  if (requestId === '') {
    const emptyError = new ValidationError('Empty id', request.url);
    throw emptyError;
  } else if (requestId === undefined) {
    const undefinedError = new ValidationError('Undefined id', request.url);
    throw undefinedError;
  }
};

/**
 * Get the id sent by a request body or the path param if there is no body
 * argument passed in this function.
 * @param next
 * @param request
 * @param bodyId Optional. If not present, we use path params
 * @returns id:number or error
 */
function tryGetParamOrBodyId(next: NextFunction, request: Request, bodyId?: string) {
  try {
    const requestId = bodyId ? bodyId : request.params['id'];
    checkIdIsValidString(requestId, request);
    const id = parseInt(requestId as string);
    return id;
  } catch (error) {
    return next(error);
  }
}

const returnUserIdResponse = <T extends PartialVetUserWithId>(
  response: Response<SuccessBody<VetUserId>>,
  results: QueryResult<T>,
  request: Request,
  next: NextFunction,
) => {
  checkQueryResultError(results, request, next, resourceNotFound);

  if (results?.rows[0]?.id) {
    const updatedUserId = results.rows[0].id;
    //TODO try/catch
    const successResponse = createSuccessResponse<VetUserId>(response, SuccessStatus.OK, {
      id: updatedUserId,
    });
    return successResponse;
  }

  return next(new NotFoundError('Id', request.url));
};

const getUsers = (
  request: Request,
  response: Response<SuccessBody<VetUser[]>>,
  next: NextFunction,
) => {
  const query = 'SELECT * FROM users ORDER BY id ASC';
  pool.query(query, (error, results: QueryResult<VetUser>) => {
    if (error) {
      return next(error);
    }
    if (results.rows.length === 0) {
      return next(new NotFoundError(request.url, 'Users'));
    }
    //TODO try/catch
    const resBody: VetUser[] = results.rows;
    return createSuccessResponse<VetUser[]>(response, SuccessStatus.OK, resBody);
  });
};
/**
 * The result is a partial VetUser because we don´t want
 * always all the fields but at least the id.
 *
 * @param query
 * must be send in the specific route and determinate the type of select,
 * and the number of where´s fields must match with the number of elements
 * in array values
 * @param value
 * an array of string or number, the length must be equal to the number
 * of fields passed in the where clause
 * @param callback
 * call a different path according if we receive an error or a resolve
 */
function getUserByDynamicsField(
  query: string,
  value: (string | number)[],
  callback: (
    error: Error | null,
    result: QueryResult<PartialVetUserWithId> | null,
  ) => void,
) {
  pool.query(query, value, (error, results) => {
    //TODO: decide if change to try/catch
    if (error) {
      callback(error, null);
    } else {
      callback(null, results);
    }
  });
}

/*get one user by id
get the custom id parameter by the URL
$1 is a numbered placeholder that PostgreSQL uses natively instead of the ?
*/
const getUserById = (
  request: Request,
  response: Response<SuccessBody<VetUserId>>,
  next: NextFunction,
) => {
  const id = tryGetParamOrBodyId(next, request);
  if (!id) {
    return next(new BadRequestError(request.url));
  }
  const query = `SELECT * FROM users WHERE id = $1`;
  getUserByDynamicsField(query, [id], (error, results) => {
    if (error) {
      return next(error);
    }
    checkQueryResultError(results, request, next, resourceNotFound);

    return returnUserIdResponse(response, results!, request, next);
  });
};

type RequestBodyLogin = { password: string; email: string };
type DataBodyUserByEmail = { email: string | undefined; id: number };
const getLogin = (
  request: Request,
  response: Response<SuccessBody<DataBodyUserByEmail>>,
  next: NextFunction,
) => {
  const { password, email } = <RequestBodyLogin>request.body;
  if (!password || !email) {
    return next(new ValidationError('Login fields', request.url));
  }

  const query = `SELECT id, email FROM users WHERE email = $1 and password = $2`;
  getUserByDynamicsField(query, [email, password], (error, results) => {
    if (!results) {
      return next(error);
    } else {
      checkQueryResultError(results, request, next, resourceNotFound);
      try {
        const resBody = {
          email: results.rows[0]!.email,
          id: results.rows[0]!.id,
        };
        return createSuccessResponse<DataBodyUserByEmail>(
          response,
          SuccessStatus.OK,
          resBody,
        );
      } catch (error) {
        return next(error);
      }
    }
  });
};

//z.util.assertEqual<oldRequestBodyNewUser, z.infer<typeof UserValidationSchema>>(true);

//type InnerBodyPostUser = { id: number }; use also with QueryResult because we don´t need to do logic with a complete VetUser
const postUser = async (
  request: Request,
  response: Response<SuccessBody<InnerBodyPostUser>>,
  next: NextFunction,
) => {
  try {
    const { firstName, lastName, email, password } = <RequestBodyPostUser>request.body;
    const query =
      'INSERT INTO users (name, lastname, email, password) VALUES ($1, $2, $3, $4) RETURNING id';
    const results: QueryResult<InnerBodyPostUser> = await pool.query(query, [
      firstName,
      lastName,
      email,
      password,
    ]);

    checkQueryResultError(results, request, next, resourceNotFound);
    zodValidationResult(next, results, InnerBodyPostUserSchema);

    const bodyData: InnerBodyPostUser = { id: results.rows[0]!.id };
    const bodyMessage = 'User added';
    return createSuccessResponse(response, SuccessStatus.OK, bodyData, bodyMessage);
  } catch (error) {
    return next(error);
  }
};

// TODO: decide approach  in getEmail and in the post, between CreateUser and returnUserIdResponse
type RequestBodyConfirmEmail = { id: string; email: string };
type DataBodyConfirmEmail = { email: string };
const getConfirmEmail = (
  request: Request,
  response: Response<SuccessBody<DataBodyConfirmEmail>>,
  next: NextFunction,
) => {
  const { id, email } = <RequestBodyConfirmEmail>request.body;
  if (!id || !email) {
    return next(new ValidationError('Body request', request.url));
  }

  const query = `SELECT id, email FROM users WHERE id = $1 and email = $2`;
  getUserByDynamicsField(query, [id, email], (error, results) => {
    if (!results) {
      return next(error);
    }
    checkQueryResultError(results, request, next, resourceNotFound);
    //ensure body input and result email are equal
    if (email.toLowerCase() === results.rows[0]?.email?.toLowerCase()) {
      const resBody = { email: results.rows[0].email };
      //TODO: try/catch
      return createSuccessResponse(response, SuccessStatus.OK, resBody);
    }

    return next(new Error('Critical email error'));
  });
};

type RequestBodyUpdate = {
  id: string;
  newPassword: string;
};
const updateUserPassword = async (
  request: Request,
  response: Response<SuccessBody<VetUserId>>,
  next: NextFunction,
) => {
  const { id, newPassword } = <RequestBodyUpdate>request.body;
  if (!id || !newPassword) {
    return next(new ValidationError('Update user fields', request.url));
  }
  const checkId = tryGetParamOrBodyId(next, request, id);
  try {
    const query = 'UPDATE users SET password = $1 WHERE id = $2 RETURNING id';
    const results: QueryResult<PartialVetUserWithId> = await pool.query(query, [
      newPassword,
      checkId,
    ]);
    return returnUserIdResponse(response, results, request, next);
  } catch (error) {
    return next(error);
  }
};

const deleteUser = async (
  request: Request,
  response: Response<SuccessBody<VetUserId>>,
  next: NextFunction,
) => {
  const id = tryGetParamOrBodyId(next, request);
  try {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING id';
    const results: QueryResult<PartialVetUserWithId> = await pool.query(query, [id]);
    return returnUserIdResponse(response, results, request, next);
  } catch (error) {
    return next(error);
  }
};

export const db = {
  getUsers,
  createUser: postUser,
  getUserById,
  putUser: updateUserPassword,
  deleteUser,
  getConfirmEmail,
  getLogin,
};
