import { NextFunction, Request, Response } from 'express'
import User from '../models/Users'
import { StatusCodes } from 'http-status-codes'
import CustomError from '../errors'
import createTokenUser from '../utils/createTokenUser'
import { attachCookiesToResponse } from '../utils/attachCookies'
import Token from '../models/Token'
import { randomBytes } from 'crypto'
import sendVerificationEmail from '../utils/sendEmailVerification'

const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password } = req.body
    const emailExists = await User.findOne({ email })

    // make the first user an admin
    const isFirstUser = (await User.countDocuments({})) === 0
    const role = isFirstUser ? 'admin' : 'user'

    if (emailExists) {
      throw new CustomError.BadRequestError('Email already registered')
    }

    const verificationToken = randomBytes(40).toString('hex')

    const user = new User({
      name,
      email,
      password,
      role,
      verificationToken,
    })

    sendVerificationEmail({
      name: user.name,
      email: user.email,
      verificationToken: user.verificationToken,
      origin: process.env.ORIGIN,
    })

    await user.save()

    res
      .status(StatusCodes.CREATED)
      .json({ status: 'Success', message: 'You have been registered' })
  } catch (error) {
    next(error)
  }
}

const verifyEmail = async (req: Request, res: Response) => {
  const { verificationToken, email } = req.body
  const user = await User.findOne({ email })

  if (!user) {
    throw new CustomError.NotFoundError('User not found')
  }

  if (user.verificationToken !== verificationToken) {
    throw new CustomError.BadRequestError(
      'The verification token does not match'
    )
  }

  user.isVerified = true
  user.verifiedAt = new Date(Date.now())
  user.verificationToken = ''

  await user.save()

  res.status(200).json({ message: 'Email is verified' })
}

const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      throw new CustomError.BadRequestError(
        'Both email and password are required'
      )
    }

    const user = await User.findOne({ email })
    if (!user) {
      throw new CustomError.UnauthenticatedError('User not found')
    }

    const checkPassword = await user.comparePassword(password)
    if (!checkPassword) {
      throw new CustomError.UnauthenticatedError('Incorrect password')
    }

    if (!user.isVerified) {
      throw new CustomError.UnauthenticatedError('Please verify your email')
    }

    const tokenUser = createTokenUser(user)

    let refreshToken

    const existingToken = await Token.findOne({ user: user._id })

    if (existingToken) {
      const { isValid } = existingToken
      if (!isValid) {
        throw new CustomError.UnauthorizedError('Access not granted')
      }
      refreshToken = existingToken.refreshToken
      attachCookiesToResponse({ res, user: tokenUser, refreshToken })
      res.status(StatusCodes.OK).json({ user: tokenUser })
      return
    }

    refreshToken = randomBytes(40).toString('hex')
    const ip = req.ip
    const userAgent = req.headers['user-agent']

    await Token.create({ refreshToken, ip, userAgent, user: user._id })

    attachCookiesToResponse({ res, user: tokenUser, refreshToken })

    res.status(StatusCodes.OK).json({ user: tokenUser })
  } catch (error) {
    next(error)
  }
}

const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.user) {
      await Token.findOneAndDelete({ user: req.user.userId })
    }

    res.cookie('accessToken', 'logout', {
      httpOnly: true,
      expires: new Date(Date.now()),
    })

    res.cookie('refreshToken', 'logout', {
      httpOnly: true,
      expires: new Date(Date.now()),
    })

    res
      .status(StatusCodes.OK)
      .json({ satus: 'success', message: 'Logged out successfully' })
  } catch (error) {
    next(error)
  }
}

export { register, verifyEmail, login, logout }
