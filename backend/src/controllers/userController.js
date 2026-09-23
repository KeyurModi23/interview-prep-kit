import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse } from '../utils/responseFormatter.js';
import * as userService from '../services/userService.js';

export const register = asyncHandler(async (req, res, next) => {
  const data = await userService.registerUser(req.body);
  return successResponse(res, 'User registered successfully', data, 201);
});

export const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await userService.getUsers();
  return successResponse(res, 'Users fetched successfully', users);
});
