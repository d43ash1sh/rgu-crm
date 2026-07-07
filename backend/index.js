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
import HousingListing from './models/HousingListing.js';
import GalleryItem from './models/GalleryItem.js';
import ActivityLog from './models/ActivityLog.js';
import TeamMember from './models/TeamMember.js';
import RoommateRequest from './models/RoommateRequest.js';

import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse
} from '@simplewebauthn/server';

dotenv.config();

const app = express();

// Configure CORS to support dynamic origins with credentials
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    callback(null, true);
  },
  credentials: true
}));
app.use(express.json());

// Manual cookie parser helper
const parseCookies = (cookieHeader) => {
  const cookies = {};
  if (!cookieHeader) return cookies;
  cookieHeader.split(';').forEach(cookie => {
    const parts = cookie.split('=');
    const name = parts[0].trim();
    const value = parts.slice(1).join('=');
    cookies[name] = decodeURIComponent(value);
  });
  return cookies;
};

const getRpID = (req) => {
  const host = req.hostname;
  if (host === '127.0.0.1' || host === '::1' || host === '::ffff:127.0.0.1') {
    return 'localhost';
  }
  return host;
};

const logActivity = async (title) => {
  try {
    const log = new ActivityLog({ title });
    await log.save();
  } catch (err) {
    console.error('Failed to log activity:', err);
  }
};

// CSRF Protection Middleware
const csrfProtection = (req, res, next) => {
  const method = req.method;
  if (['GET', 'HEAD', 'OPTIONS', 'TRACE'].includes(method)) {
    return next();
  }
  const requestedWith = req.headers['x-requested-with'];
  const csrfHeader = req.headers['x-csrf-token'];
  if (!requestedWith && !csrfHeader) {
    return res.status(403).json({ message: 'CSRF token or requested-with header missing' });
  }
  next();
};
app.use(csrfProtection);

// Login Rate Limiter (In-Memory)
const loginAttemptsTracker = {};
const rateLimiter = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  if (!loginAttemptsTracker[ip]) {
    loginAttemptsTracker[ip] = [];
  }
  loginAttemptsTracker[ip] = loginAttemptsTracker[ip].filter(timestamp => now - timestamp < 15 * 60 * 1000);
  if (loginAttemptsTracker[ip].length >= 10) {
    return res.status(429).json({ message: 'Too many requests from this IP. Please try again in 15 minutes.' });
  }
  loginAttemptsTracker[ip].push(now);
  next();
};

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/rguasf';
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey123';

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    // Ensure default admins exist and are not locked out of password auth
    const adminsToSeed = [
      { email: 'admin@asf.rgu', password: 'password123' },
      { email: 'debashish@admin.com', password: 'deba5767' }
    ];
    for (const a of adminsToSeed) {
      const hasAdmin = await Admin.findOne({ email: a.email });
      if (!hasAdmin) {
        const newAdmin = new Admin({ 
          email: a.email, 
          password: a.password,
          passkeyRegistered: false 
        });
        await newAdmin.save();
        console.log(`Admin created: ${a.email}`);
      } else if (hasAdmin.passkeyRegistered) {
        // Reset passkey block on startup to prevent lockout for seed account
        hasAdmin.passkeyRegistered = false;
        hasAdmin.passkeyCredentialID = null;
        hasAdmin.passkeyPublicKey = null;
        hasAdmin.lockUntil = null;
        hasAdmin.loginAttempts = 0;
        await hasAdmin.save();
        console.log(`Admin passkey status reset to prevent lockout for: ${a.email}`);
      }
    }

    // Ensure seed student members exist
    const memberCount = await Member.countDocuments({ email: 'debashish@rgu.ac.in' });
    if (memberCount === 0) {
      await Member.insertMany([
        {
          name: "Debashish Bordoloi",
          email: "debashish@rgu.ac.in",
          rollNumber: "24CSE01",
          status: "active",
          department: "Department of Computer Science & Engineering",
          contact: "9365882910",
          year: "1st Year",
          gender: "Male",
          homeDistrict: "Kamrup",
          bloodGroup: "O+"
        }
      ]);
      console.log('Seed student members created.');
    }

    // Ensure seed housing listings exist
    const listingCount = await HousingListing.countDocuments();
    if (listingCount === 0) {
      await HousingListing.insertMany([
        {
          title: "Cozy PG Room near RGU Campus Gate 1",
          description: "A comfortable PG room with great ventilation. Just 5 minutes walk from RGU Gate 1. Includes clean water supply and shared kitchen space. Best for first year research scholars.",
          category: "PG",
          rent: 3500,
          deposit: 3500,
          address: "Gate 1, Doimukh Road",
          village: "Doimukh",
          landmark: "Opposite SBI ATM",
          genderPreference: "Boys",
          sharingType: "Single",
          amenities: ["Wifi", "Parking", "Water Supply", "Power Backup"],
          rules: ["No loud music after 10 PM", "Visitors not allowed overnight"],
          phone: "9365882910",
          whatsapp: "9365882910",
          ownerName: "Mr. Ranjit Saikia",
          userEmail: "debashish@rgu.ac.in",
          status: "approved",
          images: ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80"]
        }
      ]);
      console.log('Seed housing listings created.');
    }

    // Ensure seed roommate requests exist
    const roommateCount = await RoommateRequest.countDocuments();
    if (roommateCount === 0) {
      await RoommateRequest.insertMany([
        {
          name: "Debashish Bordoloi",
          email: "debashish@rgu.ac.in",
          budget: 10000,
          gender: "Boys",
          course: "M.Tech CS",
          semester: "2nd Semester",
          habits: { smoking: false, drinking: false, pets: true },
          bio: "Hey guys! I am looking for a roommate to share a 2BHK flat near Doimukh Gate. I like studying at night and keeping things clean. Pet friendly is preferred.",
          preferredLocation: "Doimukh",
          preferredBudget: 10000,
          preferredRoommate: "Quiet and clean student",
          contact: "9365882910"
        }
      ]);
      console.log('Seed roommate requests created.');
    }
  })
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    console.log('Make sure MongoDB is running locally or MONGO_URI is set in .env');
  });

