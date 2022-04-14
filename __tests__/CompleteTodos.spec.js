const { getAuthHeader } = require("../lib/auth")
const {
  setupDatabase,
  postTodo: postTodoBase,
  postUser,
  validTodo,
  login,
  validUser,
  completeTodo: completeTodoBase,
  uncompleteTodo: uncompleteTodoBase,
} = require("../lib/test-utils")

setupDatabase()

describe("Toggle todos", () => {
  let postTodo, completeTodo, uncompleteTodo
  const options = {}

  const changeUser = async (user) => {
    await postUser(user)
    const response = await login(user)
    const headers = getAuthHeader(response.body.token)
    options.headers = headers
    postTodo = (todo = validTodo, requestOptions = options) =>
      postTodoBase(todo, requestOptions)
    completeTodo = (todoId, requestOptions = options) =>
      completeTodoBase(todoId, requestOptions)
    uncompleteTodo = (todoId, requestOptions = options) =>
      uncompleteTodoBase(todoId, requestOptions)
  }

  beforeEach(async () => {
    await changeUser(validUser)
  })

  describe("Setting completed to true", () => {
    it("Returns 200 when successful", async () => {
      const todoResponse = await postTodo()
      const { todo } = todoResponse.body
      const response = await completeTodo(todo._id)
      expect(response.status).toBe(200)
    })

    it("Returns a 'Todo completed' message when successful", async () => {
      const todoResponse = await postTodo()
      const { todo } = todoResponse.body
      const response = await completeTodo(todo._id)
      expect(response.body.message).toBe("Todo completed")
    })

    it("Returns the updated todo with the completed field set to true when successful", async () => {
      const todoResponse = await postTodo()
      const { todo } = todoResponse.body
      const response = await completeTodo(todo._id)
      expect(response.body.todo.completed).toBe(true)
    })

    it("Returns the todo with completed set to true even if it was already true", async () => {
      const todoResponse = await postTodo()
      const { todo } = todoResponse.body
      await completeTodo(todo._id)
      const response = await completeTodo(todo._id)
      expect(response.body.todo.completed).toBe(true)
    })

    it("Returns a NotFoundError when the given todoId is not in the database", async () => {
      const response = await completeTodo("thisisafakeid")
      expect(response.status).toBe(404)
      expect(response.body.error).toBeDefined()
      expect(response.body.error.name).toBe("NotFoundError")
      expect(response.body.error.message).toBe(
        "The todo item with id 'thisisafakeid' does not exist"
      )
    })

    it("Returns InvalidTokenError if the jwt is not valid", async () => {
      const todoResponse = await postTodo()
      const { todo } = todoResponse.body
      const response = await completeTodo(todo._id, {
        headers: { Authorization: "Bearer thisTokenIsAnInvalidToken" },
      })
      expect(response.status).toBe(401)
      expect(response.body.error).toBeDefined()
      expect(response.body.error.name).toBe("InvalidTokenError")
    })

    it("Returns UnauthorizedError if no jwt is provided", async () => {
      const todoResponse = await postTodo()
      const { todo } = todoResponse.body
      const response = await completeTodo(todo._id, {})
      expect(response.status).toBe(401)
      expect(response.body.error).toBeDefined()
      expect(response.body.error.name).toBe("UnauthorizedError")
    })
  })

  describe("Setting completed to false", () => {
    it("Returns 200 when successful", async () => {
      const todoResponse = await postTodo()
      const { todo } = todoResponse.body
      await completeTodo(todo._id)
      const response = await uncompleteTodo(todo._id)
      expect(response.status).toBe(200)
    })

    it("Returns a 'Todo reset' message when successful", async () => {
      const todoResponse = await postTodo()
      const { todo } = todoResponse.body
      await completeTodo(todo._id)
      const response = await uncompleteTodo(todo._id)
      expect(response.body.message).toBe("Todo reset")
    })

    it("Returns the updated todo with the completed field set to false when successful", async () => {
      const todoResponse = await postTodo()
      const { todo } = todoResponse.body
      await completeTodo(todo._id)
      const response = await uncompleteTodo(todo._id)
      expect(response.body.todo.completed).toBe(false)
    })

    it("Returns the todo with completed set to false even if it was already false", async () => {
      const todoResponse = await postTodo()
      const { todo } = todoResponse.body
      const response = await uncompleteTodo(todo._id)
      expect(response.body.todo.completed).toBe(false)
    })

    it("Returns a NotFoundError when the given todoId is not in the database", async () => {
      const response = await uncompleteTodo("thisisafakeid")
      expect(response.status).toBe(404)
      expect(response.body.error).toBeDefined()
      expect(response.body.error.name).toBe("NotFoundError")
      expect(response.body.error.message).toBe(
        "The todo item with id 'thisisafakeid' does not exist"
      )
    })

    it("Returns InvalidTokenError if the jwt is not valid", async () => {
      const todoResponse = await postTodo()
      const { todo } = todoResponse.body
      const response = await uncompleteTodo(todo._id, {
        headers: { Authorization: "Bearer thisTokenIsAnInvalidToken" },
      })
      expect(response.status).toBe(401)
      expect(response.body.error).toBeDefined()
      expect(response.body.error.name).toBe("InvalidTokenError")
    })

    it("Returns UnauthorizedError if no jwt is provided", async () => {
      const todoResponse = await postTodo()
      const { todo } = todoResponse.body
      const response = await uncompleteTodo(todo._id, {})
      expect(response.status).toBe(401)
      expect(response.body.error).toBeDefined()
      expect(response.body.error.name).toBe("UnauthorizedError")
    })
  })
})
