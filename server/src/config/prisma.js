const { PrismaClient } = require('@prisma/client');

// Initialize Prisma Client instance
// Logs queries in development for debugging & performance auditing
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

module.exports = prisma;
