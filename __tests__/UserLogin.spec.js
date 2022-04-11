const request = require("supertest")
const app = require("../app")
const {
  setupDatabase,
  postUser,
  login,
  validUser,
} = require("../lib/test-utils")
const jwt = require("jsonwebtoken")
const { createUser } = require("../models/userServices")

setupDatabase()

describe("User login", () => {
  it("Returns 200 when logging in with correct credentials", async () => {
    await postUser()
    const response = await login()
    expect(response.statusCode).toBe(200)
  })

  it("Response contains a token when logging in", async () => {
    await postUser()
    const response = await login()
    expect(response.body).toHaveProperty("token")
  })

  it("Token contains correct userId and username", async () => {
    const savedUser = await createUser(validUser.username, validUser.password)
    const response = await login()
    const payload = jwt.decode(response.body.token)
    expect(payload).toHaveProperty("userId", savedUser._id.toString())
    expect(payload).toHaveProperty("username", validUser.username)
  })

  it("Does not return the password hash after loging in", async () => {
    await postUser()
    const response = await login()
    expect(response.body).not.toHaveProperty("password")
  })
})
