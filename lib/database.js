const mongoose = require("mongoose")
const { getConfig } = require("../config")

const getConnectionString = (config) => {
  const { database } = config
  const { host, port, name } = database
  return `mongodb://${host}:${port}/${name}`
}

const connectDatabase = () => {
  const config = getConfig()
  mongoose.connect(getConnectionString(config))
}

module.exports = connectDatabase
