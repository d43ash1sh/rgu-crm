import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  reason: { 
    type: String, 
    enum: ['Spam', 'Fake Listing', 'Wrong Information', 'Already Occupied', 'Fraud', 'Other'], 
    required: true 
  },
  comment: { type: String, default: '' },
  userEmail: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now }
});

const housingListingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  category: { 
    type: String, 
    enum: ['Flat', 'PG', 'Room', 'Hostel', 'Roommate Wanted'], 
    required: true 
  },
  rent: { type: Number, required: true },
  deposit: { type: Number, default: 0 },
  address: { type: String, required: true },
  village: { type: String, required: true },
  landmark: { type: String, default: '' },
  coordinates: { type: String, default: '' }, // format: "lat, lng"
  availableFrom: { type: Date, default: Date.now },
  genderPreference: { 
    type: String, 
    enum: ['Boys', 'Girls', 'Mixed'], 
    default: 'Mixed' 
  },
  sharingType: { type: String, default: 'Single' },
  amenities: [{ type: String }],
  rules: [{ type: String }],
  phone: { type: String, required: true },
  whatsapp: { type: String, default: '' },
  images: [{ type: String }], // Up to 10 image URLs
  ownerName: { type: String, required: true },
  userEmail: { type: String, required: true }, // link to posting student
  views: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['draft', 'pending', 'approved', 'rejected', 'expired', 'archived', 'suspended', 'deleted'], 
    default: 'pending' 
  },
  rejectionReason: { type: String, default: '' },
  reports: [reportSchema],
  joinedDate: { type: Date, default: Date.now }
});

export default mongoose.model('HousingListing', housingListingSchema);
