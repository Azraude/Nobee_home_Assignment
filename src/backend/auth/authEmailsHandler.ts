import type { NextApiRequest, NextApiResponse } from 'next'
import type { HttpErrorResponse } from '@backend/types'

import { object, string, ValidationError } from 'yup'
import { MethodNotAllowedError } from '@backend/errors'
import { prisma } from '@database/prisma'

export const authEmailsHandler = async (
  request: NextApiRequest,
  response: VerifyEmailResponse
) => {
  if (request.method !== 'HEAD') {
    return handleErrorResponse(response)(new MethodNotAllowedError())
  }
  return validateRequestQuery(request.query)
    .then(verifyEmail)
    .then(handleVerifyEmailResponse(response))
    .catch(handleErrorResponse(response))
}

const handleVerifyEmailResponse = (response: VerifyEmailResponse) => () => {
  return response.status(204).end()
}

const verifyEmail = async ({ email }: { email: string }) => {
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  })

  if (!user) {
    throw new EmailNotFoundError()
  }
}

const validateRequestQuery = async (requestQuery: unknown) => {
  return requestQuerySchema.validate(requestQuery, {
    strict: true,
    stripUnknown: true,
    abortEarly: false,
  })
}

const requestQuerySchema = object()
  .typeError('Email is required')
  .shape({
    email: string().email('Invalid email').required('Email is required'),
  })

const handleErrorResponse =
  (response: VerifyEmailResponse) => (error: Error) => {
    if (error instanceof ValidationError) {
      return response.status(422).json({
        statusCode: 422,
        message: error.errors.join(' | '),
      })
    }
    if (error instanceof EmailNotFoundError) {
      return response.status(404).json({
        statusCode: 404,
        message: 'Email not found',
      })
    }
    if (error instanceof MethodNotAllowedError) {
      return response.status(405).json({
        statusCode: 405,
        message: "Only Http Method 'HEAD' is supported",
      })
    }
    return response.status(500).json({
      statusCode: 500,
      message: 'Internal Server Error',
    })
  }

class EmailNotFoundError extends Error {}

type VerifyEmailResponse = NextApiResponse<HttpErrorResponse>
