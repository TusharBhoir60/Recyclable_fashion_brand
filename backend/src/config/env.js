require('dotenv').config();

const requiredVars = ['DATABASE_URL', 'JWT_SECRET', 'JWT_REFRESH_SECRET'];
const productionOnlyVars = [
  'CLIENT_URL',
  'RAZORPAY_KEY_ID',
  'RAZORPAY_KEY_SECRET',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
];

for (const key of requiredVars) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

function withSslMode(url) {
  if (!url) return url;
  if (url.includes('sslmode=')) return url;
  const joiner = url.includes('?') ? '&' : '?';
  return `${url}${joiner}sslmode=require`;
}

if ((process.env.NODE_ENV || 'development') === 'production') {
  for (const key of productionOnlyVars) {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable in production: ${key}`);
    }
  }
}

// Supabase Postgres typically requires SSL; patch DATABASE_URL at runtime.
process.env.DATABASE_URL = withSslMode(process.env.DATABASE_URL);

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  clientUrl: process.env.CLIENT_URL || '*',

  databaseUrl: process.env.DATABASE_URL,

  jwt: {
    accessSecret: process.env.JWT_SECRET,
    accessExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  },

  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || '',
  },

  mlServiceUrl: process.env.ML_SERVICE_URL || 'http://localhost:8000',
  adminJwtToken: process.env.ADMIN_JWT_TOKEN || '',
};

module.exports = env;