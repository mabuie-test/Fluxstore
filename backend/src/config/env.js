import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: process.env.PORT || 4000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/fluxstore',
  jwtSecret: process.env.JWT_SECRET || 'super-secret-key',
  allowAdminSelfSignup: process.env.ALLOW_ADMIN_SELF_SIGNUP === 'true',
  mpesa: {
    consumerKey: process.env.MPESA_CONSUMER_KEY || 'your-consumer-key',
    consumerSecret: process.env.MPESA_CONSUMER_SECRET || 'your-consumer-secret',
    shortcode: process.env.MPESA_SHORTCODE || '600000',
    initiatorName: process.env.MPESA_INITIATOR || 'testapi',
    initiatorPassword: process.env.MPESA_INITIATOR_PASSWORD || 'password',
    baseUrl: process.env.MPESA_BASE_URL || 'https://sandbox.safaricom.co.ke'
  },
  mail: {
    smtpHost: process.env.SMTP_HOST || 'smtp.example.com',
    smtpPort: Number(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER || 'no-reply@example.com',
    password: process.env.SMTP_PASSWORD || 'password'
  }
};
