const request = require("supertest")
const {
  connectDatabase,
  clearDatabase,
  dropDatabase,
  disconnectDatabase,
} = require("./database")
const app = require("../app")

const API_URL = "/api/1.0"

const setupDatabase = () => {
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
}

const validUser = {
  username: "cartman",
  password: "I/1o61n63r5",
}

const postUser = (user = validUser, options = {}) => {
  const agent = request(app).post(`${API_URL}/users`)
  return agent.send(user)
}

const login = (user = validUser) => {
  const agent = request(app).post(`${API_URL}/auth/login`)
  return agent.send(user)
}

module.exports = { setupDatabase, validUser, postUser, login }
