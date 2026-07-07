import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  time: { type: Date, default: Date.now }
});

export default mongoose.model('ActivityLog', activityLogSchema);
