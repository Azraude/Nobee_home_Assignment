import type { NextApiRequest } from 'next'
import type { AuthResponse } from '@backend/types'

import { InvalidCredentialsError, MethodNotAllowedError } from '@backend/errors'
import { object, string, ValidationError } from 'yup'
import { compareSync } from 'bcryptjs'
import { prisma } from '@database/prisma'
import {
  generateRefreshTokenCookie,
  generateTokens,
} from '@backend/auth/authUtils'

export const loginHandler = async (
  request: NextApiRequest,
  response: AuthResponse
) => {
  if (request.method !== 'POST') {
    return handleErrorResponse(response)(new MethodNotAllowedError())
  }
  return validateRequestBody(request.body)
    .then(validateCredentials)
    .then(generateTokens)
    .then(handleLoginResponse(response))
    .catch(handleErrorResponse(response))
}

const handleLoginResponse =
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

const validateCredentials = async ({
  email,
  password,
}: {
  email: string
  password: string
}) => {
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  })

  if (!user) {
    throw new InvalidCredentialsError()
  }
  if (!compareSync(password, user.password)) {
    throw new InvalidCredentialsError()
  }

  return user
}

const validateRequestBody = async (requestBody: unknown) => {
  return requestBodySchema.validate(requestBody, {
    strict: true,
    stripUnknown: true,
    abortEarly: false,
  })
}

const requestBodySchema = object()
  .typeError('Email is required | Password is required')
  .shape({
    email: string().email('Invalid email').required('Email is required'),
    password: string().required('Password is required'),
  })

const handleErrorResponse = (response: AuthResponse) => (error: Error) => {
  if (error instanceof ValidationError) {
    return response.status(422).json({
      statusCode: 422,
      message: error.errors.join(' | '),
    })
  }
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
