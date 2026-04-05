import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ParticleBackground from './components/ParticleBackground';
import Home from './pages/Home';
import About from './pages/About';
import CareerHub from './pages/CareerHub';
import Membership from './pages/Membership';
import AdminManagement from './pages/AdminManagement';
import AdminCMS from './pages/AdminCMS';
import AdminNotices from './pages/AdminNotices';
import AdminEvents from './pages/AdminEvents';
import AdminGallery from './pages/AdminGallery';
import AdminPublications from './pages/AdminPublications';
import AdminTeam from './pages/AdminTeam';
import Login from './pages/Login';
import DummyPage from './pages/DummyPage';
import Contact from './pages/Contact';
import AdminLayout from './components/AdminLayout';
import DisclaimerModal from './components/DisclaimerModal';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('asf_admin_token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <div className="relative min-h-screen w-full font-body">
        <ParticleBackground />
        <DisclaimerModal />
        
        {/* Main Content Overlay */}
        <div className="relative z-10 min-h-screen">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/careers" element={<CareerHub />} />
            <Route path="/events" element={<DummyPage badge="Calendar" title="Events & Cultural Heritage" description="Current catalog of upcoming festivals, seminars, and networking symposiums." />} />
            <Route path="/notices" element={<DummyPage badge="Announcements" title="Live Notice Board" description="Real-time circulars, official decrees, and meeting schedules for committee members." />} />
            <Route path="/gallery" element={<DummyPage badge="Archives" title="Visual Gallery" description="Historical snapshots of pivotal moments throughout the years." />} />
            <Route path="/publications" element={<DummyPage badge="Intellectual Pool" title="Academic Publications" description="Journals, reviews, and magazines authored by elite students of the forum." />} />
            <Route path="/membership" element={<Membership />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />

            {/* Admin Protected Routes with Unified Layout */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<AdminManagement />} />
              <Route path="cms" element={<AdminCMS />} />
              <Route path="notices" element={<AdminNotices />} />
              <Route path="events" element={<AdminEvents />} />
              <Route path="gallery" element={<AdminGallery />} />
              <Route path="publications" element={<AdminPublications />} />
              <Route path="team" element={<AdminTeam />} />
            </Route>

            {/* Catch All */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
