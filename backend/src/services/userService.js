import { User } from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export const registerUser = async (data) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(data.password, salt);
  const user = await User.create({ name: data.name, email: data.email, password: hashedPassword });
  return user;
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  if (user && (await bcrypt.compare(password, user.password))) {
    return user;
  }
  throw new Error('Invalid email or password');
};

export const generateToken = (id) => jwt.sign({ id }, config.jwtSecret, { expiresIn: '30d' });