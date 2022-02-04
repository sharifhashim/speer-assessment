const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const db = require("./db");
const dbHelpers = require("./db/helpers/dbHelpers")(db);
const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");

const usersRouter = require("./routes/users");
const tweetsRouter = require("./routes/tweets");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
  })
);
app.use(bodyParser.json());

app.use("/api/users", usersRouter(dbHelpers));
app.use("/api/tweets", tweetsRouter(dbHelpers));

module.exports = app;
