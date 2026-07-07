import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const isActive = (path) => location.pathname === path;

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const navLinks = [
    { name: 'About', path: '/about' },
    { name: 'Careers', path: '/careers' },
    { name: 'Membership', path: '/membership' },
    { name: 'Housing', path: '/housing' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <>
      <nav className="fixed top-0 w-full z-50 border-b border-slate-200/10 glass-nav h-20 bg-surface/85 backdrop-blur-md">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-6 md:px-8 h-full">
          {/* Logo Brand */}
          <Link to="/" onClick={closeMenu} className="flex items-center gap-3 text-lg md:text-xl font-bold tracking-tighter text-slate-900 group">
            <div className="w-10 h-10 border border-slate-200/40 rounded-full overflow-hidden shadow-sm group-hover:scale-105 transition-transform bg-white flex items-center justify-center">
              <img 
                src="/logo.png" 
                alt="RGUASF Logo" 
                className="w-full h-full object-cover" 
                onError={(e) => { 
                  e.target.onerror = null; 
                  e.target.style.display='none'; 
                  e.target.parentElement.innerHTML='<span style="font-weight:900;color:#2563eb;font-size:12px;">ASF</span>'; 
                }} 
              />
            </div>
            <span className="hidden sm:inline-block">Assam Students’ Forum</span>
            <span className="sm:hidden font-black">RGUASF</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.slice(0, 5).map((link) => (
              <Link 
                key={link.path}
                to={link.path} 
                className={`font-inter tracking-tight font-medium text-sm transition-colors relative py-1 ${
                  isActive(link.path) 
                    ? 'text-blue-600 font-semibold' 
                    : 'text-slate-600 hover:text-blue-500'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <motion.div 
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-650 rounded-full"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Call to Action */}
          <div className="hidden md:block">
            <Link to="/contact" className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider scale-95 hover:scale-100 transition-all hover:bg-blue-600 active:scale-95 shadow-md shadow-primary/10">
              Contact
            </Link>
          </div>

          {/* Mobile Menu Toggle button */}
          <button 
            onClick={toggleMenu} 
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 hover:text-primary transition-all active:scale-95 cursor-pointer z-50"
            aria-label="Toggle Menu"
          >
            <span className="material-symbols-outlined text-2xl">
              {isOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-x-0 top-0 pt-24 pb-10 px-6 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 z-40 shadow-2xl flex flex-col gap-5 md:hidden"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link, idx) => (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={link.path}
                >
                  <Link
                    to={link.path}
                    onClick={closeMenu}
                    className={`block w-full py-4 px-6 rounded-2xl text-lg font-bold transition-all ${
                      isActive(link.path)
                        ? 'bg-primary/5 text-primary border-l-4 border-primary pl-5'
                        : 'text-slate-650 hover:bg-slate-50'
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
