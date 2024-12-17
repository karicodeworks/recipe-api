import { Request, Response, NextFunction } from 'express'
import CustomError from '../errors'
import { attachCookiesToResponse, isTokenValid } from '../utils'
import Token from '../models/Token'

const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { accessToken, refreshToken } = req.signedCookies

    if (!accessToken && !refreshToken) {
      throw new CustomError.UnauthenticatedError('User not logged in')
    }

    if (accessToken) {
      const payload = isTokenValid(accessToken) as any
      req.user = payload.user
      return next()
    }

    const payload = isTokenValid(refreshToken) as any

    const existingToken = await Token.findOne({
      user: payload.user.userId,
      refreshToken: payload.refreshToken,
    })

    if (!existingToken || !existingToken?.isValid) {
      throw new CustomError.UnauthenticatedError('Invalid authentication')
    }

    attachCookiesToResponse({
      res,
      user: payload.user,
      refreshToken: existingToken.refreshToken,
    })

    req.user = payload.user
    next()
  } catch (error) {
    next(error)
  }
}

const authorizePermissions = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user) {
      if (!roles.includes(req.user.role)) {
        throw new CustomError.UnauthorizedError(
          'Unauthorized to access that route'
        )
      }
    }
    next()
  }
}

export { authenticateUser, authorizePermissions }
