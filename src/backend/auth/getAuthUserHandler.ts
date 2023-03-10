import type { AccessTokenPayload, HttpErrorResponse } from '@backend/types'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { Except } from 'type-fest'
import type { User } from '.prisma/client'

import { InvalidCredentialsError, MethodNotAllowedError } from '@backend/errors'
import { verify as jwtVerify } from 'jsonwebtoken'
import { prisma } from '@database/prisma'

export const getAuthUserHandler = async (
  request: NextApiRequest,
  response: AuthUserResponse
) => {
  if (request.method !== 'GET') {
    return handleErrorResponse(response)(new MethodNotAllowedError())
  }
  return verifyAuthHeader(request.headers.authorization)
    .then(getAuthUser)
    .then(handleGetAuthUserResponse(response))
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

const getAuthUser = async (decodedAccessToken: AccessTokenPayload) => {
  const user = await prisma.user.findFirst({
    where: {
      id: decodedAccessToken.userId,
    },
  })
  if (!user) {
    throw new InvalidCredentialsError()
  }
  return user
}

const handleGetAuthUserResponse =
  (response: AuthUserResponse) =>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async ({ password, ...user }: User) => {
    response.status(200).json(user)
  }

const handleErrorResponse = (response: AuthUserResponse) => (error: Error) => {
  if (error instanceof MethodNotAllowedError) {
    return response.status(405).json({
      statusCode: 405,
      message: "Only Http Method 'GET' is supported",
    })
  }
  if (error instanceof InvalidCredentialsError) {
    return response.status(401).json({
      statusCode: 401,
      message: 'Invalid credentials',
    })
  }
  return response.status(500).json({
    statusCode: 500,
    message: 'Internal Server Error',
  })
}

type AuthUserResponse = NextApiResponse<
  HttpErrorResponse | Except<User, 'password'>
>
