import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import bcrypt from 'bcryptjs';

export const registerUser = async (userData) => {
  const { name, email, password } = userData;

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new AppError('User already exists', 400);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword
  });

  const token = jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: '30d' });

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    token
  };
};

export const getUsers = async () => {
  return await User.find({});
};
