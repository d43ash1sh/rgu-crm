import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-slate-200/10 glass-nav h-20 bg-surface/80 backdrop-blur-md">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-8 h-full">
        <Link to="/" className="flex items-center gap-3 text-xl font-bold tracking-tighter text-slate-900 group">
          <div className="w-10 h-10 border border-slate-200/40 rounded-full overflow-hidden shadow-sm group-hover:scale-105 transition-transform bg-white flex items-center justify-center">
            <img src="/logo.jpg" alt="RGUASF Logo" className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.style.display='none'; e.target.parentElement.innerHTML='<span style="font-weight:900;color:#2563eb;font-size:12px;">ASF</span>'; }} />
          </div>
          Assam Students’ Forum
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link to="/about" className={`font-inter tracking-tight font-medium text-sm transition-colors ${isActive('/about') ? 'text-blue-600 font-semibold border-b-2 border-blue-600' : 'text-slate-600 hover:text-blue-500'}`}>
            About
          </Link>
          <Link to="/careers" className={`font-inter tracking-tight font-medium text-sm transition-colors ${isActive('/careers') ? 'text-blue-600 font-semibold border-b-2 border-blue-600' : 'text-slate-600 hover:text-blue-500'}`}>
            Careers
          </Link>
          <Link to="/events" className={`font-inter tracking-tight font-medium text-sm transition-colors ${isActive('/events') ? 'text-blue-600 font-semibold border-b-2 border-blue-600' : 'text-slate-600 hover:text-blue-500'}`}>
            Events
          </Link>
          <Link to="/notices" className={`font-inter tracking-tight font-medium text-sm transition-colors ${isActive('/notices') ? 'text-blue-600 font-semibold border-b-2 border-blue-600' : 'text-slate-600 hover:text-blue-500'}`}>
            Notice Board
          </Link>
          <Link to="/membership" className={`font-inter tracking-tight font-medium text-sm transition-colors ${isActive('/membership') ? 'text-blue-600 font-semibold border-b-2 border-blue-600' : 'text-slate-600 hover:text-blue-500'}`}>
            Membership
          </Link>
          <Link to="/gallery" className={`font-inter tracking-tight font-medium text-sm transition-colors ${isActive('/gallery') ? 'text-blue-600 font-semibold border-b-2 border-blue-600' : 'text-slate-600 hover:text-blue-500'}`}>
            Gallery
          </Link>
          <Link to="/publications" className={`font-inter tracking-tight font-medium text-sm transition-colors ${isActive('/publications') ? 'text-blue-600 font-semibold border-b-2 border-blue-600' : 'text-slate-600 hover:text-blue-500'}`}>
            Publications
          </Link>
        </div>
        <Link to="/contact" className="bg-primary-container text-on-primary px-6 py-2 rounded-md font-medium text-sm scale-95 active:scale-90 transition-transform hover:opacity-90">
          Contact
        </Link>
      </div>
    </nav>
  );
}
