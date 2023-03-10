import type { NextApiRequest } from 'next'
import type { AuthResponse } from '@backend/types'

import { object, string, ValidationError } from 'yup'
import { MethodNotAllowedError } from '@backend/errors'
import { hashSync } from 'bcryptjs'
import { prisma } from '@database/prisma'
import {
  generateRefreshTokenCookie,
  generateTokens,
} from '@backend/auth/authUtils'

export const registerHandler = async (
  request: NextApiRequest,
  response: AuthResponse
) => {
  if (request.method !== 'POST') {
    return handleErrorResponse(response)(new MethodNotAllowedError())
  }
  return validateRequestBody(request.body)
    .then(createUser)
    .then(generateTokens)
    .then(handleRegisterResponse(response))
    .catch(handleErrorResponse(response))
}

const handleRegisterResponse =
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

const createUser = async ({
  email,
  password,
}: {
  email: string
  password: string
}) => {
  return prisma.user.create({
    data: {
      email,
      password: hashSync(password, 10),
    },
  })
}

const validateRequestBody = async (requestBody: unknown) => {
  return requestBodySchema.validate(requestBody, {
    strict: true,
    stripUnknown: true,
    abortEarly: false,
  })
}

const emailSchema = string()
  .email('Invalid email')
  .test({
    name: 'newEmail',
    message: 'Email already exists',
    exclusive: true,
    test: async (value) => {
      if (value === undefined) {
        return true
      }
      return !(await prisma.user.findFirst({
        where: {
          email: value,
        },
      }))
    },
  })
  .required('Email is required')

const passwordSchema = string()
  .min(8, 'Password must contain at least 8 characters')
  .max(255, 'Password must contain no more than 255 characters')
  .test({
    name: 'atLeastOneUppercase',
    message: 'Password must contain at least 1 uppercase letter',
    exclusive: true,
    test: (value) => value === undefined || matchCount(value, /[A-Z]/g) >= 1,
  })
  .test({
    name: 'atLeastOneNumber',
    message: 'Password must contain at least 1 number',
    exclusive: true,
    test: (value) => value === undefined || matchCount(value, /[0-9]/g) >= 1,
  })
  .test({
    name: 'atLeastOneSymbol',
    message: 'Password must contain at least 1 symbol',
    exclusive: true,
    test: (value) =>
      value === undefined || matchCount(value, /[^a-zA-Z0-9\s]/g) >= 1,
  })
  .required('Password is required')

const requestBodySchema = object()
  .typeError('Email is required | Password is required')
  .shape({
    email: emailSchema,
    password: passwordSchema,
  })

const matchCount = (string: string, regex: RegExp) => {
  const matches = regex.exec(string) ?? []
  return matches.length
}

const handleErrorResponse = (response: AuthResponse) => (error: Error) => {
  if (error instanceof MethodNotAllowedError) {
    return response.status(405).json({
      statusCode: 405,
      message: "Only Http Method 'POST' is supported",
    })
  }
  if (error instanceof ValidationError) {
    return response.status(422).json({
      statusCode: 422,
      message: error.errors.join(' | '),
    })
  }
  return response.status(500).json({
    statusCode: 500,
    message: 'Internal Server Error',
  })
}
