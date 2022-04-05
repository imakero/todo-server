const mongoose = require("mongoose")
const { getConfig } = require("../config")

const getConnectionString = (config) => {
  const { database } = config
  const { host, port, name } = database
  return `mongodb://${host}:${port}/${name}`
}

const connectDatabase = () => {
  const config = getConfig()
  return mongoose.connect(getConnectionString(config))
}

const clearDatabase = () => {
  return Promise.all(
    Object.values(mongoose.connection.collections).map((collection) => {
      collection.deleteMany()
    })
  )
}

const dropDatabase = () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.db.dropDatabase()
  } else {
    console.log("database could not be dropped")
  }
}

const disconnectDatabase = () => {
  return mongoose.disconnect()
}

module.exports = {
  connectDatabase,
  clearDatabase,
  dropDatabase,
  disconnectDatabase,
}
