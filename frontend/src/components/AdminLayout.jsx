import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Bell, 
  Image as ImageIcon, 
  Users2, 
  BookOpen, 
  LogOut, 
  Menu
} from 'lucide-react';
import { useState } from 'react';
import { logoutAdmin } from '../api';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logoutAdmin().finally(() => {
      navigate('/', { replace: true });
    });
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/cms' },
    { icon: Users, label: 'Student Registry', path: '/admin' },
    { icon: Bell, label: 'Notices Board', path: '/admin/notices' },
    { icon: Calendar, label: 'Event Calendar', path: '/admin/events' },
    { icon: ImageIcon, label: 'Gallery Archive', path: '/admin/gallery' },
    { icon: Users2, label: 'Executive Team', path: '/admin/team' },
  ];

  return (
    <div className="flex min-h-screen bg-[#f6f8fa] font-body text-[#24292f] antialiased">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-screen transition-all duration-200 z-50 flex flex-col border-r border-[#d8dee4] bg-white ${sidebarOpen ? 'w-64' : 'w-16'}`}>
        {/* Sidebar Header */}
        <div className="h-16 flex items-center px-4 border-b border-[#d8dee4]">
          <Link to="/" className="flex items-center gap-2 hover:opacity-85 transition-opacity">
            <img src="/logo.png" alt="RGUASF Logo" className="w-8 h-8 rounded shadow-sm shrink-0" />
            {sidebarOpen && (
              <span className="font-semibold text-sm tracking-tight text-[#24292f]">
                RGUASF Portal
              </span>
            )}
          </Link>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors relative group ${
                  active 
                    ? 'bg-[#f6f8fa] text-[#24292f] font-semibold border-l-2 border-[#fd8c73]' 
                    : 'text-[#57606a] hover:bg-[#f3f4f6] hover:text-[#24292f]'
                }`}
              >
                <item.icon size={18} className={active ? 'text-[#24292f]' : 'text-[#57606a]'} />
                {sidebarOpen && <span className="text-xs">{item.label}</span>}
                {!sidebarOpen && (
                  <div className="absolute left-14 bg-[#24292f] text-white text-[10px] px-2 py-1 rounded shadow opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap font-medium">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer Sign Out */}
        <div className="p-2 border-t border-[#d8dee4]">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-[#cf222e] hover:bg-[#ffebe9] transition-colors text-xs font-semibold"
          >
            <LogOut size={18} />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className={`flex-1 transition-all duration-200 min-h-screen flex flex-col ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        {/* Top Navbar */}
        <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-[#d8dee4] sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 hover:bg-[#f3f4f6] rounded text-[#57606a] hover:text-[#24292f] transition-colors">
              <Menu size={18} />
            </button>
            <div className="text-xs font-semibold text-[#57606a] flex items-center gap-1">
              <span>Admin</span>
              <span>/</span>
              <span className="text-[#24292f]">{menuItems.find(i => isActive(i.path))?.label || 'Dashboard'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-[#24292f]">Admin Workspace</p>
            </div>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-[#d8dee4]">
              <img src="/logo.png" alt="Admin Avatar" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="p-6 md:p-8 flex-1 relative overflow-y-auto max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Admin Footer */}
        <footer className="p-6 border-t border-[#d8dee4] bg-white text-xs text-[#57606a]">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <p className="font-semibold text-[#24292f]">Assam Students’ Forum, RGU</p>
              <p className="text-[10px] text-[#57606a] mt-0.5">Secure Operations Center</p>
            </div>
            <div className="flex gap-4">
              <a href="/terms" className="hover:text-[#0969da] hover:underline">Terms</a>
              <a href="/privacy" className="hover:text-[#0969da] hover:underline">Privacy</a>
              <a href="/security" className="hover:text-[#0969da] hover:underline">Security</a>
            </div>
            <p className="text-[10px]">© 2026 RGUASF • Operations Console</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
