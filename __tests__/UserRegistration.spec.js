const request = require("supertest")
const app = require("../app")
const {
  connectDatabase,
  clearDatabase,
  dropDatabase,
  disconnectDatabase,
} = require("../lib/database")
const User = require("../models/user")

const validUser = {
  username: "cartman",
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

  it("Returns 'User created' when new user is signed up", async () => {
    const response = await postUser()
    expect(response.body.message).toBe("User created")
  })

  it("Saves the new user to the database", async () => {
    await postUser()
    const userList = await User.find()
    expect(userList.length).toBe(1)
  })

  it("Saves username to the database", async () => {
    await postUser(validUser)
    const user = await User.findOne()
    expect(user.username).toBe(validUser.username)
  })

  it("Hashed the password before saving it in the database", async () => {
    await postUser()
    const user = await User.findOne()
    expect(user.password).not.toBe(validUser.password)
  })

  it("Returns 400 when no username is provided", async () => {
    const response = await postUser({ ...validUser, username: undefined })
    expect(response.status).toBe(400)
  })

  it("Returns validationErrors field on error response body when validation fails", async () => {
    const response = await postUser({ ...validUser, username: undefined })
    expect(response.body.error.data.validationErrors).not.toBeUndefined()
  })

  const username_undefined = "Username is required."
  const username_length = "Username must be between 4 and 32 characters long."
  const password_undefined = "Password is required."
  const password_length = "Password must be at least 8 characters long."

  it.each`
    field         | value             | expectedMessage
    ${"username"} | ${undefined}      | ${username_undefined}
    ${"username"} | ${"spr"}          | ${username_length}
    ${"username"} | ${"a".repeat(33)} | ${username_length}
    ${"password"} | ${undefined}      | ${password_undefined}
    ${"password"} | ${"secretp"}      | ${password_length}
  `(
    "Returns a ValidationError with data {$field: '$expectedMessage'} when $field is $value",
    async ({ field, value, expectedMessage }) => {
      const user = { ...validUser, [field]: value }
      const response = await postUser(user)
      const { error } = response.body
      expect(error.data.validationErrors[field]).toBe(expectedMessage)
      expect(error.name).toBe("ValidationError")
      expect(error.status).toBe(400)
    }
  )

  it("Returns UniqueError when the user already exists", async () => {
    await postUser()
    const response = await postUser()
    const { error } = response.body
    expect(response.status).toBe(409)
    expect(error.name).toBe("UniqueError")
    expect(error.message).toBe(
      `The username '${validUser.username}' is already in use.`
    )
    expect(error.status).toBe(409)
    expect(error.data.key).toBe("username")
    expect(error.data.value).toBe(validUser.username)
  })
})
