import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const heroSlideshowImages = [
  '/images/gallery/rgu_assam_students_forum_1758651281_3728159619387976937_62127049418.webp',
  '/images/gallery/rgu_assam_students_forum_1746011910_3622132888348961264_62127049418.webp',
  '/images/gallery/rgu_assam_students_forum_1712679025_3342516384596406818_62127049418.webp',
  '/images/gallery/rgu_assam_students_forum_1712679025_3342516384470541996_62127049418.webp',
  '/images/gallery/ceremony_1.jpg'
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [notices, setNotices] = useState([]);
  const [events, setEvents] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlideshowImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const noticesRes = await fetch('http://localhost:5001/api/notices');
        const noticesData = await noticesRes.json();
        if (Array.isArray(noticesData)) {
          setNotices(noticesData);
        }

        const eventsRes = await fetch('http://localhost:5001/api/events');
        const eventsData = await eventsRes.json();
        if (Array.isArray(eventsData)) {
          const futureEvents = eventsData.filter(evt => new Date(evt.date) >= new Date());
          setEvents(futureEvents);
        }

        const galleryRes = await fetch('http://localhost:5001/api/gallery');
        const galleryData = await galleryRes.json();
        if (Array.isArray(galleryData)) {
          setGallery(galleryData.slice(0, 6));
        }
      } catch (err) {
        console.error('Failed to fetch notices/events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen flex flex-col antialiased selection:bg-primary/20 selection:text-primary relative overflow-x-hidden">
      <Navbar />

      {/* Immersive Hero Slideshow Background with Ken Burns effect */}
      <div className="absolute top-0 left-0 w-full h-[650px] md:h-[750px] z-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.12 }}
            animate={{ opacity: 1, scale: 1.01 }}
            exit={{ opacity: 0 }}
            transition={{ 
              opacity: { duration: 1.2 },
              scale: { duration: 5.5, ease: "linear" }
            }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroSlideshowImages[currentSlide]})` }}
          />
        </AnimatePresence>
        {/* Soft, rich gradient backdrop overlay for high readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/45 to-surface z-10" />
      </div>

      <main className="flex-1 relative z-10">
        <div className="absolute inset-0 pointer-events-none radial-dots z-[-1] opacity-55"></div>

        {/* ────────────────────────────────────────── */}
        {/* HERO                                       */}
        {/* ────────────────────────────────────────── */}
        <header className="pt-48 pb-36 px-8 text-center max-w-4xl mx-auto relative z-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <span className="inline-block px-4 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-black tracking-[0.25em] uppercase drop-shadow-sm">
              Rajiv Gandhi University
            </span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.08] mb-6 text-white drop-shadow">
              Assam Students' Forum
            </h1>
            <p className="text-lg md:text-xl text-slate-200 font-light leading-relaxed max-w-2xl mx-auto drop-shadow-sm">
              A home away from home for Assamese students at RGU — built on unity, culture, and mutual support.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.2 }} 
            className="flex flex-wrap items-center justify-center gap-4 mt-10"
          >
            <Link to="/about" className="bg-primary text-white px-10 py-4 rounded-2xl text-base font-bold hover:bg-blue-600 transition-all shadow-xl shadow-primary/30 active:scale-95">
              Explore Our Story
            </Link>
            <Link to="/membership" className="px-10 py-4 rounded-2xl text-base font-bold border-2 border-white/20 text-white hover:border-white hover:bg-white/10 transition-all active:scale-95 backdrop-blur-md bg-white/5">
              Apply for Membership
            </Link>
          </motion.div>
        </header>

        {/* ────────────────────────────────────────── */}
        {/* PILLARS — premium glass cards              */}
        {/* ────────────────────────────────────────── */}
        <section className="px-8 pb-32 max-w-5xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.8 }} 
            className="grid grid-cols-1 sm:grid-cols-3 gap-6"
          >
            {[
              { icon: 'diversity_3', label: 'Cultural Preservation', stat: 'Since 2011', color: 'text-amber-500' },
              { icon: 'volunteer_activism', label: 'Student Welfare', stat: '500+ Members', color: 'text-rose-500' },
              { icon: 'handshake', label: 'Unity & Strength', stat: 'Pan-Assam', color: 'text-indigo-500' },
            ].map((item) => (
              <div 
                key={item.label} 
                className="bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgb(37,99,235,0.08)] hover:border-primary/20 p-8 rounded-[2rem] text-center group transition-all duration-300 hover:-translate-y-1.5"
              >
                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/5 transition-colors duration-300">
                  <span className={`material-symbols-outlined ${item.color} text-4xl block group-hover:scale-110 transition-transform duration-300`}>
                    {item.icon}
                  </span>
                </div>
                <p className="text-2xl font-black tracking-tight text-slate-800 mb-1">{item.stat}</p>
                <p className="text-sm text-slate-500 font-semibold">{item.label}</p>
              </div>
            ))}
          </motion.div>
        </section>

        {/* ────────────────────────────────────────── */}
        {/* ABOUT SECTION                             */}
        {/* ────────────────────────────────────────── */}
        <section className="py-32 px-8 bg-surface-container-low/50 border-y border-slate-200/40 relative">
          <motion.div 
            initial={{ opacity: 0, y: 25 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.8 }} 
            className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 items-center"
          >
            <div className="md:col-span-5 space-y-6">
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black tracking-widest uppercase">
                About Us
              </span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight text-slate-900">
                Established 2011
              </h2>
              <div className="w-16 h-1.5 bg-amber-500 rounded-full"></div>
              <p className="text-lg text-slate-700 leading-relaxed font-semibold">
                RGUASF works as a vibrant home away from home for Assamese students, preserving heritage and building cross-state connections.
              </p>
              <p className="text-base text-slate-500 leading-relaxed font-normal">
                Connecting students from diverse backgrounds across Assam, we offer mentoring, career pipelines, and administrative support at Rajiv Gandhi University in Arunachal Pradesh.
              </p>
              <div>
                <Link to="/about" className="inline-flex items-center gap-2 text-primary font-extrabold hover:gap-3 transition-all duration-300 group">
                  Discover Our Mission 
                  <span className="material-symbols-outlined text-lg group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                </Link>
              </div>
            </div>
            
            <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { icon: 'diversity_3', title: 'Cultural Preservation', desc: 'Safeguarding the rich heritage of Assam through vibrant festivals and cultural showcases in Arunachal Pradesh.', color: 'border-amber-100' },
                { icon: 'volunteer_activism', title: 'Student Welfare', desc: 'Dedicated support systems for academic success and administrative guidance for students at RGU.', color: 'border-rose-100' },
                { icon: 'handshake', title: 'Unity & Strength', desc: 'Building a cohesive community that thrives on mutual respect and collaborative growth.', color: 'border-indigo-100' },
              ].map((item, idx) => (
                <div 
                  key={item.title} 
                  className={`bg-white/80 backdrop-blur-md border ${item.color} shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-7 rounded-[2rem] space-y-4 hover:shadow-[0_12px_40px_rgb(37,99,235,0.06)] hover:-translate-y-1 transition-all duration-300 ${idx === 2 ? 'sm:col-span-2' : ''}`}
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-2xl">{item.icon}</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-800 leading-tight">{item.title}</h3>
                  <p className="text-slate-550 text-sm leading-relaxed font-normal">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ────────────────────────────────────────── */}
        {/* LIVE NOTICE BOARD                         */}
        {/* ────────────────────────────────────────── */}
        <section className="py-32 px-8">
          <motion.div 
            initial={{ opacity: 0, y: 25 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.8 }} 
            className="max-w-5xl mx-auto"
          >
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-black tracking-widest uppercase mb-3">
                  Stay Updated
                </span>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
                  Announcements & Circulars
                </h2>
              </div>
              <span className="flex items-center gap-2 text-primary font-bold bg-blue-50/70 border border-blue-100 px-4 py-2 rounded-full text-sm self-start">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                Live Board
              </span>
            </div>
            
            {loading ? (
              <div className="space-y-4">
                {[1, 2].map((n) => (
                  <div key={n} className="h-32 bg-slate-100 animate-pulse rounded-2xl"></div>
                ))}
              </div>
            ) : notices.length > 0 ? (
              <div className="space-y-4">
                {notices.map((notice) => {
                  const dateObj = new Date(notice.timestamp);
                  const month = dateObj.toLocaleString('en-US', { month: 'short' });
                  const day = dateObj.getDate();
                  const timeStr = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                  return (
                    <div key={notice._id} className="bg-white/70 backdrop-blur-md border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-6 rounded-2xl flex items-start gap-6 hover:shadow-[0_8px_30px_rgb(37,99,235,0.08)] hover:-translate-y-0.5 transition-all group">
                      <div className="flex flex-col items-center justify-center bg-slate-50 w-20 h-20 rounded-xl shrink-0 group-hover:bg-primary/10 transition-colors">
                        <span className="text-xs uppercase font-bold text-primary">{month}</span>
                        <span className="text-2xl font-black">{day}</span>
                      </div>
                      <div className="flex-grow">
                        <h4 className="text-xl font-bold mb-1">{notice.title}</h4>
                        <p className="text-on-surface-variant mb-4">{notice.content}</p>
                        <span className="label-md text-slate-400 flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm">schedule</span>
                          {timeStr}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white/40 backdrop-blur-md border border-slate-200/50 p-16 rounded-[2.5rem] text-center border-dashed">
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4 border border-slate-100">
                  <span className="material-symbols-outlined text-3xl text-slate-400 block">notifications_off</span>
                </div>
                <p className="text-slate-650 font-bold text-lg">No Active Announcements</p>
                <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">When the forum administrators post news, circulars, or Bihu guidelines, they will appear here instantly.</p>
              </div>
            )}
          </motion.div>
        </section>

        {/* ────────────────────────────────────────── */}
        {/* EVENTS & GALLERY                          */}
        {/* ────────────────────────────────────────── */}
        <section className="py-32 px-8 bg-surface-container-low/30 border-t border-slate-200/20">
          <motion.div 
            initial={{ opacity: 0, y: 25 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.8 }} 
            className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16"
          >
            {/* Upcoming Event */}
            <div className="lg:col-span-4">
              <span className="inline-block px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black tracking-widest uppercase mb-3">
                Events
              </span>
              {loading ? (
                <div className="h-64 bg-slate-100 animate-pulse rounded-2xl"></div>
              ) : events.length > 0 ? (
                (() => {
                  const nextEvent = events[0];
                  const dateStr = new Date(nextEvent.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  });
                  return (
                    <div className="space-y-6">
                      <h3 className="text-3xl font-black text-slate-900 tracking-tight truncate">{nextEvent.title}</h3>
                      <div className="bg-primary p-8 rounded-3xl text-on-primary shadow-xl shadow-primary/20">
                        <p className="text-lg opacity-90 mb-8 font-light leading-relaxed line-clamp-3">{nextEvent.description}</p>
                        <div className="flex items-center gap-4 mb-8">
                          <span className="material-symbols-outlined text-2xl">calendar_month</span>
                          <span className="font-semibold text-lg">{dateStr}</span>
                        </div>
                        <button className="w-full py-4 bg-white text-primary font-bold rounded-xl hover:bg-slate-50 transition-colors active:scale-95 shadow-md">
                          View Details
                        </button>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="space-y-6">
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight">Calendar</h3>
                  <div className="bg-white/50 border border-slate-200/50 p-10 rounded-[2rem] text-slate-500 shadow-sm text-center">
                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4 border border-slate-100">
                      <span className="material-symbols-outlined text-2xl text-slate-400 block">event_busy</span>
                    </div>
                    <p className="font-bold text-slate-700">No Events Scheduled</p>
                    <p className="text-xs text-slate-400 mt-1">Cultural meets and general body sessions will be posted soon.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Gallery Preview */}
            <div className="lg:col-span-8">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-[10px] font-black tracking-widest uppercase mb-3">
                    Memories
                  </span>
                  <h3 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">Gallery Preview</h3>
                </div>
                <Link to="/gallery" className="text-primary font-bold border-b-2 border-primary hover:opacity-80 transition-opacity flex items-center gap-1">
                  View All Snapshots
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {(gallery.length > 0 ? gallery : [
                  { title: 'Tribute to Zubeen Garg', src: '/images/gallery/rgu_assam_students_forum_1758651281_3728159619387976937_62127049418.webp' },
                  { title: '', src: '/images/gallery/rgu_assam_students_forum_1712679025_3342516384470541996_62127049418.webp' },
                  { title: 'Inaugural Ceremony - Lamp Lighting', src: '/images/gallery/ceremony_1.jpg' },
                  { title: '', src: '/images/gallery/rgu_assam_students_forum_1746011910_3622132888348961264_62127049418.webp' },
                  { title: '', src: '/images/gallery/rgu_assam_students_forum_1712679025_3342516384596406818_62127049418.webp' },
                  { title: 'Tribute to Dr. Bhupen Hazarika', src: '/images/gallery/bhupen_hazarika.jpg' },
                ]).map((img, idx) => (
                  <div key={idx} className="aspect-square overflow-hidden rounded-[1.5rem] shadow-sm hover:shadow-xl transition-shadow group border border-slate-200/40 relative bg-slate-50 cursor-pointer">
                    <img alt={img.title || "Snapshot"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" src={img.src} />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <span className="text-white text-xs font-bold truncate">
                        {img.title || "Snapshot"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* ────────────────────────────────────────── */}
        {/* CTA BANNER                                */}
        {/* ────────────────────────────────────────── */}
        <section className="py-32 px-8">
          <motion.div 
            initial={{ opacity: 0, y: 25 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.8 }} 
            className="max-w-4xl mx-auto text-center bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-16 rounded-[2.5rem]"
          >
            <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-black tracking-widest uppercase mb-4">
              Get Involved
            </span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-6">
              Be part of something meaningful.
            </h2>
            <p className="text-slate-500 font-light leading-relaxed mb-10 max-w-xl mx-auto">
              Whether you're a fresher joining RGU or an experienced senior student, our doors are open. Connect, lead, and grow together.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/membership" className="bg-primary text-white px-10 py-4 rounded-xl text-base font-bold hover:bg-blue-600 transition-all shadow-xl shadow-primary/30 active:scale-95">
                Apply for Membership
              </Link>
              <Link to="/careers" className="px-10 py-4 rounded-xl text-base font-bold border-2 border-slate-200 text-slate-700 hover:border-primary hover:text-primary transition-all active:scale-95 bg-white/50 backdrop-blur-sm">
                Explore Careers
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
