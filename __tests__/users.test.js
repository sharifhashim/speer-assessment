const db = require("../db");
const request = require("supertest");
const app = require("../app");
const bcrypt = require("bcryptjs");
const hashedPassword = bcrypt.hashSync("password", 10);

beforeAll(async () => {
  await db.query(
    "CREATE TABLE users (id SERIAL PRIMARY KEY, user_name VARCHAR(255), password VARCHAR(255))"
  );
});

beforeEach(async () => {
  await db.query(
    `INSERT INTO users (user_name, password) VALUES ('hashim', '${hashedPassword}')`
  );
});

afterEach(async () => {
  await db.query("DELETE FROM users");
});

afterAll(async () => {
  await db.query("DROP TABLE users");
  db.end();
});

describe("POST /api/users/register", () => {
  test("It should respond with newly created user", async () => {
    const newUser = await request(app).post("/api/users/register").send({
      userName: "sharif",
      password: "password",
    });
    expect(newUser.body).toHaveProperty("id");
    expect(newUser.body.user_name).toBe("sharif");
    expect(newUser.statusCode).toBe(200);
  });

  test("It should respond with error username already exists", async () => {
    const newUser = await request(app).post("/api/users/register").send({
      userName: "hashim",
      password: "password",
    });
    expect(newUser.body.msg).toBe(
      "Sorry, a user with this username already exists"
    );
    expect(newUser.statusCode).toBe(200);
  });
});

describe("POST /api/users/login", () => {
  test("It should respond with user", async () => {
    const user = await request(app).post("/api/users/login").send({
      userName: "hashim",
      password: "password",
    });
    expect(user.body).toHaveProperty("id");
    expect(user.body.user_name).toBe("hashim");
    expect(user.statusCode).toBe(200);
  });

  test("It should respond with session cookies", async () => {
    const user = await request(app).post("/api/users/login").send({
      userName: "hashim",
      password: "password",
    });
    expect(user.header).toHaveProperty("set-cookie");
    expect(user.statusCode).toBe(200);
  });
});
