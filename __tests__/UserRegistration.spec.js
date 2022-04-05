const request = require("supertest")
const app = require("../app")
const {
  connectDatabase,
  clearDatabase,
  dropDatabase,
  disconnectDatabase,
} = require("../lib/database")

const validUser = {
  username: "cartman",
  email: "eric_cartman@gmail.com",
  password: "I/1o61n63r5",
}

const postUser = (user = validUser, options = {}) => {
  const agent = request(app).post("/api/1.0/users")
  return agent.send(user)
}

beforeAll(async () => {
  await connectDatabase()
})

beforeEach(async () => {
  await clearDatabase()
})

afterAll(async () => {
  await dropDatabase()
  await disconnectDatabase()
})

describe("User registration", () => {
  it("Returns 201 when a new user is signed up", async () => {
    const response = await postUser()
    expect(response.statusCode).toBe(201)
  })
})
