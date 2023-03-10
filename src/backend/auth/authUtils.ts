import type { CookieSerializeOptions } from 'cookie'
import type { AccessTokenPayload } from '@backend/types'
import type { SignOptions } from 'jsonwebtoken'
import type { User } from '@prisma/client'

import { serialize as serializeCookie } from 'cookie'
import { sign as signJwt } from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { prisma } from '@database/prisma'

export const generateTokens = async (user: User) => {
  const [accessToken, refreshToken] = await Promise.all([
    generateAccessToken(user),
    generateRefreshToken(user.id),
  ])
  return { accessToken, refreshToken }
}

export const generateRefreshTokenCookie = (
  refreshToken: string,
  {
    httpOnly = true,
    secure = process.env.NODE_ENV === 'production',
    path = '/api',
    maxAge = 30 * 24 * 60 * 60, // 30 days
    sameSite = 'lax',
  }: CookieSerializeOptions = {}
) =>
  serializeCookie('refreshToken', refreshToken, {
    httpOnly,
    secure,
    path,
    maxAge,
    sameSite,
  })

const generateAccessToken = (user: User) => {
  const payload: AccessTokenPayload = {
    userId: user.id,
    email: user.email,
  }
  const signOptions: SignOptions = {
    algorithm: 'HS256',
    expiresIn: 15 * 60, // 15m * 60s
  }
  return signJwt(payload, 'MY_VERY_SECURED_SECRET', signOptions)
}

const generateRefreshToken = async (userId: number) => {
  const { refreshToken } = await prisma.refreshToken.upsert({
    where: {
      userId,
    },
    update: {
      refreshToken: uuidv4(),
    },
    create: {
      userId,
      refreshToken: uuidv4(),
    },
  })
  return refreshToken
}
