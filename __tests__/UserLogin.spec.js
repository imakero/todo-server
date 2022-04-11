const {
  setupDatabase,
  postUser,
  login,
  validUser,
} = require("../lib/test-utils")
const jwt = require("jsonwebtoken")
const User = require("../models/user")

setupDatabase()

describe("User login", () => {
  beforeEach(async () => {
    await postUser()
  })

  it("Returns 200 when logging in with correct credentials", async () => {
    const response = await login()
    expect(response.statusCode).toBe(200)
  })

  it("Response contains a token when successfully logging in", async () => {
    const response = await login()
    expect(response.body).toHaveProperty("token")
  })

  it("Token contains correct userId and username", async () => {
    const savedUser = await User.findOne({ username: validUser.username })
    const response = await login()
    const payload = jwt.decode(response.body.token)
    expect(payload).toHaveProperty("userId", savedUser._id.toString())
    expect(payload).toHaveProperty("username", validUser.username)
  })

  it("Does not return the password hash after logging in", async () => {
    const response = await login()
    expect(response.body).not.toHaveProperty("password")
  })

  it("Returns 401 when trying to log in with incorrect credentials", async () => {
    const response = await login({ ...validUser, password: "wrong" })
    expect(response.status).toBe(401)
  })

  it("Returns IncorrectCredentialsError when there is no user with specified username", async () => {
    const response = await login({ ...validUser, username: "doesNotExist" })
    const { error } = response.body
    expect(error).toBeDefined()
    expect(error.name).toBe("IncorrectCredentialsError")
    expect(error.message).toBe("Incorrect username and/or password")
  })

  it("Returns IncorrectCredentialsError when the provided password is wrong", async () => {
    const response = await login({ ...validUser, password: "wrong" })
    const { error } = response.body
    expect(error).toBeDefined()
    expect(error.name).toBe("IncorrectCredentialsError")
    expect(error.message).toBe("Incorrect username and/or password")
  })
})
