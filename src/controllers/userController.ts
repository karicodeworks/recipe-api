import { StatusCodes } from 'http-status-codes'
import User from '../models/Users'
import { Request, Response, NextFunction } from 'express'
import CustomError from '../errors'
import { checkPermission } from '../utils'

const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await User.find({}).select('-password')
    res.status(StatusCodes.OK).json({ users })
  } catch (error) {
    next(error)
  }
}

const getSingleUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: userId } = req.params
    const user = await User.findOne({ _id: userId }).select('-password')

    if (!user) {
      throw new CustomError.NotFoundError(`No user with id: ${userId}`)
    }

    checkPermission(req.user, user._id.toString())

    res.status(StatusCodes.OK).json({ user })
  } catch (error) {
    next(error)
  }
}

const showCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user
    res.status(StatusCodes.OK).json({ user })
  } catch (error) {
    next(error)
  }
}

export { getAllUsers, getSingleUser, showCurrentUser }
