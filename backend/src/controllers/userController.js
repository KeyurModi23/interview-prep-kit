import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse } from '../utils/responseFormatter.js';
import * as userService from '../services/userService.js';

const setTokenCookie = (res, userId) => {
  const token = userService.generateToken(userId);
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

export const register = asyncHandler(async (req, res) => {
  const user = await userService.registerUser(req.body);
  setTokenCookie(res, user._id);
  return successResponse(res, 'Registered successfully', { _id: user._id, name: user.name, email: user.email }, 201);
});

export const login = asyncHandler(async (req, res) => {
  const user = await userService.loginUser(req.body.email, req.body.password);
  setTokenCookie(res, user._id);
  return successResponse(res, 'Logged in successfully', { _id: user._id, name: user.name, email: user.email });
});

export const logout = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', { httpOnly: true, expires: new Date(0), secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict' });
  return successResponse(res, 'Logged out successfully');
});

export const getMe = asyncHandler(async (req, res) => {
  return successResponse(res, 'User profile fetched', { _id: req.user._id, name: req.user.name, email: req.user.email });
});