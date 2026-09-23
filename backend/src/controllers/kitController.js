import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse } from '../utils/responseFormatter.js';
import * as kitService from '../services/kitService.js';
import { AppError } from '../utils/AppError.js';

export const generate = asyncHandler(async (req, res, next) => {
  const { jobDescription } = req.body;
  if (!jobDescription) {
    return next(new AppError('Please provide a job description', 400));
  }

  const kit = await kitService.generateKit(jobDescription);
  return successResponse(res, 'Kit generated successfully', kit, 201);
});
