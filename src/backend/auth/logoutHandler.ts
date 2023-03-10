import type { AccessTokenPayload, HttpErrorResponse } from '@backend/types'
import type { NextApiRequest, NextApiResponse } from 'next'

import { InvalidCredentialsError, MethodNotAllowedError } from '@backend/errors'
import { generateRefreshTokenCookie } from '@backend/auth/authUtils'
import { verify as jwtVerify } from 'jsonwebtoken'
import { prisma } from '@database/prisma'

export const logoutHandler = async (
  request: NextApiRequest,
  response: LogoutResponse
) => {
  if (request.method !== 'POST') {
    return handleErrorResponse(response)(new MethodNotAllowedError())
  }
  return verifyAuthHeader(request.headers.authorization)
    .then(handleLogoutResponse(response))
    .catch(handleErrorResponse(response))
}

const verifyAuthHeader = async (authorizationHeader: string | undefined) => {
  if (!authorizationHeader) {
    throw new InvalidCredentialsError()
  }

  try {
    const decodedAccessToken = jwtVerify(
      authorizationHeader.replace('Bearer ', ''),
      'MY_VERY_SECURED_SECRET'
    ) as AccessTokenPayload

    return decodedAccessToken
  } catch (_: unknown) {
    throw new InvalidCredentialsError()
  }
}

const handleLogoutResponse =
  (response: LogoutResponse) =>
  async (decodedAccessToken: AccessTokenPayload) => {
    const refreshToken = await prisma.refreshToken.findFirst({
      where: {
        userId: decodedAccessToken.userId,
      },
    })

    if (!refreshToken) {
      throw new UserAlreadyLoggedOutError()
    }
    await prisma.refreshToken.delete({
      where: {
        userId: decodedAccessToken.userId,
      },
    })

    response
      .setHeader(
        'Set-Cookie',
        generateRefreshTokenCookie(refreshToken.refreshToken, {
          maxAge: 0,
        })
      )
      .status(204)
      .end()
  }

const handleErrorResponse = (response: LogoutResponse) => (error: Error) => {
  if (error instanceof MethodNotAllowedError) {
    return response.status(405).json({
      statusCode: 405,
      message: "Only Http Method 'POST' is supported",
    })
  }
  if (error instanceof InvalidCredentialsError) {
    return response.status(401).json({
      statusCode: 401,
      message: 'Invalid credentials',
    })
  }
  if (error instanceof UserAlreadyLoggedOutError) {
    return response.status(409).json({
      statusCode: 409,
      message: 'User has already logged out',
    })
  }
  return response.status(500).json({
    statusCode: 500,
    message: 'Internal Server Error',
  })
}

class UserAlreadyLoggedOutError extends Error {}

type LogoutResponse = NextApiResponse<HttpErrorResponse | void>
