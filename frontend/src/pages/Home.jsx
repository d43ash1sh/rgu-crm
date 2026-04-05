import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ThreeHome from '../components/ThreeHome';

export default function Home() {
  return (
    <div className="bg-surface font-body text-on-surface min-h-screen flex flex-col antialiased selection:bg-primary/20 selection:text-primary relative overflow-x-hidden">
      <Navbar />

      {/* 3D Environment Layer — same pattern as CareerHub */}
      <ThreeHome />

      <main className="flex-1 relative z-10">
        <div className="absolute inset-0 pointer-events-none radial-dots z-[-1] opacity-50"></div>

        {/* ────────────────────────────────────────── */}
        {/* HERO                                      */}
        {/* ────────────────────────────────────────── */}
        <header className="pt-40 pb-32 px-8 text-center max-w-3xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="label-md text-primary tracking-[0.3em] mb-4 block uppercase font-bold">Rajiv Gandhi University</span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-tight mb-6">
              Assam Students' Forum
            </h1>
            <p className="text-xl text-slate-500 font-light leading-relaxed mb-4">
              A home away from home for Assamese students at RGU — built on unity, culture, and support.
            </p>
            {/* <p className="text-lg text-slate-400 font-medium italic mb-10">
              একা হৈ আগবাঢ়ো, সংস্কৃতি ৰক্ষা কৰো
            </p> */}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/about" className="bg-primary text-on-primary px-10 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-primary/20 active:scale-95">
              Explore More
            </Link>
            <Link to="/membership" className="px-10 py-4 rounded-xl text-lg font-semibold border-2 border-slate-300 text-slate-700 hover:border-primary hover:text-primary transition-all active:scale-95">
              Apply for Membership
            </Link>
          </motion.div>
        </header>

        {/* ────────────────────────────────────────── */}
        {/* PILLARS — glassmorphic stat cards          */}
        {/* ────────────────────────────────────────── */}
        <section className="px-8 pb-32 max-w-6xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: 'diversity_3', label: 'Cultural Preservation', stat: 'Since 2011' },
              { icon: 'volunteer_activism', label: 'Student Welfare', stat: '500+ Members' },
              { icon: 'handshake', label: 'Unity & Strength', stat: 'Pan-Assam' },
              { icon: 'hub', label: 'Assam–Arunachal Bridge', stat: '2 States' },
            ].map((item) => (
              <div key={item.label} className="bg-white/70 backdrop-blur-md border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(37,99,235,0.12)] p-6 rounded-2xl text-center group transition-all hover:-translate-y-1">
                <span className="material-symbols-outlined text-primary text-4xl mb-4 block group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
                <p className="text-2xl font-extrabold tracking-tight mb-1">{item.stat}</p>
                <p className="text-sm text-slate-500 font-medium">{item.label}</p>
              </div>
            ))}
          </motion.div>
        </section>

        {/* ────────────────────────────────────────── */}
        {/* ABOUT SECTION                             */}
        {/* ────────────────────────────────────────── */}
        <section className="py-32 px-8 bg-surface-container-low">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16">
            <div className="md:col-span-5">
              <span className="label-md text-primary tracking-[0.3em] mb-4 block uppercase font-bold">About Us</span>
              <h2 className="text-5xl font-bold tracking-tight mb-6">Established 2011</h2>
              <div className="w-20 h-1 bg-tertiary mb-10"></div>
              <p className="text-xl text-on-surface-variant leading-relaxed mb-6 font-medium">
                A home away from home for Assamese students at RGU — built on unity, culture, and support.
              </p>
              <p className="text-lg text-slate-500 leading-relaxed">
                RGUASF is a student community that supports, connects, and represents Assamese students at Rajiv Gandhi University while preserving cultural identity and fostering unity.
              </p>
              <Link to="/about" className="inline-flex items-center gap-2 text-primary font-bold mt-8 hover:gap-3 transition-all">
                Read our story <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </Link>
            </div>
            <div className="md:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { icon: 'diversity_3', title: 'Cultural Preservation', desc: 'Safeguarding the rich heritage of Assam through vibrant festivals and cultural showcases in Arunachal Pradesh.' },
                { icon: 'volunteer_activism', title: 'Student Welfare', desc: 'Dedicated support systems for academic success and administrative guidance for students at RGU.' },
                { icon: 'handshake', title: 'Unity & Strength', desc: 'Building a cohesive community that thrives on mutual respect and collaborative growth.' },
                { icon: 'hub', title: 'Assam–Arunachal Connection', desc: 'Strengthening the socio-cultural ties between the two sister states through academic dialogue.' },
              ].map((item) => (
                <div key={item.title} className="bg-white/70 backdrop-blur-md border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 rounded-2xl space-y-3 hover:shadow-[0_8px_30px_rgb(37,99,235,0.08)] transition-all">
                  <span className="material-symbols-outlined text-primary text-3xl">{item.icon}</span>
                  <h3 className="text-lg font-bold">{item.title}</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ────────────────────────────────────────── */}
        {/* LIVE NOTICE BOARD                         */}
        {/* ────────────────────────────────────────── */}
        <section className="py-32 px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <div>
                <span className="label-md text-primary tracking-[0.3em] mb-2 block uppercase font-bold">Stay Updated</span>
                <h2 className="text-4xl font-bold tracking-tight">Announcements</h2>
              </div>
              <span className="flex items-center gap-2 text-primary font-semibold bg-red-50 px-4 py-2 rounded-full">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                Live Board
              </span>
            </div>
            <div className="space-y-4">
              {[
                { month: 'Apr', day: '14', title: 'Registration for Rongali Bihu 2026 Celebration', desc: 'All members are requested to register their names for the cultural performance sequence by end of week.', time: '10:30 AM • Admin Block' },
                { month: 'May', day: '05', title: 'General Body Meeting: Annual Budget Review', desc: 'Mandatory attendance for all departmental representatives in the Seminar Hall.', time: '03:00 PM • Seminar Hall' },
              ].map((notice) => (
                <div key={notice.title} className="bg-white/70 backdrop-blur-md border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 rounded-2xl flex items-start gap-6 hover:shadow-[0_8px_30px_rgb(37,99,235,0.12)] hover:-translate-y-0.5 transition-all group">
                  <div className="flex flex-col items-center justify-center bg-slate-50 w-20 h-20 rounded-xl shrink-0 group-hover:bg-primary/10 transition-colors">
                    <span className="text-xs uppercase font-bold text-primary">{notice.month}</span>
                    <span className="text-2xl font-black">{notice.day}</span>
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-xl font-bold mb-1">{notice.title}</h4>
                    <p className="text-on-surface-variant mb-4">{notice.desc}</p>
                    <span className="label-md text-slate-400 flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">schedule</span>
                      {notice.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ────────────────────────────────────────── */}
        {/* EXECUTIVE BODY                            */}
        {/* ────────────────────────────────────────── */}
        {/* <section className="py-32 px-8 bg-surface-container-low">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <span className="label-md text-primary tracking-[0.3em] mb-2 block uppercase font-bold">Leadership</span>
              <h2 className="text-5xl font-bold tracking-tight mt-2">Executive Body</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { name: 'Deepjyoti Baruah', role: 'President', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD41zvUZLBuCitedM0WxTE_1xczz-S-aCX72XiHDJGaNVY3xkR7Gjk0e034gDoiUW1Nsn1sZcMAloc1ERofcvCcIkooG4pr5sp9r_o_AeiFvupJNCwUKXt_qvxIX9IzHK8-DJHI7hhuunEfJIuxORSkCSkJy8uR51JI_P7WB9LYlq3XenvglHODYCCV8_1LdjntYagFS0w1tL2rlAhY7AB_n1SPZnVK0Wve7SBwhRo9UziPcLrpVlMOpXJpbrmQo4rJtNZHSpzpeAU' },
                { name: 'Ananya Saikia', role: 'Vice President', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZ9WMEONDRUOiar26vGBIQ97B3QgpIp9zqG-FgRy6KAiNVSGPmd-yppBbFazTgpkU67zwfUe7eqAl7vdk4QDKzoi_rCTjM3rjUAiW3mxQd5FaxstBAQahqA6yNJRhLh3Au5cd-yyQ9RQDhQ-Q4Ov_p2JP-HRMW81PDu_X4DuFYLoB9Op08Bg8mwu6wb7QJKJk2yoh10PP_qVERMcTGYakMZOATxc1moGnMotn1tbdTjQiNZOfKlNo2FlC-x3twS7hjDSkK6-csHWU' },
                { name: 'Rupesh Gogoi', role: 'General Secretary', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBADUPRW-Mk6ZFSqvpv8AqkT6qkz9zqzNASVFnXfMtgAx5Cg_QsQrcxF8PZVmD7VVzJky7ooPWTEzequRLq9I9xRIeTEFz6ImzrGcRrq-hsvH9xtttExL0IrAEPcLaRc-6kQyvhY6Gnn6F12JuJ8bDbp9X7n6tPWPxbDIsb2fxQ6ketECgtG5rkOvfgGzZy9IpKu4yqKkhtJ5hKDtH6v6wpv_fd384b3P0osi3y-akBvjhDklbvfeZ1qt4L8aTWw8_lQE3qC70tN-s' },
              ].map((person) => (
                <div key={person.name} className="group text-center">
                  <div className="aspect-square mb-8 overflow-hidden rounded-2xl grayscale hover:grayscale-0 transition-all duration-500 shadow-lg hover:shadow-xl">
                    <img alt={person.role} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={person.img} />
                  </div>
                  <h4 className="text-2xl font-bold">{person.name}</h4>
                  <p className="text-primary font-medium mt-1">{person.role}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section> */}

        {/* ────────────────────────────────────────── */}
        {/* EVENTS & GALLERY                          */}
        {/* ────────────────────────────────────────── */}
        <section className="py-32 px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Upcoming Event */}
            <div className="lg:col-span-4">
              <span className="label-md text-primary tracking-[0.3em] mb-4 block uppercase font-bold">Upcoming</span>
              <h3 className="text-4xl font-bold mb-8">Rongali Bihu 2026</h3>
              <div className="bg-primary p-8 rounded-2xl text-on-primary shadow-xl shadow-primary/20">
                <p className="text-lg opacity-90 mb-6">Celebrating the Assamese New Year with traditional dance, food, and cultural festivities.</p>
                <div className="flex items-center gap-4 mb-8">
                  <span className="material-symbols-outlined">calendar_month</span>
                  <span className="font-medium">April 25, 2026</span>
                </div>
                <button className="w-full py-3 bg-white text-primary font-bold rounded-xl hover:bg-slate-100 transition-colors active:scale-95">
                  Join Celebration
                </button>
              </div>
            </div>

            {/* Gallery Preview */}
            <div className="lg:col-span-8">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <span className="label-md text-primary tracking-[0.3em] mb-2 block uppercase font-bold">Memories</span>
                  <h3 className="text-4xl font-bold">Gallery</h3>
                </div>
                <Link to="/gallery" className="text-primary font-bold border-b-2 border-primary hover:opacity-80 transition-opacity">
                  View All
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { alt: 'Ceremony 1', src: '/images/gallery/ceremony_1.jpg' },
                  { alt: 'Ceremony 2', src: '/images/gallery/ceremony_2.jpg' },
                  { alt: 'Bhupen Hazarika', src: '/images/gallery/bhupen_hazarika.jpg' },
                ].map((img) => (
                  <div key={img.alt} className="aspect-square overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-shadow group">
                    <img alt={img.alt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src={img.src} />
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
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="max-w-4xl mx-auto text-center bg-white/70 backdrop-blur-md border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-16 rounded-3xl">
            <span className="label-md text-primary tracking-[0.3em] mb-4 block uppercase font-bold">Get Involved</span>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-6">
              Be part of something meaningful.
            </h2>
            <p className="text-xl text-slate-500 font-light leading-relaxed mb-10 max-w-2xl mx-auto">
              Whether you're a fresher or a senior, RGUASF welcomes you. Join a community that celebrates Assamese identity and empowers students.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/membership" className="bg-primary text-on-primary px-10 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-primary/20 active:scale-95">
                Apply for Membership
              </Link>
              <Link to="/careers" className="px-10 py-4 rounded-xl text-lg font-semibold border-2 border-slate-300 text-slate-700 hover:border-primary hover:text-primary transition-all active:scale-95">
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
