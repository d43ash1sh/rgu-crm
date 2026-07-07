import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  department: { type: String },
  photoURL: { type: String },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('TeamMember', teamMemberSchema);
