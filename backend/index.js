import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { upload } from './cloudinary.js';

import Member from './models/Member.js';
import Notice from './models/Notice.js';
import Event from './models/Event.js';
import Publication from './models/Publication.js';
import Admin from './models/Admin.js';

dotenv.config();

const app = express();

// Configure CORS for production
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || '*', 
  credentials: true
}));
app.use(express.json());

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/rguasf';
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey123';

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    // Ensure default admin exists
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const defaultAdmin = new Admin({ email: 'admin@asf.rgu', password: 'password123' });
      await defaultAdmin.save();
      console.log('Default admin created: admin@asf.rgu / password123');
    }
  })
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    console.log('Make sure MongoDB is running locally or MONGO_URI is set in .env');
  });

// Authentication Middleware
const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized. No token provided.' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Forbidden. Invalid token.' });
  }
};

// ----------------------------------------------------------------------
// Auth Routes
// ----------------------------------------------------------------------
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });
    
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    
    const token = jwt.sign({ id: admin._id, email: admin.email }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, email: admin.email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------------------------
// Member Routes
// ----------------------------------------------------------------------
app.get('/api/members', async (req, res) => {
  try {
    const members = await Member.find().sort({ joinedDate: -1 });
    res.json(members);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/members', async (req, res) => {
  try {
    const newMember = new Member({
      name: req.body.name,
      email: req.body.email || 'user@example.com',
      department: req.body.department || 'Unknown',
      year: req.body.year || '1st Year',
      contact: req.body.contact || '0000000000',
      status: 'pending'
    });
    await newMember.save();
    res.json(newMember);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.patch('/api/members/:id', requireAuth, async (req, res) => {
  try {
    const { status } = req.body; // e.g. 'active', 'rejected'
    const member = await Member.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(member);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ----------------------------------------------------------------------
// Notice, Event, Publication Stubs (Scalability)
// ----------------------------------------------------------------------
// Real implementations.
app.get('/api/notices', async (req, res) => {
  try {
    const notices = await Notice.find().sort({ timestamp: -1 });
    res.json(notices);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/notices', requireAuth, async (req, res) => {
  try {
    const notice = new Notice(req.body);
    await notice.save();
    res.json(notice);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ----------------------------------------------------------------------
// Dashboard Route
// ----------------------------------------------------------------------
app.get('/api/dashboard', async (req, res) => {
  // Aggregate stats from MongoDB
  try {
    const totalMembers = await Member.countDocuments({ status: 'active' });
    const pendingApplications = await Member.find({ status: 'pending' }).sort({ joinedDate: -1 }).limit(5);
    const notices = await Notice.countDocuments();
    const events = await Event.countDocuments({ date: { $gte: new Date() } });
    const publications = await Publication.countDocuments();

    res.json({
      stats: {
        totalMembers,
        notices,
        events,
        publications
      },
      pendingApplications: pendingApplications.map(m => ({
        id: m._id.toString(),
        name: m.name,
        department: m.department,
        status: m.status,
        date: m.joinedDate
      })),
      activities: [
        { title: `${pendingApplications.length} pending applications for review`, time: '10 mins ago' },
        { title: `System optimized, MongoDB initialized`, time: '1 hr ago' }
      ]
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to aggregate dashboard metrics' });
  }
});

// ----------------------------------------------------------------------
// Cloudinary Upload
// ----------------------------------------------------------------------
app.post('/api/upload', requireAuth, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file provided' });
  }
  res.json({ url: req.file.path });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
