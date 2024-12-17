import app from './app'
import connectDB from './db/connect'

const start = async (): Promise<void> => {
  try {
    const port = process.env.PORT || 3000
    const url = process.env.MONGO_URI

    if (!url) {
      throw new Error('Database URL not found in .env file')
    }

    await connectDB(url)

    app.listen(port, () => {
      console.log(`server is running on port ${port}`)
    })
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

start()
