import { PrismaClient } from '@prisma/client';

declare global {
  // allow global `prisma` in development to avoid too many clients
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma ?? new PrismaClient();

if (process.env.NODE_ENV === 'development') {
  global.prisma = prisma;
}

export default prisma;
