import { StatusCodes } from "http-status-codes"
import User from "../models/Users"
import { Request, Response, NextFunction } from "express"
import CustomError from "../errors"
import {
  attachCookiesToResponse,
  checkPermission,
  createTokenUser,
} from "../utils"

const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await User.find({}).select("-password")
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
    const user = await User.findOne({ _id: userId }).select("-password")

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

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email } = req.body
  if (!name || !email) {
    throw new CustomError.BadRequestError("Provide all values")
  }

  try {
    if (req.user) {
      const user = await User.findOne({ _id: req.user.userId })

      if (!user) {
        throw new CustomError.NotFoundError("User not found")
      }
      user.name = name
      user.email = email

      await user.save()

      const tokenUser = createTokenUser(user)
      attachCookiesToResponse({ res, user: tokenUser })
      res.status(StatusCodes.OK).json({ user: tokenUser })
    }
  } catch (error) {
    next(error)
  }
}

export { getAllUsers, getSingleUser, showCurrentUser, updateUser }
