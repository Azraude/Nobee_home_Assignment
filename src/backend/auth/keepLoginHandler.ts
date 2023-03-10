import type { NextApiRequest } from 'next'
import type { AuthResponse } from '@backend/types'

import { InvalidCredentialsError, MethodNotAllowedError } from '@backend/errors'
import { prisma } from '@database/prisma'
import {
  generateRefreshTokenCookie,
  generateTokens,
} from '@backend/auth/authUtils'

export const keepLoginHandler = async (
  request: NextApiRequest,
  response: AuthResponse
) => {
  if (request.method !== 'POST') {
    return handleErrorResponse(response)(new MethodNotAllowedError())
  }
  return findLoggedInUser(request.cookies.refreshToken)
    .then(generateTokens)
    .then(handleKeepLoginResponse(response))
    .catch(handleErrorResponse(response))
}

const handleKeepLoginResponse =
  (response: AuthResponse) =>
  ({
    accessToken,
    refreshToken,
  }: {
    accessToken: string
    refreshToken: string
  }) => {
    return response
      .setHeader('Set-Cookie', generateRefreshTokenCookie(refreshToken))
      .json({ accessToken })
  }

const findLoggedInUser = async (refreshToken?: string) => {
  if (!refreshToken) {
    throw new InvalidCredentialsError()
  }

  const refreshTokenFromDb = await prisma.refreshToken.findFirst({
    where: {
      refreshToken,
    },
    include: {
      user: true,
    },
  })

  if (!refreshTokenFromDb) {
    throw new InvalidCredentialsError()
  }

  return refreshTokenFromDb.user
}

const handleErrorResponse = (response: AuthResponse) => (error: Error) => {
  if (error instanceof InvalidCredentialsError) {
    return response.status(401).json({
      statusCode: 401,
      message: 'Invalid credentials',
    })
  }
  if (error instanceof MethodNotAllowedError) {
    return response.status(405).json({
      statusCode: 405,
      message: "Only Http Method 'POST' is supported",
    })
  }
  return response.status(500).json({
    statusCode: 500,
    message: 'Internal Server Error',
  })
}
