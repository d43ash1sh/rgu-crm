import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
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
import AdminTeam from './pages/AdminTeam';
import Login from './pages/Login';
import DummyPage from './pages/DummyPage';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import HousingHub from './pages/HousingHub';
import AdminLayout from './components/AdminLayout';
import DisclaimerModal from './components/DisclaimerModal';
import Preloader from './components/Preloader';
import NotFound from './pages/NotFound';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Security from './pages/Security';
import { checkAuth } from './api';

const ProtectedRoute = ({ children }) => {
  const [authState, setAuthState] = useState({ loading: true, authenticated: false });

  useEffect(() => {
    checkAuth()
      .then(data => {
        setAuthState({ loading: false, authenticated: data.authenticated });
      })
      .catch(() => {
        setAuthState({ loading: false, authenticated: false });
      });
  }, []);

  if (authState.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!authState.authenticated) {
    return <NotFound />;
  }

  return children;
};

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <Router>
      <div className="relative min-h-screen w-full font-body">
        <AnimatePresence mode="wait">
          {loading && <Preloader onComplete={() => setLoading(false)} />}
        </AnimatePresence>

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
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/membership" element={<Membership />} />
            <Route path="/housing" element={<HousingHub />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/gatekeeper" element={<Login />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/security" element={<Security />} />

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
              <Route path="team" element={<AdminTeam />} />
            </Route>

            {/* Catch All to 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
