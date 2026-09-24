import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/User.js';
import { config } from '../config/env.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token = req.cookies.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, config.jwtSecret);
      req.user = await User.findById(decoded.id).select('-password');
      return next();
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});