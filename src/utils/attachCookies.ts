import { Response } from "express"
import jwt from "jsonwebtoken"

interface User {
  userId?: any
  name: string
  role: string
}

interface Payload {
  user: User
  refreshToken?: string
}

interface AttachCookiesFields {
  res: Response
  user: User
  refreshToken?: string
}

const createJWT = (payload: Payload): string => {
  return jwt.sign(payload, process.env.SECRET_KEY as string)
}

const isTokenValid = (token: string) =>
  jwt.verify(token, process.env.SECRET_KEY as string)

const attachCookiesToResponse = ({
  res,
  user,
  refreshToken,
}: AttachCookiesFields): void => {
  const accessTokenJWT = createJWT({ user: user })
  const refreshTokenJWT = createJWT({ user: user, refreshToken })

  const oneHour = 1000 * 60 * 60
  const thirtyDays: number = 1000 * 60 * 60 * 24 * 30

  res.cookie("accessToken", accessTokenJWT, {
    httpOnly: true,
    expires: new Date(Date.now() + oneHour),
    secure: process.env.NODE_ENV === "production",
    signed: true,
    sameSite: "strict",
  })

  res.cookie("refreshToken", refreshTokenJWT, {
    httpOnly: true,
    expires: new Date(Date.now() + thirtyDays),
    secure: process.env.NODE_ENV === "production",
    signed: true,
    sameSite: "strict",
  })
}

export { createJWT, isTokenValid, attachCookiesToResponse }
