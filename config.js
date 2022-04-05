const configs = {
  test: {
    database: {
      name: "todo-test",
      port: 27017,
      host: "localhost",
    },
  },
  development: {
    database: {
      name: "todo",
      port: 27017,
      host: "localhost",
    },
  },
}

const getConfig = () => {
  return configs[process.env.NODE_ENV] || configs.development
}

module.exports = { getConfig }
