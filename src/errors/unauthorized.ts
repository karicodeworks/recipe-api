import { StatusCodes } from 'http-status-codes'
import CustomAPIError from './custom-api-errors'

class UnauthorizedError extends CustomAPIError {
  constructor(message: string) {
    super(message)
    this.statusCode = StatusCodes.FORBIDDEN
  }
}

export default UnauthorizedError
