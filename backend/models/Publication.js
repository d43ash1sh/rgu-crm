import mongoose from 'mongoose';

const publicationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  edition: { type: String },
  year: { type: String },
  pdfURL: { type: String, required: true },
  coverImageURL: { type: String }
});

export default mongoose.model('Publication', publicationSchema);
