import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';



export default function About() {
  return (
    <div className="bg-surface font-body text-on-surface min-h-screen flex flex-col antialiased selection:bg-primary/20 selection:text-primary">
      <Navbar />
      
      <main className="flex-1 relative pt-32 pb-24 px-8 max-w-5xl mx-auto w-full z-10">
        <div className="absolute inset-0 pointer-events-none radial-dots z-[-1] opacity-50"></div>
        
        {/* Header Segment */}
        <header className="mb-24 text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black tracking-widest uppercase">
              Established 2011
            </span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight text-slate-900">
              About RGU<span className="text-primary">ASF</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 font-light leading-relaxed italic max-w-2xl mx-auto">
              “A home away from home for Assamese students at RGU — built on unity, culture, and support.”
            </p>
          </motion.div>
        </header>

        {/* Identity & Mission Segment */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32 items-stretch">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white/80 backdrop-blur-xl border border-slate-200/50 p-10 rounded-[2.5rem] flex flex-col justify-center space-y-6"
          >
            <h2 className="text-3xl font-black text-slate-900 tracking-tight pb-3 border-b border-slate-100">Who We Are</h2>
            <p className="text-base text-slate-650 leading-relaxed font-normal">
              The Assam Students’ Forum, Rajiv Gandhi University (RGUASF) is a student-led community representing the Assamese student body at Rajiv Gandhi University in Arunachal Pradesh.
            </p>
            <p className="text-base text-slate-650 leading-relaxed font-normal">
              RGUASF focuses on welcoming new students, assisting with academic integration, representing concerns, and maintaining ties with local communities and sister student organizations.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-primary p-10 rounded-[2.5rem] text-on-primary flex flex-col justify-center shadow-xl shadow-primary/20"
          >
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-white text-2xl">visibility</span>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight mb-4">Our Vision</h2>
            <p className="text-lg text-white/90 leading-relaxed font-light">
              To build a strong, connected, and supportive Assamese student community at Rajiv Gandhi University that encourages academic growth, cultural pride, and collaborative respect between neighboring states.
            </p>
          </motion.div>
        </section>



        {/* What We Do & Mission Framework */}
        <section className="mb-32">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-black tracking-widest uppercase mb-3">
              Directives
            </span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">Mission & Activities</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Core Mission Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-blue-50/50 p-8 rounded-[2rem] border border-blue-100/60 space-y-6"
            >
              <h3 className="text-2xl font-black text-blue-900 flex items-center gap-3">
                <span className="material-symbols-outlined text-blue-600">api</span>
                Core Mission
              </h3>
              <ul className="space-y-4 text-slate-700 font-medium">
                {[
                  'Support Assamese students academically and socially.',
                  'Promote unity, cooperation, and leadership among members.',
                  'Preserve and celebrate Assamese culture and traditions.',
                  'Act as a platform for student voice and representation.'
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-blue-550 mt-0.5 text-lg shrink-0">check_circle</span>
                    <span className="text-base text-slate-650 font-normal">{text}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Activities Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="bg-indigo-50/50 p-8 rounded-[2rem] border border-indigo-100/60 space-y-6"
            >
              <h3 className="text-2xl font-black text-indigo-900 flex items-center gap-3">
                <span className="material-symbols-outlined text-indigo-600">local_activity</span>
                What We Do
              </h3>
              <ul className="space-y-4 text-slate-700 font-medium">
                {[
                  'Organize cultural events like Bihu celebrations and festivals.',
                  'Conduct student meetups, discussions, and guidance drives.',
                  'Provide accommodation and transport assistance for freshers.',
                  'Promote collaboration with other state student communities.'
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-indigo-550 mt-0.5 text-lg shrink-0">check_circle</span>
                    <span className="text-base text-slate-650 font-normal">{text}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>

        {/* Core Values Segment */}
        <section className="mb-12">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-black tracking-widest uppercase mb-3">
              Principles
            </span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">Our Core Values</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { title: 'Unity & Brotherhood', icon: 'diversity_1', color: 'text-blue-500', bg: 'bg-blue-50/55' },
              { title: 'Cultural Heritage', icon: 'temple_hindu', color: 'text-amber-500', bg: 'bg-amber-50/55' },
              { title: 'Leadership', icon: 'supervisor_account', color: 'text-emerald-500', bg: 'bg-emerald-50/55' },
              { title: 'Inclusivity & Respect', icon: 'volunteer_activism', color: 'text-rose-500', bg: 'bg-rose-50/55' }
            ].map((val, idx) => (
              <motion.div 
                key={val.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="bg-white/70 backdrop-blur-md p-7 rounded-[2rem] border border-slate-200/50 text-center hover:-translate-y-1 hover:border-slate-350 hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300 group"
              >
                <div className={`w-14 h-14 rounded-2xl ${val.bg} flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform`}>
                  <span className={`material-symbols-outlined text-3xl ${val.color} block`}>{val.icon}</span>
                </div>
                <h4 className="font-extrabold text-slate-800 text-lg leading-tight">{val.title}</h4>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
