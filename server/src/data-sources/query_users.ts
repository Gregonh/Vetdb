import { Request, Response, NextFunction } from 'express';
import { QueryResult } from 'pg';

import { pool } from '../dotConfig';

interface VetUser {
  readonly id: number;
  readonly name: string;
  readonly lastName: string;
  readonly email: string;
  readonly password: string;
}

//query function to call in the endpoint
const getUsers = (
  _request: Request,
  response: Response,
  next: NextFunction,
) => {
  pool.query(
    'SELECT * FROM users ORDER BY id ASC',
    (error, results: QueryResult<VetUser>) => {
      if (error) {
        return next(error);
      }
      response.status(200).json(results.rows);
    },
  );
};

const checkParamIdIsString = (
  requestId: string | undefined,
  next: NextFunction,
) => {
  if (requestId === '') {
    const emptyError = new Error('empty id');
    return next(emptyError);
  } else if (requestId === undefined) {
    const undefinedError = new Error('undefined id');
    return next(undefinedError);
  }
};

/*get one user by id
get the custom id parameter by the URL
$1 is a numbered placeholder that PostgreSQL uses natively instead of the ?
*/
const getUserById = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const requestId = request.params['id'];
  checkParamIdIsString(requestId, next);
  const id = parseInt(requestId as string);

  pool.query(
    'SELECT * FROM users WHERE id = $1',
    [id],
    (error, results: QueryResult<VetUser>) => {
      if (error) {
        return next(error);
      }
      response.status(200).json(results.rows);
    },
  );
};

const getEmailById = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const requestId = request.params['id'];
  checkParamIdIsString(requestId, next);
  const id = parseInt(requestId as string);

  pool.query(
    'SELECT email FROM users WHERE id = $1',
    [id],
    (error, results: QueryResult<VetUser>) => {
      if (error) {
        return next(error);
      }
      response.status(200).json({ email: results.rows[0]?.email });
    },
  );
};

//post
const createUser = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  console.log(request.body);
  const { name, lastName, email, password } = <VetUser>request.body;

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

//put
/**
 * The /users/:id endpoint will also take two HTTP requests,
 * the GET we created for getUserById and a PUT to modify an existing user.
 */
const updateUserPassword = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const requestId = request.params['id'];
  checkParamIdIsString(requestId, next);
  const id = parseInt(requestId as string);
  const { password } = <VetUser>request.body;

  pool.query(
    'UPDATE users SET password = $1 WHERE id = $2',
    [password, id],
    (error, results: QueryResult<VetUser>) => {
      if (error) {
        return next(error);
      }
      console.log(results);
      response.status(200).json({ message: `User modified with ID: ${id}` });
    },
  );
};

//delete
const deleteUser = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const requestId = request.params['id'];
  checkParamIdIsString(requestId, next);
  const id = parseInt(requestId as string);

  pool.query(
    'DELETE FROM users WHERE id = $1',
    [id],
    (error, results: QueryResult<VetUser>) => {
      if (error) {
        return next(error);
      }
      console.log('number of users' + results.rows.length);
      response.status(200).json({ message: `User deleted with ID: ${id}` });
    },
  );
};

export const db = {
  getUsers,
  createUser,
  getUserById,
  updateUser: updateUserPassword,
  deleteUser,
  getEmailById,
};
