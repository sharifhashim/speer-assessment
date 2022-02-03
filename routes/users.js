const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { addUser, getUserByUserName } = require("../helpers/dbHelpers.js");

module.exports = ({ addUser, getUserByUserName }) => {
  router.post("/", (req, res) => {
    const { userName, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    getUserByUserName(userName)
      .then((user) => {
        if (user) {
          res.json({
            msg: "Sorry, a user with this username already exists",
          });
        } else {
          return addUser(userName, hashedPassword);
        }
      })
      .then((newUser) => res.json(newUser))
      .catch((error) =>
        res.json({
          error: error.message,
        })
      );
  });
  return router;
};
