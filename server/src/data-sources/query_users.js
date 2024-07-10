import { pool } from '../dotConfig';

//query function to call in the endpoint
const getUsers = (request, response) => {
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

/*get one user by id
get the custom id parameter by the URL
$1 is a numbered placeholder that PostgreSQL uses natively instead of the ?
*/
const getUserById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

//post
const createUser = (request, response) => {
  const { name, email } = request.body;

  pool.query(
    'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
    [name, email],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`User added with ID: ${results.rows[0].ID}`);
    },
  );
};

//put
/**
 * The /users/:id endpoint will also take two HTTP requests,
 * the GET we created for getUserById and a PUT to modify an existing user.
 */
const updateUser = (request, response) => {
  const id = parseInt(request.params.id);
  const { name, email } = request.body;

  pool.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3',
    [name, email, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      console.log(results);
      response.status(200).send(`User modified with ID: ${id}`);
    },
  );
};

//delete
const deleteUser = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    console.log(results);
    response.status(200).send(`User deleted with ID: ${id}`);
  });
};

export const db = {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
};
