import mongoose from 'mongoose';

const galleryItemSchema = new mongoose.Schema({
  src: { type: String, required: true },
  title: { type: String },
  category: { type: String, default: 'General' },
  date: { type: String },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('GalleryItem', galleryItemSchema);
