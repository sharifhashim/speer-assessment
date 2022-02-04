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
    //console.log(newUser);
    expect(newUser.body).toHaveProperty("id");
    expect(newUser.body.user_name).toBe("sharif");
  });
});

describe("POST /api/users/login", () => {
  test("It should respond with user", async () => {
    //const hashedPassword = bcrypt.hashSync("password", 10);
    const user = await request(app).post("/api/users/login").send({
      userName: "hashim",
      password: "password",
    });
    //console.log(user);
    expect(user.body).toHaveProperty("id");
    expect(user.body.user_name).toBe("hashim");
    expect(user.statusCode).toBe(200);
  });
});
