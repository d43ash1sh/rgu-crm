import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 3400; // 3.4 seconds loading loop

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min((elapsed / duration) * 100, 100);

      setProgress(currentProgress);

      if (currentProgress < 100) {
        requestAnimationFrame(animate);
      } else {
        // Hold on 100% for 600ms to complete the 4.0s experience
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 600);
      }
    };

    requestAnimationFrame(animate);
  }, [onComplete]);

  // Circumference logic for 64px radius circle (Diameter = 128px)
  const radius = 64;
  const circumference = 2 * Math.PI * radius; // ~402.12
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        scale: 1.02,
        filter: 'blur(8px)',
        transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] }
      }}
      className="fixed inset-0 z-[99999] bg-[#070b12] flex flex-col items-center justify-center text-white overflow-hidden select-none"
    >
      {/* Dynamic atmospheric ambient gradients */}
      <div className="absolute top-1/4 left-1/4 w-[380px] h-[380px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[420px] h-[420px] rounded-full bg-rose-650/5 blur-[150px] pointer-events-none" />

      <div className="relative flex flex-col items-center max-w-sm w-full px-8">
        
        {/* Circle Progress Housing */}
        <div className="relative w-36 h-36 flex items-center justify-center mb-10">
          
          {/* Logo soft shadow glow */}
          <div className="absolute inset-4 rounded-full bg-primary/20 blur-xl pointer-events-none" />

          {/* SVG Progress Border Ring */}
          <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 144 144">
            {/* Base track */}
            <circle
              cx="72"
              cy="72"
              r={radius}
              stroke="rgba(255, 255, 255, 0.03)"
              strokeWidth="2.5"
              fill="transparent"
            />
            {/* Glowing progress underlay circle */}
            <circle
              cx="72"
              cy="72"
              r={radius}
              stroke="#004fc6"
              strokeWidth="5"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="opacity-20 blur-[2px] transition-all duration-75"
              style={{ stroke: 'url(#gradient-accent)' }}
            />
            {/* Primary crisp progress circle */}
            <circle
              cx="72"
              cy="72"
              r={radius}
              stroke="#004fc6"
              strokeWidth="2.5"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-75"
              style={{ stroke: 'url(#gradient-accent)' }}
            />
            <defs>
              <linearGradient id="gradient-accent" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#004fc6" />
                <stop offset="100%" stopColor="#ba1a1a" />
              </linearGradient>
            </defs>
          </svg>

          {/* Pulsing Logo */}
          <motion.div
            animate={{ 
              scale: [0.97, 1.02, 0.97],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-28 h-28 rounded-full bg-[#0d121c] p-1.5 shadow-[0_15px_40px_rgba(0,0,0,0.6)] flex items-center justify-center overflow-hidden border border-white/5 relative z-10"
          >
            <img 
              src="/logo.png" 
              alt="RGUASF Logo" 
              className="w-full h-full object-cover rounded-full"
            />
          </motion.div>
        </div>

        {/* Brand Information */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-10 space-y-3"
        >
          <h2 className="text-2xl font-black tracking-[0.25em] text-white">
            RGU<span className="text-primary">ASF</span>
          </h2>
          <p className="text-[10px] tracking-[0.35em] font-black uppercase text-slate-500">
            Assam Students' Forum
          </p>
          
          {/* Glowing motto text: জয় আই অসম */}
          <motion.div 
            animate={{ 
              opacity: [0.65, 1, 0.65] 
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-xl font-bold tracking-wide text-amber-500 drop-shadow-[0_0_12px_rgba(245,158,11,0.35)] pt-1.5 font-sans"
          >
            জয় আই অসম
          </motion.div>
        </motion.div>

        {/* Loading Percent Indicator */}
        <div className="w-full max-w-[240px] text-center">
          <span className="text-[10px] font-black text-slate-400 block tracking-[0.25em] uppercase">
            Loading {Math.floor(progress)}%
          </span>
        </div>
      </div>

      {/* University Branding footer text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-10 text-[9px] font-black tracking-[0.4em] uppercase text-slate-600"
      >
        Rajiv Gandhi University
      </motion.div>
    </motion.div>
  );
}
