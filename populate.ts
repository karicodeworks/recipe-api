require("dotenv").config()
const mockData = require("./mock-data.json")
import Recipe from "./src/models/Recipe"
import connectDB from "./src/db/connect"

const start = async () => {
  const url = process.env.MONGO_URI
  if (!url) {
    throw new Error("Database URI not found in .env file")
  }

  try {
    await connectDB(url)
    await Recipe.create(mockData)
    console.log("Success!!!")
    process.exit(0)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

start()
