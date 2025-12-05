import mongoose from 'mongoose';
import { env } from '../config/env.js';

export const connectDb = async () => {
  await mongoose.connect(env.mongoUri, {
    autoIndex: true
  });
  return mongoose.connection;
};
