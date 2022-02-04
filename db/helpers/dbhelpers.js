const bcrypt = require("bcryptjs");

module.exports = (db) => {
  const getUserByUserName = (userName) => {
    const query = {
      text: `SELECT user_name from users WHERE user_name = $1`,
    };
    const values = [userName];
    return db
      .query(query, values)
      .then((result) => result.rows[0])
      .catch((error) => error);
  };

  const addUser = (userName, password) => {
    const query = {
      text: `INSERT INTO users (user_name, password)
      VALUES ($1, $2) RETURNING *;`,
    };
    const values = [userName, password];

    return db
      .query(query, values)
      .then((result) => result.rows[0])
      .catch((error) => error);
  };

  const login = (userName, password) => {
    const query = {
      text: `SELECT * FROM users WHERE user_name = $1;`,
    };
    const values = [userName];
    return db
      .query(query, values)
      .then((result) => {
        return result.rows[0];
      })
      .then((result) => {
        if (
          result !== undefined &&
          bcrypt.compareSync(password, result.password)
        ) {
          return result;
        }
        return null;
      })
      .catch((err) => err);
  };
  return {
    addUser,
    getUserByUserName,
    login,
  };
};
