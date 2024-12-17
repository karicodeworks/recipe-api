import { Request, Response, NextFunction } from 'express'
import CustomError from '../errors'
import mongoose from 'mongoose'
import { error } from 'console'

interface ErrorResponse {
  status: string
  message: string
  details?: any
}

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let errorResponse: ErrorResponse = {
    status: 'error',
    message: 'Something went wrong!',
  }

  // Avoid sending multiple responses by checking if headers are already sent
  if (res.headersSent) {
    return next(err)
  }

  // Handling custom errors
  if (err instanceof CustomError.CustomAPIError) {
    res.status(err.statusCode).json({ status: 'error', message: err.message })
    return
  }

  // Validation Error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((error: any) => error.message)
    errorResponse.message = 'Validation failed'
    errorResponse.details = errors
    res.status(400).json(errorResponse)
    return
  }

  // Duplicate Key Error
  if (err.code && err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    errorResponse.message = `Duplicate field value for "${field}"`
    errorResponse.details = err.keyValue
    res.status(409).json(errorResponse) // Conflict error
    return
  }

  // Cast Error (Invalid ID or other casting issues)
  if (err instanceof mongoose.Error.CastError) {
    errorResponse.message = `Invalid ${err.path}: ${err.value}`
    res.status(400).json(errorResponse)
    return
  }

  // General error handler for any other cases
  res.status(500).json(errorResponse)
}

export default errorHandler
