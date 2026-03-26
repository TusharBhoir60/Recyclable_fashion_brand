// Ensure env validation + runtime DATABASE_URL patch happens before Prisma connects.
require('../config/env');

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = prisma;