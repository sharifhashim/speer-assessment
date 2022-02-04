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
    `INSERT INTO tweets (user_name, tweet) VALUES ('hashim', 'hello world!')`
  );
  await db.query(
    `INSERT INTO users (user_name, password) VALUES ('hashim', '${hashedPassword}')`
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
    expect(newTweet.body).toHaveProperty("id");
    expect(newTweet.body.tweet).toBe("testing testing");
    expect(newTweet.statusCode).toBe(200);
  });
});

describe("PUT /api/tweets/2", () => {
  test("It should edit tweet", async () => {
    const editedTweet = await request(app).put("/api/tweets/2").send({
      userName: userName,
      tweet: "updated tweet",
    });
    expect(editedTweet.body[0]).toHaveProperty("id");
    expect(editedTweet.body[0].tweet).toBe("updated tweet");
    expect(editedTweet.statusCode).toBe(200);
  });
});

describe("DELETE /api/tweets/2", () => {
  test("It should delete tweet", async () => {
    const deletedTweet = await request(app).delete("/api/tweets/2");

    expect(deletedTweet.body.message).toBe("Your post successfully deleted");
    expect(deletedTweet.statusCode).toBe(200);
  });
});

describe("GET /api/tweets", () => {
  test("It should get a list of tweets", async () => {
    const tweets = await request(app).get("/api/tweets");

    expect(tweets.body).toHaveProperty("id");
    expect(tweets.body.tweet).toBe("hello world!");
    expect(tweets.statusCode).toBe(200);
  });
});
