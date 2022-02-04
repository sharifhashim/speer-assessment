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
      .catch((error) => error);
  };

  const addTweet = (userName, tweet) => {
    const query = {
      text: `INSERT INTO tweets (user_name, tweet)
      VALUES ($1, $2) RETURNING *;`,
    };
    const values = [userName, tweet];

    return db
      .query(query, values)
      .then((result) => result.rows[0])
      .catch((error) => error);
  };

  const getTweets = (userName) => {
    const query = {
      text: `SELECT * FROM tweets WHERE user_name = $1;`,
    };
    const values = [userName];
    return db
      .query(query, values)
      .then((result) => result.rows[0])
      .catch((error) => error);
  };

  const updateTweet = (id, userName, tweet) => {
    const query = {
      text: `INSERT INTO tweets (id, user_name, tweet)
      VALUES ($1, $2, $3)
      ON CONFLICT (id) DO
      UPDATE SET tweet = $3
      RETURNING *`,
    };
    const values = [id, userName, tweet];

    return db
      .query(query, values)
      .then((result) => result.rows)
      .catch((error) => error);
  };

  const deleteTweet = (id) => {
    const query = {
      text: `DELETE FROM tweets WHERE id = $1;`,
    };
    const values = [id];

    return db
      .query(query, values)
      .then((result) => result.rows)
      .catch((error) => error);
  };

  return {
    addUser,
    getUserByUserName,
    login,
    addTweet,
    getTweets,
    updateTweet,
    deleteTweet,
  };
};
