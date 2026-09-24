import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  dbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/alphabin',
  jwtSecret: process.env.JWT_SECRET || 'secret',
  env: process.env.NODE_ENV || 'development'
};
