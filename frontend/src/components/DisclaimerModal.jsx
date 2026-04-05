import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function DisclaimerModal() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const hasSeenNotice = localStorage.getItem('rguasf_notice_seen');
    if (!hasSeenNotice) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('rguasf_notice_seen', 'true');
    setIsOpen(false);
  };

  const handleContact = () => {
    handleClose();
    navigate('/contact');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-3xl overflow-hidden"
          >
            {/* Top accent line */}
            <div className="h-1.5 w-full bg-gradient-to-r from-primary to-blue-400" />

            <div className="p-8 md:p-10">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold tracking-[0.2em] uppercase mb-4">
                  RGUASF Beta
                </span>
                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-4">
                  Testing Mode Notice
                </h2>
                <div className="space-y-4 text-slate-600 leading-relaxed">
                  <p className="">
                    This website is currently under <span className="font-semibold text-slate-900">testing and development</span>. Some features may not work as expected or may change over time.
                  </p>
                  <p>
                    We appreciate your patience and feedback while we improve the platform to better serve our student community.
                  </p>
                  <p className="text-sm italic font-medium text-slate-500">
                    For any issues or suggestions, feel free to contact the Assam Students’ Forum team.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-10">
                <button
                  onClick={handleClose}
                  className="flex-1 bg-primary text-white px-6 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-primary/20 active:scale-[0.98]"
                >
                  Continue to Website
                </button>
                <button
                  onClick={handleContact}
                  className="flex-1 bg-slate-100 text-slate-700 px-6 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all active:scale-[0.98]"
                >
                  Contact Us
                </button>
              </div>
            </div>

            {/* Subtle bottom detail */}
            <div className="px-8 pb-6 text-center">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">
                © Assam Students’ Forum, RGU
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
