import { PrismaClient } from '@prisma/client'

// Prevent multiple instances of Prisma Client in development
declare const global: typeof globalThis & { prismaClient?: PrismaClient }

const prismaClient = global.prismaClient || new PrismaClient()
if (process.env.NODE_ENV === 'development') {
  global.prismaClient = prismaClient
}

export const prisma = prismaClient
