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
  Settings,
  Search,
  BellRing,
  ChevronRight,
  Menu
} from 'lucide-react';
import { useState } from 'react';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('asf_admin_token');
    navigate('/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/cms' },
    { icon: Users, label: 'Members', path: '/admin' },
    { icon: Bell, label: 'Notices', path: '/admin/notices' },
    { icon: Calendar, label: 'Events', path: '/admin/events' },
    { icon: ImageIcon, label: 'Gallery', path: '/admin/gallery' },
    { icon: BookOpen, label: 'Publications', path: '/admin/publications' },
    { icon: Users2, label: 'Team', path: '/admin/team' },
  ];

  return (
    <div className="flex min-h-screen bg-surface font-body text-on-surface antialiased bg-[#f9f9ff]">
      {/* Background Decor */}
      <div aria-hidden="true" className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_100%_0%,rgba(3,85,211,0.02)_0%,transparent_50%)]">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(#737686 0.5px, transparent 0.5px)", backgroundSize: "32px 32px" }}></div>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {!sidebarOpen && (
        <div className="hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity lg:hidden" onClick={() => setSidebarOpen(true)}></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-screen transition-all duration-300 z-50 flex flex-col border-r border-slate-200/10 bg-white/80 backdrop-blur-xl ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="h-20 flex items-center px-6 border-b border-slate-200/5">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
             <span className="text-white font-black text-xl tracking-tighter">A</span>
          </div>
          {sidebarOpen && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="ml-4 overflow-hidden whitespace-nowrap">
              <h1 className="font-black text-slate-900 text-lg tracking-tight leading-none">ASF Admin</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mt-1">CMS Control</p>
            </motion.div>
          )}
        </div>

        <nav className="flex-1 py-10 px-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all relative group ${
                isActive(item.path) 
                  ? 'bg-primary text-white shadow-xl shadow-primary/20' 
                  : 'text-slate-500 hover:bg-slate-100 hover:text-primary'
              }`}
            >
              <item.icon size={20} className={isActive(item.path) ? 'text-white' : 'group-hover:scale-110 transition-transform'} />
              {sidebarOpen && <span className="font-semibold text-sm tracking-tight">{item.label}</span>}
              {!sidebarOpen && (
                <div className="absolute left-16 bg-slate-900 text-white text-xs px-3 py-2 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap font-bold shadow-2xl">
                  {item.label}
                </div>
              )}
              {isActive(item.path) && sidebarOpen && (
                <motion.div layoutId="activeInd" className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200/10">
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-error bg-red-50/0 hover:bg-red-50 hover:text-red-600 transition-all group`}
          >
            <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
            {sidebarOpen && <span className="font-bold text-sm tracking-tight">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className={`flex-1 transition-all duration-300 min-h-screen flex flex-col ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Top Header */}
        <header className="h-20 flex items-center justify-between px-10 sticky top-0 bg-white/60 backdrop-blur-md z-40 border-b border-slate-200/10">
          <div className="flex items-center gap-6">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
              <Menu size={20} />
            </button>
            <div className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
               <span className="hover:text-primary cursor-pointer transition-colors">Admin</span>
               <ChevronRight size={14} />
               <span className="text-slate-900">{menuItems.find(i => isActive(i.path))?.label || 'Dashboard'}</span>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="relative hidden lg:block group">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Find anything..."
                className="pl-12 pr-6 py-2.5 bg-slate-100 border-none rounded-xl text-xs font-medium w-64 focus:ring-2 focus:ring-primary/10 bg-slate-50 transition-all outline-none"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <button className="p-2.5 bg-slate-50 text-slate-400 hover:text-primary hover:bg-blue-50 rounded-xl transition-all relative">
                <BellRing size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <button className="p-2.5 bg-slate-50 text-slate-400 hover:text-primary hover:bg-blue-50 rounded-xl transition-all">
                <Settings size={20} />
              </button>
              <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-black text-slate-900 leading-none">Admin User</p>
                  <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">Super Admin</p>
                </div>
                <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-slate-100 group-hover:ring-primary/20 transition-all">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7tA7Wpfafqza_JSbWvwajfL0sAQERvSC0zt1TXZiLOsHQn5KGK8BCrGldYq0kqx59tSmdbIYJXqV4rlhi2gSHinSykhxIegs_Jj0yCwhaExlOQH1vJ3VN2RdEKoxSGDScnz6BanjaCq-2a1xZeKQ5m4ZgEo9NL4rba-MivVlnhvfNHtzK72zxgJnfceBnHyvUtV7lbwryCsUUBGjT_XSAfXPIdsvMCAp3LnTp90zvYakIcjMmW0dWgR67cGDa5ECqGjqd9Y2l5XU" alt="Admin Avatar" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Entrance */}
        <div className="p-10 flex-1 relative overflow-y-auto max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Admin Footer */}
        <footer className="p-10 border-t border-slate-200/10 bg-white/50 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <div>
              <p className="text-sm font-bold text-slate-900">Assam Students’ Forum, RGU</p>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-[0.2em] mt-1">Administration Control Suite v1.0.4</p>
            </div>
            <div className="flex gap-8 text-[10px] items-center font-bold text-slate-400 uppercase tracking-widest">
              <a href="#" className="hover:text-primary transition-colors">Audit Logs</a>
              <a href="#" className="hover:text-primary transition-colors">Server Status</a>
              <a href="#" className="hover:text-primary transition-colors">Security</a>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">© 2025 ASF RGU</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
