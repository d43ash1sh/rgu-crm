import mongoose from 'mongoose';

const roommateRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  budget: { type: Number, required: true },
  gender: { type: String, enum: ['Boys', 'Girls', 'Mixed'], default: 'Mixed' },
  course: { type: String, default: '' },
  semester: { type: String, default: '' },
  habits: {
    smoking: { type: Boolean, default: false },
    drinking: { type: Boolean, default: false },
    pets: { type: Boolean, default: false }
  },
  bio: { type: String, default: '' },
  preferredLocation: { type: String, default: '' },
  preferredBudget: { type: Number, default: 0 },
  preferredRoommate: { type: String, default: '' },
  contact: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('RoommateRequest', roommateRequestSchema);
