import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  department: { type: String, required: true },
  year: { type: String, required: true },
  contact: { type: String, required: true },
  rollNumber: { type: String, required: true },
  homeDistrict: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  gender: { type: String, required: true },
  status: { type: String, enum: ['pending', 'active', 'rejected'], default: 'pending' },
  joinedDate: { type: Date, default: Date.now }
});

export default mongoose.model('Member', memberSchema);
