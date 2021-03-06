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

const postUser = (user = validUser) => {
  const agent = request(app).post(`${API_URL}/users`)
  return agent.send(user)
}

const login = (user = validUser) => {
  const agent = request(app).post(`${API_URL}/auth/login`)
  return agent.send(user)
}

const validTodo = {
  title: "Take over the world",
}

const postTodo = (todo = validTodo, options = {}) => {
  const agent = request(app).post(`${API_URL}/todos`)
  if (options.headers) {
    agent.set(options.headers)
  }
  return agent.send(todo)
}

const getTodos = (options = {}) => {
  //const query = options.query ? "?" + options.query : ""
  const agent = request(app).get(`${API_URL}/todos`)
  if (options.headers) {
    agent.set(options.headers)
  }
  return agent.query(options.query).send()
}

const completeTodo = (todoId, options = {}) => {
  const agent = request(app).post(`${API_URL}/todos/${todoId}/complete`)
  if (options.headers) {
    agent.set(options.headers)
  }
  return agent.send()
}

const uncompleteTodo = (todoId, options = {}) => {
  const agent = request(app).delete(`${API_URL}/todos/${todoId}/complete`)
  if (options.headers) {
    agent.set(options.headers)
  }
  return agent.send()
}

module.exports = {
  setupDatabase,
  validUser,
  validTodo,
  postUser,
  login,
  postTodo,
  getTodos,
  completeTodo,
  uncompleteTodo,
}
