import { NextApiResponse } from 'next'

export type AccessTokenPayload = {
  userId: number
  email: string
}

export type HttpErrorResponse = {
  statusCode: number
  message: string
}

export type AuthResponse = NextApiResponse<
  | HttpErrorResponse
  | {
      accessToken: string
    }
>
