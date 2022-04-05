const app = require("./app")
const connectDatabase = require("./lib/database")

const PORT = 3000

connectDatabase()

app.listen(PORT, () => {
  console.log(`Started server on port: ${PORT}`)
})
