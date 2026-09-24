import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse } from '../utils/responseFormatter.js';
import * as kitService from '../services/kitService.js';
import { AppError } from '../utils/AppError.js';

export const generate = asyncHandler(async (req, res, next) => {
  const { jobDescription, companyUrl, days } = req.body;
  if (!jobDescription) {
    return next(new AppError('Please provide a job description', 400));
  }

  const kit = await kitService.generateKit(jobDescription, companyUrl, days);
  return successResponse(res, 'Kit generated successfully', kit, 201);
});

import { Kit } from '../models/Kit.js';
export const getKits = asyncHandler(async (req, res) => {
  const kits = await Kit.find({ user: req.user._id }).sort('-createdAt');
  return successResponse(res, 'Kits fetched', kits);
});
export const saveKit = asyncHandler(async (req, res) => {
  const kit = await Kit.create({ user: req.user._id, title: req.body.title || 'Untitled', data: req.body.kit });
  return successResponse(res, 'Kit saved', kit, 201);
});
export const getKitById = asyncHandler(async (req, res) => {
  const kit = await Kit.findOne({ _id: req.params.id, user: req.user._id });
  if (!kit) throw new Error('Kit not found');
  return successResponse(res, 'Kit fetched', kit);
});

export const updateKit = asyncHandler(async (req, res) => {
  const kit = await Kit.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { data: req.body.kit },
    { new: true }
  );
  if (!kit) throw new Error('Kit not found');
  return successResponse(res, 'Kit updated', kit);
});
