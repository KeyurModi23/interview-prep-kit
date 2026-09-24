import mongoose from 'mongoose';

const kitSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  data: { type: Object, required: true }
}, { timestamps: true });

export const Kit = mongoose.model('Kit', kitSchema);