const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const {
  addUser,
  getUserByUserName,
  login,
} = require("../db/helpers/dbHelpers.js");

module.exports = ({ addUser, getUserByUserName, login }) => {
  router.post("/login", (req, res) => {
    const { userName, password } = req.body;
    login(userName, password)
      .then((user) => {
        if (!user) {
          res.status(401);
          return res.send({ message: "Wrong username or password" });
        }
        req.session.user = user;
        res.json(user);
      })
      .catch((error) => res.send(error));
  });

  router.post("/register", (req, res) => {
    const { userName, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    getUserByUserName(userName).then((user) => {
      if (user) {
        res.json({
          msg: "Sorry, a user with this username already exists",
        });
      } else {
        return addUser(userName, hashedPassword)
          .then((newUser) => {
            req.session.user = newUser;
            return res.json(newUser);
          })
          .catch((error) => res.json({ error: error.message }));
      }
    });
  });
  return router;
};
