const { getAuthHeader } = require("../lib/auth")
const {
  setupDatabase,
  postTodo: postTodoBase,
  validTodo,
  postUser,
  login,
} = require("../lib/test-utils")
const Todo = require("../models/todo")

setupDatabase()

describe("Todo creation", () => {
  let postTodo
  let authorizedUser
  const options = {}

  beforeEach(async () => {
    await postUser()
    const response = await login()
    authorizedUser = response.body
    const headers = getAuthHeader(response.body.token)
    options.headers = headers
    postTodo = (todo = validTodo, requestOptions = options) =>
      postTodoBase(todo, requestOptions)
  })

  it("Returns 201 when a new todo item is created", async () => {
    const response = await postTodo()
    expect(response.status).toBe(201)
  })

  it("Saves the new todo to the database", async () => {
    await postTodo()
    const todo = await Todo.findOne()
    expect(todo).not.toBeNull()
    expect(todo.title).toBe(validTodo.title)
  })

  it("Returns 'Todo created' when a new todo is created", async () => {
    const response = await postTodo()
    expect(response.body.message).toBe("Todo created")
  })

  it("Returns the created todo", async () => {
    const response = await postTodo()
    expect(response.body.todo).toBeDefined()
  })

  it("Saves the todo to the correct user", async () => {
    const response = await postTodo()
    expect(response.body.todo.author).toBe(authorizedUser._id)
  })

  it("Adds createdAt and updatedAt timestamps to the todo item", async () => {
    await postTodo()
    const todo = await Todo.findOne()
    expect(todo.createdAt).toBeDefined()
    expect(todo.updatedAt).toBeDefined()
  })

  it("Saves a new todo item to the database with completed set to false", async () => {
    await postTodo()
    const todo = await Todo.findOne()
    expect(todo.completed).toBe(false)
  })

  it("Returns InvalidTokenError if the jwt is not valid", async () => {
    const response = await postTodo(validTodo, {
      headers: { Authorization: "Bearer thisTokenIsAnInvalidToken" },
    })
    expect(response.status).toBe(401)
    expect(response.body.error).toBeDefined()
    expect(response.body.error.name).toBe("InvalidTokenError")
  })

  it("Returns UnauthorizedError if no jwt is provided", async () => {
    const response = await postTodo(validTodo, {})
    expect(response.status).toBe(401)
    expect(response.body.error).toBeDefined()
    expect(response.body.error.name).toBe("UnauthorizedError")
  })
})