// Authentication Middleware
const requireAuth = (req, res, next) => {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies['asf_admin_token'];
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
app.post('/api/auth/login', rateLimiter, async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Block password login if passkey is registered
    if (admin.passkeyRegistered) {
      return res.status(403).json({ message: 'Password authentication is disabled for this account. Please log in using your Passkey.' });
    }

    // Check account lockout
    if (admin.lockUntil && admin.lockUntil > Date.now()) {
      const waitTime = Math.ceil((admin.lockUntil - Date.now()) / 1000 / 60);
      return res.status(429).json({ message: `Account locked. Try again in ${waitTime} minutes.` });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      admin.loginAttempts += 1;
      if (admin.loginAttempts >= 5) {
        admin.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 mins lockout
        admin.loginAttempts = 0;
      }
      await admin.save();

      const remaining = 5 - admin.loginAttempts;
      return res.status(401).json({
        message: admin.lockUntil
          ? 'Account locked for 15 minutes due to too many failed attempts.'
          : `Invalid credentials. ${remaining} attempts remaining.`
      });
    }

    // Reset attempts on successful login
    admin.loginAttempts = 0;
    admin.lockUntil = undefined;
    await admin.save();

    const token = jwt.sign({ id: admin._id, email: admin.email }, JWT_SECRET, { expiresIn: '1d' });

    // Set secure HTTP-only cookie
    res.cookie('asf_admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.json({ email: admin.email, passkeyRegistered: admin.passkeyRegistered });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Passkey WebAuthn Endpoints
app.get('/api/auth/register-options', requireAuth, async (req, res) => {
  try {
    const admin = await Admin.findOne({ email: req.admin.email });
    if (!admin) return res.status(404).json({ error: 'Admin not found' });
    if (admin.passkeyRegistered) {
      return res.status(403).json({ error: 'Passkey is already registered.' });
    }

    const options = await generateRegistrationOptions({
      rpName: 'RGU Assam Students Forum',
      rpID: getRpID(req),
      userID: Uint8Array.from(Buffer.from(admin._id.toString())),
      userName: admin.email,
      userDisplayName: 'ASF Administrator',
      attestationType: 'none',
      authenticatorSelection: {
        residentKey: 'required',
        userVerification: 'required',
      },
    });

    admin.currentChallenge = options.challenge;
    await admin.save();

    res.json(options);
  } catch (err) {
    console.error('Register Options Error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/register-verify', requireAuth, async (req, res) => {
  try {
    const admin = await Admin.findOne({ email: req.admin.email });
    if (!admin) return res.status(404).json({ error: 'Admin not found' });
    if (admin.passkeyRegistered) {
      return res.status(403).json({ error: 'Passkey is already registered.' });
    }

    const verification = await verifyRegistrationResponse({
      response: req.body,
      expectedChallenge: admin.currentChallenge,
      expectedOrigin: req.headers.origin || `http://localhost:5173`,
      expectedRPID: getRpID(req),
    });

    if (verification.verified && verification.registrationInfo) {
      const { credential } = verification.registrationInfo;
      admin.passkeyCredentialID = credential.id;
      admin.passkeyPublicKey = Buffer.from(credential.publicKey).toString('base64url');
      admin.passkeyCounter = credential.counter;
      admin.passkeyRegistered = true;
      admin.currentChallenge = undefined;
      await admin.save();
      
      // Log this activity
      await logActivity('Registered first administrator passkey');

      return res.json({ verified: true });
    }

    res.status(400).json({ verified: false, error: 'Registration verification failed' });
  } catch (err) {
    console.error('Register Verify Error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/auth/login-options', async (req, res) => {
  try {
    const admin = await Admin.findOne({});
    if (!admin) return res.status(404).json({ error: 'Admin not found' });
    if (!admin.passkeyRegistered) {
      return res.status(400).json({ error: 'No passkey registered yet.' });
    }

    const options = await generateAuthenticationOptions({
      rpID: getRpID(req),
      allowCredentials: [{
        id: admin.passkeyCredentialID,
        type: 'public-key',
        transports: ['internal', 'usb', 'nfc', 'ble'],
      }],
      userVerification: 'required',
    });

    admin.currentChallenge = options.challenge;
    await admin.save();

    res.json(options);
  } catch (err) {
    console.error('Login Options Error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login-verify', rateLimiter, async (req, res) => {
  try {
    const admin = await Admin.findOne({});
    if (!admin) return res.status(404).json({ error: 'Admin not found' });
    if (!admin.passkeyRegistered) {
      return res.status(400).json({ error: 'No passkey registered yet.' });
    }

    const verification = await verifyAuthenticationResponse({
      response: req.body,
      expectedChallenge: admin.currentChallenge,
      expectedOrigin: req.headers.origin || `http://localhost:5173`,
      expectedRPID: getRpID(req),
      credential: {
        id: admin.passkeyCredentialID,
        publicKey: Buffer.from(admin.passkeyPublicKey, 'base64url'),
        counter: admin.passkeyCounter,
      },
    });

    if (verification.verified && verification.authenticationInfo) {
      admin.passkeyCounter = verification.authenticationInfo.newCounter;
      admin.currentChallenge = undefined;
      await admin.save();

      const token = jwt.sign({ id: admin._id, email: admin.email }, JWT_SECRET, { expiresIn: '1d' });

      res.cookie('asf_admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 1 day
      });

      // Log this activity
      await logActivity('Admin logged in securely using Passkey');

      return res.json({ verified: true, email: admin.email });
    }

    res.status(401).json({ verified: false, error: 'Authentication verification failed' });
  } catch (err) {
    console.error('Login Verify Error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/auth/me', async (req, res) => {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies['asf_admin_token'];
  if (!token) {
    const admin = await Admin.findOne({});
    const passkeyRegistered = admin ? admin.passkeyRegistered : false;
    return res.status(200).json({ authenticated: false, passkeyRegistered });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await Admin.findOne({ email: decoded.email });
    res.json({ 
      authenticated: true, 
      email: decoded.email, 
      passkeyRegistered: admin ? admin.passkeyRegistered : false 
    });
  } catch (err) {
    res.status(401).json({ authenticated: false });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('asf_admin_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  res.json({ message: 'Logged out successfully' });
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
      rollNumber: req.body.rollNumber || 'N/A',
      homeDistrict: req.body.homeDistrict || 'Unknown',
      bloodGroup: req.body.bloodGroup || 'O+',
      gender: req.body.gender || 'Male',
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
    if (member) {
      await logActivity(`Updated member ${member.name} status to ${status}`);
    }
    res.json(member);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/members/:id', requireAuth, async (req, res) => {
  try {
    const deleted = await Member.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Member not found' });
    await logActivity(`Deleted member account: ${deleted.name}`);
    res.json({ message: 'Member deleted successfully' });
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
    await logActivity(`Published notice: ${notice.title}`);
    res.json(notice);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/notices/:id', requireAuth, async (req, res) => {
  try {
    const deleted = await Notice.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Notice not found' });
    await logActivity(`Deleted notice: ${deleted.title}`);
    res.json({ message: 'Notice deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ----------------------------------------------------------------------
// Event Routes
// ----------------------------------------------------------------------
app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/events', requireAuth, async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    await logActivity(`Scheduled event: ${event.title}`);
    res.json(event);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/events/:id', requireAuth, async (req, res) => {
  try {
    const deleted = await Event.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Event not found' });
    await logActivity(`Deleted event: ${deleted.title}`);
    res.json({ message: 'Event deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ----------------------------------------------------------------------
// Publication Routes
// ----------------------------------------------------------------------
app.get('/api/publications', async (req, res) => {
  try {
    const publications = await Publication.find().sort({ year: -1 });
    res.json(publications);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/publications', requireAuth, async (req, res) => {
  try {
    const publication = new Publication(req.body);
    await publication.save();
    res.json(publication);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/publications/:id', requireAuth, async (req, res) => {
  try {
    const deleted = await Publication.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Publication not found' });
    res.json({ message: 'Publication deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ----------------------------------------------------------------------
// Gallery Routes
// ----------------------------------------------------------------------
app.get('/api/gallery', async (req, res) => {
  try {
    let items = await GalleryItem.find().sort({ timestamp: -1 });
    if (items.length < 29) {
      await GalleryItem.deleteMany({});
      const initialItems = [
        { src: '/images/gallery/bhupen_hazarika.jpg', title: 'Tribute to Dr. Bhupen Hazarika', category: 'Cultural', date: 'Sep 2025' },
        { src: '/images/gallery/ceremony_1.jpg', title: 'Inaugural Ceremony - Lamp Lighting', category: 'Ceremonies', date: 'Aug 2025' },
        { src: '/images/gallery/ceremony_2.jpg', title: 'Felicitation of Guests', category: 'Ceremonies', date: 'Aug 2025' },
        { src: '/images/gallery/rgu_assam_students_forum_1699290776_3230207616962026971_62127049418.webp', title: 'Interactive Session', category: 'Gatherings', date: 'Nov 2023' },
        { src: '/images/gallery/rgu_assam_students_forum_1699290776_3230207616962029829_62127049418.webp', title: 'Rongali Bihu Dance', category: 'Cultural', date: 'Nov 2023' },
        { src: '/images/gallery/rgu_assam_students_forum_1699290776_3230207616962144433_62127049418.webp', title: 'Stage Performance', category: 'Cultural', date: 'Nov 2023' },
        { src: '/images/gallery/rgu_assam_students_forum_1699290776_3230207616962190858_62127049418.webp', title: 'Bihu Dance Presentation', category: 'Cultural', date: 'Nov 2023' },
        { src: '/images/gallery/rgu_assam_students_forum_1699290776_3230207616962212850_62127049418.webp', title: 'Representative Gathering', category: 'Gatherings', date: 'Nov 2023' },
        { src: '/images/gallery/rgu_assam_students_forum_1699290776_3230207616970420701_62127049418.webp', title: 'Group Photo Session', category: 'Gatherings', date: 'Nov 2023' },
        { src: '/images/gallery/rgu_assam_students_forum_1699290776_3230207616970433812_62127049418.webp', title: 'General Body Session', category: 'Gatherings', date: 'Nov 2023' },
        { src: '/images/gallery/rgu_assam_students_forum_1699290776_3230207616970648569_62127049418.webp', title: 'Bihu Festives', category: 'Cultural', date: 'Apr 2024' },
        { src: '/images/gallery/rgu_assam_students_forum_1699290776_3230207617096298153_62127049418.webp', title: 'Chief Guest Welcome', category: 'Ceremonies', date: 'Apr 2024' },
        { src: '/images/gallery/rgu_assam_students_forum_1699290776_3230207617129789308_62127049418.webp', title: 'Bihu Celebration', category: 'Cultural', date: 'Apr 2024' },
        { src: '/images/gallery/rgu_assam_students_forum_1712679025_3342516384470541996_62127049418.webp', title: 'Cultural Showcase', category: 'Cultural', date: 'Apr 2024' },
        { src: '/images/gallery/rgu_assam_students_forum_1712679025_3342516384470617042_62127049418.webp', title: 'Traditional Attire display', category: 'Cultural', date: 'Apr 2024' },
        { src: '/images/gallery/rgu_assam_students_forum_1712679025_3342516384478811395_62127049418.webp', title: 'Freshers Gathering', category: 'Gatherings', date: 'Apr 2024' },
        { src: '/images/gallery/rgu_assam_students_forum_1712679025_3342516384596345767_62127049418.webp', title: 'Annual Bihu Dance', category: 'Cultural', date: 'Apr 2024' },
        { src: '/images/gallery/rgu_assam_students_forum_1712679025_3342516384596406818_62127049418.webp', title: 'Audience and Guests', category: 'Cultural', date: 'Apr 2024' },
        { src: '/images/gallery/rgu_assam_students_forum_1726334538_3457067135552512985_62127049418.webp', title: 'Executive Session', category: 'Gatherings', date: 'Sep 2024' },
        { src: '/images/gallery/rgu_assam_students_forum_1726334538_3457067135703634460_62127049418.webp', title: 'Representative Meet', category: 'Gatherings', date: 'Sep 2024' },
        { src: '/images/gallery/rgu_assam_students_forum_1726334538_3457067135946960914_62127049418.webp', title: 'RGU Campus Interaction', category: 'Gatherings', date: 'Sep 2024' },
        { src: '/images/gallery/rgu_assam_students_forum_1727532627_3467117432106804250_62127049418.webp', title: 'General Body Assembly', category: 'Gatherings', date: 'Oct 2024' },
        { src: '/images/gallery/rgu_assam_students_forum_1727959502_3470698321671801225_62127049418.webp', title: 'Student Union Interaction', category: 'Gatherings', date: 'Oct 2024' },
        { src: '/images/gallery/rgu_assam_students_forum_1730899003_3495356642051652137_62127049418.webp', title: 'Guest Felicitations', category: 'Ceremonies', date: 'Nov 2024' },
        { src: '/images/gallery/rgu_assam_students_forum_1730911096_3495458083198007013_62127049418.webp', title: 'Executive Committee Meet', category: 'Gatherings', date: 'Nov 2024' },
        { src: '/images/gallery/rgu_assam_students_forum_1746011910_3622132888348961264_62127049418.webp', title: 'Bihu Folk Performance', category: 'Cultural', date: 'Apr 2025' },
        { src: '/images/gallery/rgu_assam_students_forum_1746011910_3622132888684500345_62127049418.webp', title: 'Traditional Dance Display', category: 'Cultural', date: 'Apr 2025' },
        { src: '/images/gallery/rgu_assam_students_forum_1758574670_3727516964228408369_62127049418.webp', title: 'Lighting of Lamp Ceremony', category: 'Ceremonies', date: 'May 2025' },
        { src: '/images/gallery/rgu_assam_students_forum_1758651281_3728159619387976937_62127049418.webp', title: 'Tribute to Zubeen Garg', category: 'Cultural', date: 'May 2025' }
      ];
      await GalleryItem.insertMany(initialItems);
      items = await GalleryItem.find().sort({ timestamp: -1 });
    }
    res.json(items);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/gallery', requireAuth, async (req, res) => {
  try {
    const item = new GalleryItem(req.body);
    await item.save();
    await logActivity(`Uploaded image to gallery: ${item.title || 'Untitled snapshot'}`);
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/gallery/:id', requireAuth, async (req, res) => {
  try {
    const deleted = await GalleryItem.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Gallery item not found' });
    await logActivity(`Deleted image from gallery: ${deleted.title || 'Untitled snapshot'}`);
    res.json({ message: 'Gallery item deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ----------------------------------------------------------------------
// Team Roster Routes
// ----------------------------------------------------------------------
app.get('/api/team', async (req, res) => {
  try {
    let team = await TeamMember.find().sort({ timestamp: 1 });
    if (team.length === 0) {
      const defaultMembers = [
        { name: 'Debashish Bordoloi', role: 'President & Technical Administrator', department: 'Computer Science', photoURL: '/logo.png' },
        { name: 'Ananya Gogoi', role: 'Vice President', department: 'Assamese Literature', photoURL: '/logo.png' },
        { name: 'Jitul Neog', role: 'General Secretary', department: 'Sociology & Welfare', photoURL: '/logo.png' }
      ];
      await TeamMember.insertMany(defaultMembers);
      team = await TeamMember.find().sort({ timestamp: 1 });
    }
    res.json(team);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/team', requireAuth, async (req, res) => {
  try {
    const member = new TeamMember(req.body);
    await member.save();
    await logActivity(`Added team member: ${member.name} (${member.role})`);
    res.json(member);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/team/:id', requireAuth, async (req, res) => {
  try {
    const { name, role, department, photoURL } = req.body;
    const member = await TeamMember.findByIdAndUpdate(
      req.params.id, 
      { name, role, department, photoURL }, 
      { new: true }
    );
    if (!member) return res.status(404).json({ error: 'Team member not found' });
    await logActivity(`Updated team member: ${member.name} details`);
    res.json(member);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/team/:id', requireAuth, async (req, res) => {
  try {
    const deleted = await TeamMember.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Team member not found' });
    await logActivity(`Revoked executive role from: ${deleted.name}`);
    res.json({ message: 'Team member deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ----------------------------------------------------------------------
// Dashboard Route
// ----------------------------------------------------------------------
app.get('/api/dashboard', async (req, res) => {
  try {
    const totalMembers = await Member.countDocuments({ status: 'active' });
    const pendingApplications = await Member.find({ status: 'pending' }).sort({ joinedDate: -1 }).limit(5);
    const notices = await Notice.countDocuments();
    const events = await Event.countDocuments({ date: { $gte: new Date() } });

    const logs = await ActivityLog.find().sort({ time: -1 }).limit(5);
    const activities = logs.map(log => {
      const diffMs = new Date() - new Date(log.time);
      const diffMins = Math.floor(diffMs / 60000);
      let timeStr = 'just now';
      if (diffMins > 0 && diffMins < 60) {
        timeStr = `${diffMins} mins ago`;
      } else if (diffMins >= 60) {
        const diffHrs = Math.floor(diffMins / 60);
        timeStr = `${diffHrs} hr${diffHrs > 1 ? 's' : ''} ago`;
      }
      return { title: log.title, time: timeStr };
    });

    if (activities.length === 0) {
      activities.push(
        { title: `${pendingApplications.length} pending applications for review`, time: 'just now' },
        { title: `System optimized, MongoDB initialized`, time: '1 hr ago' }
      );
    }

    res.json({
      stats: {
        totalMembers,
        notices,
        events
      },
      pendingApplications: pendingApplications.map(m => ({
        id: m._id.toString(),
        name: m.name,
        department: m.department,
        rollNumber: m.rollNumber || 'N/A',
        year: m.year || '1st Year',
        status: m.status,
        date: m.joinedDate
      })),
      activities
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to aggregate dashboard metrics' });
  }
});

// ----------------------------------------------------------------------
// Student Verification Helper
// ----------------------------------------------------------------------
app.post('/api/verify-student', async (req, res) => {
  try {
    const { email, rollNumber } = req.body;
    if (!email || !rollNumber) {
      return res.status(400).json({ error: 'Email and Roll Number are required' });
    }
    const member = await Member.findOne({ email, rollNumber, status: 'active' });
    if (!member) {
      return res.status(403).json({ error: 'You are not a verified student member of RGUASF. Please submit a membership form first.' });
    }
    res.json({ verified: true, member });
  } catch (err) {
    res.status(500).json({ error: 'Verification failed' });
  }
});

// ----------------------------------------------------------------------
// Cloudinary Upload
// ----------------------------------------------------------------------
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file provided' });
  }
  res.json({ url: req.file.path });
});

// ----------------------------------------------------------------------
// Housing Listings Routes
// ----------------------------------------------------------------------
app.get('/api/listings', async (req, res) => {
  try {
    const listings = await HousingListing.find({ status: 'approved' }).sort({ joinedDate: -1 });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve housing listings' });
  }
});

app.get('/api/my-listings', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    const listings = await HousingListing.find({ userEmail: email }).sort({ joinedDate: -1 });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve your listings' });
  }
});

app.get('/api/listings/:id', async (req, res) => {
  try {
    const listing = await HousingListing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: 'Listing not found' });
    
    // Increment view count
    listing.views = (listing.views || 0) + 1;
    await listing.save();
    
    res.json(listing);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve listing details' });
  }
});

app.post('/api/listings', async (req, res) => {
  try {
    const { 
      title, description, category, rent, deposit, address, village, 
      landmark, coordinates, availableFrom, genderPreference, sharingType, 
      amenities, rules, phone, whatsapp, images, ownerName, userEmail, rollNumber,
      isDraft
    } = req.body;

    if (!isDraft) {
      // Validate active student member status
      const student = await Member.findOne({ email: userEmail, rollNumber, status: 'active' });
      if (!student) {
        return res.status(403).json({ error: 'Only verified RGUASF student members can publish listings.' });
      }
    }

    const listing = new HousingListing({
      title,
      description,
      category,
      rent,
      deposit: deposit || 0,
      address,
      village,
      landmark,
      coordinates,
      availableFrom: availableFrom || Date.now(),
      genderPreference: genderPreference || 'Mixed',
      sharingType: sharingType || 'Single',
      amenities: amenities || [],
      rules: rules || [],
      phone,
      whatsapp,
      images: images || [],
      ownerName,
      userEmail,
      status: isDraft ? 'draft' : 'pending'
    });

    await listing.save();
    await logActivity(`Submitted housing listing: ${listing.title} (${listing.status})`);
    res.status(201).json(listing);
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit housing listing: ' + err.message });
  }
});

app.put('/api/listings/:id', async (req, res) => {
  try {
    const { 
      title, description, category, rent, deposit, address, village, 
      landmark, coordinates, availableFrom, genderPreference, sharingType, 
      amenities, rules, phone, whatsapp, images, ownerName, userEmail, rollNumber,
      isDraft
    } = req.body;

    const listing = await HousingListing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: 'Listing not found' });

    // Validate ownership
    if (listing.userEmail !== userEmail) {
      return res.status(403).json({ error: 'Unauthorized to modify this listing' });
    }

    if (!isDraft) {
      // Validate active student member status
      const student = await Member.findOne({ email: userEmail, rollNumber, status: 'active' });
      if (!student) {
        return res.status(403).json({ error: 'Only verified RGUASF student members can publish.' });
      }
    }

    listing.title = title;
    listing.description = description;
    listing.category = category;
    listing.rent = rent;
    listing.deposit = deposit || 0;
    listing.address = address;
    listing.village = village;
    listing.landmark = landmark;
    listing.coordinates = coordinates;
    listing.availableFrom = availableFrom || Date.now();
    listing.genderPreference = genderPreference || 'Mixed';
    listing.sharingType = sharingType || 'Single';
    listing.amenities = amenities || [];
    listing.rules = rules || [];
    listing.phone = phone;
    listing.whatsapp = whatsapp;
    listing.images = images || [];
    listing.ownerName = ownerName;
    listing.status = isDraft ? 'draft' : 'pending';

    await listing.save();
    await logActivity(`Updated housing listing: ${listing.title} (${listing.status})`);
    res.json(listing);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update listing' });
  }
});

app.delete('/api/listings/:id', async (req, res) => {
  try {
    const { userEmail } = req.body; // verify student owner or check for admin cookie
    const adminToken = parseCookies(req.headers.cookie)['asf_admin_token'];
    let isAdminUser = false;
    if (adminToken) {
      try {
        jwt.verify(adminToken, JWT_SECRET);
        isAdminUser = true;
      } catch (e) {}
    }

    const listing = await HousingListing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: 'Listing not found' });

    if (!isAdminUser && listing.userEmail !== userEmail) {
      return res.status(403).json({ error: 'Unauthorized to delete this listing' });
    }

    await HousingListing.findByIdAndDelete(req.params.id);
    await logActivity(`Deleted housing listing: ${listing.title}`);
    res.json({ message: 'Listing deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete listing' });
  }
});

app.post('/api/listings/:id/report', async (req, res) => {
  try {
    const { reason, comment, userEmail } = req.body;
    if (!reason) return res.status(400).json({ error: 'Reason is required' });

    const listing = await HousingListing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: 'Listing not found' });

    listing.reports.push({ reason, comment, userEmail });
    await listing.save();
    
    await logActivity(`Reported listing: ${listing.title} for ${reason}`);
    res.json({ message: 'Listing reported successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to report listing' });
  }
});

// ----------------------------------------------------------------------
// Admin Housing Operations
// ----------------------------------------------------------------------
app.get('/api/admin/listings', requireAuth, async (req, res) => {
  try {
    const listings = await HousingListing.find({}).sort({ joinedDate: -1 });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve admin listings' });
  }
});

app.patch('/api/admin/listings/:id/status', requireAuth, async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    if (!['pending', 'approved', 'rejected', 'expired', 'archived', 'suspended', 'deleted'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const updated = await HousingListing.findByIdAndUpdate(
      req.params.id, 
      { status, rejectionReason: rejectionReason || '' }, 
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Listing not found' });

    await logActivity(`Admin updated listing ${updated.title} status to ${status}`);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

app.patch('/api/admin/listings/:id/resolve-report', requireAuth, async (req, res) => {
  try {
    const { action } = req.body; // e.g. "dismiss", "remove"
    const listing = await HousingListing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: 'Listing not found' });

    if (action === 'dismiss') {
      listing.reports = [];
      await listing.save();
      await logActivity(`Admin dismissed reports for listing: ${listing.title}`);
    } else if (action === 'remove') {
      listing.status = 'suspended';
      await listing.save();
      await logActivity(`Admin suspended reported listing: ${listing.title}`);
    }

    res.json(listing);
  } catch (err) {
    res.status(500).json({ error: 'Failed to resolve reports' });
  }
});

// ----------------------------------------------------------------------
// Roommate Request Routes
// ----------------------------------------------------------------------
app.get('/api/roommates', async (req, res) => {
  try {
    const requests = await RoommateRequest.find().sort({ timestamp: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve roommate requests' });
  }
});

app.post('/api/roommates', async (req, res) => {
  try {
    const { 
      name, email, rollNumber, budget, gender, course, semester, 
      habits, bio, preferredLocation, preferredBudget, preferredRoommate, contact 
    } = req.body;

    // Validate active student member status
    const student = await Member.findOne({ email, rollNumber, status: 'active' });
    if (!student) {
      return res.status(403).json({ error: 'Only verified RGUASF student members can post roommate requests.' });
    }

    const request = new RoommateRequest({
      name,
      email,
      budget,
      gender,
      course,
      semester,
      habits,
      bio,
      preferredLocation,
      preferredBudget,
      preferredRoommate,
      contact
    });

    await request.save();
    await logActivity(`Posted roommate request: ${request.name}`);
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create roommate request' });
  }
});

app.delete('/api/roommates/:id', async (req, res) => {
  try {
    const { userEmail } = req.body;
    const adminToken = parseCookies(req.headers.cookie)['asf_admin_token'];
    let isAdminUser = false;
    if (adminToken) {
      try {
        jwt.verify(adminToken, JWT_SECRET);
        isAdminUser = true;
      } catch (e) {}
    }

    const request = await RoommateRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ error: 'Request not found' });

    if (!isAdminUser && request.email !== userEmail) {
      return res.status(403).json({ error: 'Unauthorized to delete this request' });
    }

    await RoommateRequest.findByIdAndDelete(req.params.id);
    await logActivity(`Deleted roommate request: ${request.name}`);
    res.json({ message: 'Roommate request deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete roommate request' });
  }
});

// ----------------------------------------------------------------------
// Fallback 404 Handler
// ----------------------------------------------------------------------
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
