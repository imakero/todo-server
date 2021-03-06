const { getAuthHeader } = require("../lib/auth")
const {
  setupDatabase,
  postTodo: postTodoBase,
  postUser,
  validTodo,
  login,
  getTodos: getTodosBase,
  validUser,
} = require("../lib/test-utils")
const Todo = require("../models/todo")

setupDatabase()

describe("List todos", () => {
  let getTodos
  let postTodo
  const options = {}

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

  const saveMultiple = async (n, options = {}) => {
    const todosToSave = [...Array(n)].map((_, index) => ({
      title: `Todo number ${index + 1}`,
    }))
    if (!options.sleep) {
      return Promise.all(todosToSave.map((todo) => postTodo(todo)))
    } else {
      for (let todo of todosToSave) {
        await postTodo(todo)
        await sleep(options.sleep)
      }
    }
  }

  const changeUser = async (user) => {
    await postUser(user)
    const response = await login(user)
    const headers = getAuthHeader(response.body.token)
    options.headers = headers
    postTodo = (todo = validTodo, requestOptions = options) =>
      postTodoBase(todo, requestOptions)
    getTodos = (requestOptions = options) => getTodosBase(requestOptions)
  }

  beforeEach(async () => {
    await changeUser(validUser)
  })

  it("Returns 200 when the todos are successfully fetched", async () => {
    await postTodo()
    const response = await getTodos()
    expect(response.status).toBe(200)
  })

  it("Returns the correct number of todos", async () => {
    await saveMultiple(5)
    const response = await getTodos()
    expect(response.body.todos.length).toBe(5)
  })

  it("Only returns todos for the logged in user", async () => {
    await saveMultiple(3)
    await changeUser({ username: "stan", password: "easilyguessed" })
    await saveMultiple(4)
    const response = await getTodos()
    expect(response.body.todos.length).toBe(4)
  })

  it("Returns the todos sorted by creation date, newest first", async () => {
    await saveMultiple(5, { sleep: 5 })
    const response = await getTodos()
    const todosCreationTime = response.body.todos.map((todo) =>
      new Date(todo.createdAt).getTime()
    )
    expect(todosCreationTime[0]).toBeGreaterThanOrEqual(todosCreationTime[1])
    expect(todosCreationTime[1]).toBeGreaterThanOrEqual(todosCreationTime[2])
    expect(todosCreationTime[2]).toBeGreaterThanOrEqual(todosCreationTime[3])
    expect(todosCreationTime[3]).toBeGreaterThanOrEqual(todosCreationTime[4])
  })

  it("Returns todos with an author field containing the username", async () => {
    await postTodo()
    const response = await getTodos()
    const todo = response.body.todos[0]
    expect(todo.author.username).toBe(validUser.username)
  })

  describe("Filtering on completed", () => {
    beforeEach(async () => {
      await postTodo()
      await Todo.findOneAndUpdate({}, { completed: true })
      await saveMultiple(3, { sleep: 5 })
    })

    it("Returns only incomplete todos when the query string is 'completed=false'", async () => {
      const response = await getTodos({
        headers: options.headers,
        query: "completed=false",
      })
      expect(response.body.todos.length).toBe(3)
    })

    it("Returns only completed todos when the query string is 'completed=true'", async () => {
      const response = await getTodos({
        headers: options.headers,
        query: "completed=true",
      })
      expect(response.body.todos.length).toBe(1)
    })

    it("Returns the todos sorted by creation date, newest first", async () => {
      const response = await getTodos({
        headers: options.headers,
        query: "completed=false",
      })
      const todosCreationTime = response.body.todos.map((todo) =>
        new Date(todo.createdAt).getTime()
      )
      expect(todosCreationTime[0]).toBeGreaterThanOrEqual(todosCreationTime[1])
      expect(todosCreationTime[1]).toBeGreaterThanOrEqual(todosCreationTime[2])
    })

    it("Returns ValidationError when the query string is 'completed=hello'", async () => {
      const response = await getTodos({
        headers: options.headers,
        query: "completed=hello",
      })
      expect(response.status).toBe(400)
      expect(response.body.error).toBeDefined()
      expect(response.body.error.name).toBe("ValidationError")
      expect(response.body.error.message).toBe("There were validation errors.")
      expect(response.body.error.data.validationErrors.completed).toBe(
        "The value for completed must be either true or false."
      )
    })
  })
})
