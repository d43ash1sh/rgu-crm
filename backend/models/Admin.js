import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  loginAttempts: { type: Number, required: true, default: 0 },
  lockUntil: { type: Date },
  
  // Passkey (WebAuthn)
  passkeyRegistered: { type: Boolean, default: false },
  passkeyCredentialID: { type: String }, // Base64URL
  passkeyPublicKey: { type: String },    // Base64URL
  passkeyCounter: { type: Number, default: 0 },
  currentChallenge: { type: String }
});

adminSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

adminSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('Admin', adminSchema);
