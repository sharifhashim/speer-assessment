module.exports = (db) => {
  const addUser = () => {
    const query = {
      text: `INSERT INTO users (user_name, password)
      VALUES ($1, $2) RETURNING *;`,
    };
    const values = [userName, password];

    return db
      .query(query, values)
      .then((result) => result.rows)
      .catch((error) => error);
  };

  return {
    addUser,
  };
};
