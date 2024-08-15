import { Request, Response, NextFunction } from 'express';
import { QueryResult } from 'pg';

import { pool } from '../dotConfig';

interface VetUserId {
  readonly id: number;
}
interface VetUser {
  readonly id: number;
  readonly name: string;
  readonly lastName: string;
  readonly email: string;
  readonly password: string;
}

type PartialVetUserWithId = Partial<VetUser> & VetUserId;

const checkIdIsValid = (requestId: string | undefined, next: NextFunction) => {
  if (requestId === '') {
    const emptyError = new Error('empty id');
    return next(emptyError);
  } else if (requestId === undefined) {
    const undefinedError = new Error('undefined id');
    return next(undefinedError);
  }
};

function tryGetParamOrBodyId(next: NextFunction, request: Request): number;
function tryGetParamOrBodyId(next: NextFunction, bodyId: string): number;
function tryGetParamOrBodyId(next: NextFunction, requestOrBodyId?: Request | string) {
  const isString = typeof requestOrBodyId === 'string';
  const requestId = isString ? requestOrBodyId : requestOrBodyId?.params['id'];
  checkIdIsValid(requestId, next);
  const id = parseInt(requestId as string);
  return id;
}

const returnUserIdResponse = <T extends PartialVetUserWithId>(
  response: Response,
  results: QueryResult<T> | undefined | null,
  idForSearch: number,
) => {
  //results.rows.length > 0
  if (results?.rows[0] && results.rows.length > 0) {
    const updatedUserId = results.rows[0].id;
    response.status(200).json({ message: `User modified with ID: ${updatedUserId}` });
  }

  response
    .status(404)
    .json({ message: `User not found or not modified with id: ${idForSearch} ` });
};

const getUsers = (_request: Request, response: Response, next: NextFunction) => {
  pool.query(
    'SELECT * FROM users ORDER BY id ASC',
    (error, results: QueryResult<VetUser>) => {
      if (error) {
        return next(error);
      }
      if (results.rows) {
        response.status(200).json(results.rows);
      }

      response.status(404).json({ message: `Users not found` });
    },
  );
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
const getUserById = (request: Request, response: Response, next: NextFunction) => {
  const id = tryGetParamOrBodyId(next, request);
  const query = `SELECT * FROM users WHERE id = $1`;
  getUserByDynamicsField(query, [id], (error, results) => {
    if (error) {
      return next(error);
    }
    returnUserIdResponse(response, results, id);
  });
};

// TODO: decide approach  in getEmail and in the post, between CreateUser and returnUserIdResponse
type FrontConfirmEmail = { id: string; email: string };
const getConfirmEmail = (request: Request, response: Response, next: NextFunction) => {
  const { id, email } = <FrontConfirmEmail>request.body;
  if (!id || !email) return next(new Error('incorrect body request'));

  const query = `SELECT id, email FROM users WHERE id = $1 and email = $2`;
  getUserByDynamicsField(query, [id, email], (error, results) => {
    if (error) {
      return next(error);
    }

    if (email === results?.rows[0]?.email?.toLowerCase()) {
      response.status(200).json({ email: results.rows[0].email });
    }
    response.status(200).json({ email: false });
  });
};

type FrontNewUser = { name: string; lastName: string; email: string; password: string };
const postUser = (request: Request, response: Response, next: NextFunction) => {
  //console.log(request.body);
  const { name, lastName, email, password } = <FrontNewUser>request.body;

  pool.query(
    'INSERT INTO users (name, lastname, email, password) VALUES ($1, $2, $3, $4) RETURNING *',
    [name, lastName, email, password],
    (error, results: QueryResult<VetUser>) => {
      if (error) {
        return next(error);
      }
      const id = results.rows[0]?.id;
      if (id === undefined) {
        return next(new Error('id undefined'));
      }
      response.status(201).json({ message: `User added with ID: ${id}` });
    },
  );
};

const updateUserPassword = (request: Request, response: Response, next: NextFunction) => {
  const { id, newPassword } = <
    {
      id: string;
      newPassword: string;
    }
  >request.body;
  if (!id || !newPassword) {
    return response.status(400).json({ message: 'Invalid input' });
  }
  const checkId = tryGetParamOrBodyId(next, id);

  pool.query(
    'UPDATE users SET password = $1 WHERE id = $2',
    [newPassword, checkId],
    (error, results: QueryResult<PartialVetUserWithId>) => {
      if (error) {
        return next(error);
      }
      returnUserIdResponse(response, results, checkId);
    },
  );
};

const deleteUser = (request: Request, response: Response, next: NextFunction) => {
  const id = tryGetParamOrBodyId(next, request);
  pool.query(
    'DELETE FROM users WHERE id = $1',
    [id],
    (error, results: QueryResult<VetUser>) => {
      if (error) {
        return next(error);
      }
      returnUserIdResponse(response, results, id);
    },
  );
};

export const db = {
  getUsers,
  createUser: postUser,
  getUserById,
  putUser: updateUserPassword,
  deleteUser,
  getConfirmEmail,
};
