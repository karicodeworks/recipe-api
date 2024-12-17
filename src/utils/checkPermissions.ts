import CustomError from '../errors'

const checkPermission = (requestUser: any, resourceUserId: string) => {
  if (requestUser.role === 'admin' || requestUser.userId === resourceUserId) {
    return
  } else {
    throw new CustomError.UnauthorizedError(
      'Not authorized to access that route'
    )
  }
}

export default checkPermission
