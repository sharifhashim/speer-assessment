const db = require("../db");
const request = require("supertest");
const app = require("../app");
const bcrypt = require("bcryptjs");
const hashedPassword = bcrypt.hashSync("password", 10);
let userName = "";
beforeAll(async () => {
  await db.query(
    "CREATE TABLE tweets (id SERIAL PRIMARY KEY, user_name VARCHAR(255), tweet VARCHAR(255))"
  );
});

beforeEach(async () => {
  await db.query(
    `INSERT INTO users (user_name, password) VALUES ('hashim', '${hashedPassword}')`
  );
  await db.query(
    `INSERT INTO tweets (user_name, tweet) VALUES ('hashim', 'hello world!')`
  );
  const response = await request(app).post("/api/users/login").send({
    userName: "hashim",
    password: "password",
  });
  userName = response.body.user_name;
});

afterEach(async () => {
  await db.query("DELETE FROM tweets");
});

afterAll(async () => {
  await db.query("DROP TABLE tweets");
  db.end();
});

describe("POST /api/tweets", () => {
  test("It should create new tweet", async () => {
    const newTweet = await request(app).post("/api/tweets").send({
      userName: userName,
      tweet: "testing testing",
    });
    console.log(newTweet);
    expect(newTweet.body).toHaveProperty("id");
    expect(newTweet.body.tweet).toBe("testing testing");
    expect(newUser.statusCode).toBe(200);
  });
});
