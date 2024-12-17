import CustomAPIError from './custom-api-errors'
import BadRequestError from './bad-request-error'
import UnauthenticatedError from './unauthenticated'
import NotFoundError from './not-found-error'
import UnauthorizedError from './unauthorized'

const CustomError = {
  CustomAPIError,
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
  UnauthorizedError,
}

export default CustomError
