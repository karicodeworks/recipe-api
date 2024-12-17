// imports
import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import { v2 as cloudinary } from 'cloudinary'
import fileUpload from 'express-fileupload'

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
})

// import routes
import authRouter from './routes/authRoutes'
import userRouter from './routes/userRoutes'
import recipeRouter from './routes/recipeRoutes'

// import error middleware
import notFound from './middleware/not-found'
import errorHandler from './middleware/error-handler'

const app = express()

app.use(express.json())
app.use(cookieParser(process.env.SECRET_KEY))
app.use(fileUpload({ useTempFiles: true }))
app.use(morgan('tiny'))

// routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/recipes', recipeRouter)

// Error handling middleware
app.use(notFound)

app.use(errorHandler)

export default app
