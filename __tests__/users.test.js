const db = require("../db");
const request = require("supertest");
const app = require("../app");

beforeAll(async () => {
  await db.query(
    "CREATE TABLE users (id SERIAL PRIMARY KEY, user_name VARCHAR(255), password VARCHAR(255))"
  );
});

beforeEach(async () => {
  await db.query(
    "INSERT INTO users (user_name, password) VALUES ('hashim', 'password')"
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
