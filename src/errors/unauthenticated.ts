import { StatusCodes } from 'http-status-codes'
import CustomAPIError from './custom-api-errors'

class UnauthenticatedError extends CustomAPIError {
  constructor(message: string) {
    super(message)
    this.statusCode = StatusCodes.UNAUTHORIZED
  }
}

export default UnauthenticatedError
