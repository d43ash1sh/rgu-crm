import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { addMember } from '../api';

export default function Membership() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    year: '1st Year',
    contact: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await addMember(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', department: '', year: '1st Year', contact: '' });
    } catch (err) {
      console.error("Submission error:", err);
      setError('Something went wrong. Please try again or contact support.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const days = [];
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({ day: prevMonthDays - i, isCurrent: false });
    }
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrent: true,
        isToday: today.getDate() === i && today.getMonth() === month && today.getFullYear() === year
      });
    }
    const remainingSlots = 42 - days.length;
    for (let i = 1; i <= remainingSlots; i++) {
      days.push({ day: i, isCurrent: false });
    }
    return days;
  };

  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen">
      <Navbar />

      <main className="pt-32 pb-24 px-8 max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <section className="mb-20">
          <span className="text-primary font-label text-xs tracking-widest uppercase mb-4 block font-bold">Registration Portal</span>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 max-w-4xl">
            Membership Enrollment
          </h1>
          <p className="text-xl text-on-surface-variant font-light leading-relaxed max-w-2xl">
            Join the student community of the Assam Students' Forum. Your application will be reviewed within 48 hours.
          </p>
        </section>

        {/* Membership Application Form - MOVED TO TOP */}
        <section id="apply" className="mb-32 relative">
          <div className="max-w-4xl">
            {submitted ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-green-50 border border-green-200 p-12 rounded-3xl text-center">
                <span className="material-symbols-outlined text-green-500 text-6xl mb-6">check_circle</span>
                <h3 className="text-2xl font-bold text-green-900 mb-2">Application Received!</h3>
                <p className="text-green-700 mb-8">Thank you for joining. Our team will verify your details and get back to you soon.</p>
                <button onClick={() => setSubmitted(false)} className="bg-white border border-green-200 text-green-700 px-8 py-3 rounded-full font-bold hover:bg-green-100 transition-colors shadow-sm">Submit another application</button>
              </motion.div>
            ) : (
              <div className="bg-white/70 backdrop-blur-md border border-white/50 shadow-2xl p-8 md:p-12 rounded-3xl">
                <div className="mb-10">
                   <span className="text-primary font-label text-[10px] uppercase tracking-[0.3em] mb-2 block font-bold">New Registrations</span>
                   <h2 className="text-3xl font-bold tracking-tight">Apply for Membership</h2>
                </div>

                {error && (
                  <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium flex items-center gap-3">
                    <span className="material-symbols-outlined">error</span>
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Full Name</label>
                    <input
                      required
                      type="text"
                      placeholder="Enter your full name"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-6 py-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Email Address</label>
                    <input
                      required
                      type="email"
                      placeholder="Enter your university email"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-6 py-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Department</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Dept of Physics"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-6 py-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Year of Study</label>
                    <select
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-6 py-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    >
                      <option>1st Year</option>
                      <option>2nd Year</option>
                      <option>3rd Year</option>
                      <option>Final Year</option>
                      <option>PG / PhD</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Contact Number</label>
                    <input
                      required
                      type="tel"
                      placeholder="WhatsApp enabled number preferred"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-6 py-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2 pt-4">
                    <button
                      disabled={submitting}
                      type="submit"
                      className="w-full bg-primary text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-primary/30 hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                      {submitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Processing Application...
                        </>
                      ) : 'Submit Membership Application'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </section>

        {/* Gallery Section */}
        <section className="mb-32">
          <div className="mb-12">
            <span className="text-tertiary font-label text-xs tracking-widest uppercase mb-4 block">02 / Moments</span>
            <h2 className="text-4xl font-bold tracking-tight">Forum Gallery</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative group overflow-hidden bg-slate-200 aspect-square rounded-2xl">
              <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Ceremony 1" src="/images/gallery/ceremony_1.jpg" />
            </div>
            <div className="relative group overflow-hidden bg-slate-200 aspect-square rounded-2xl">
              <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Ceremony 2" src="/images/gallery/ceremony_2.jpg" />
            </div>
            <div className="relative group overflow-hidden bg-slate-200 aspect-square rounded-2xl">
              <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Bhupen Hazarika" src="/images/gallery/bhupen_hazarika.jpg" />
            </div>
          </div>
        </section>

        {/* Calendar Section */}
        <section className="mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
              <span className="text-tertiary font-label text-xs tracking-widest uppercase mb-4 block">03 / Schedule</span>
              <h2 className="text-4xl font-bold tracking-tight mb-8">Academic Calendar</h2>
              <div className="space-y-6 text-sm">
                <p className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-primary"></span> <strong>Bihu Festival:</strong> April 14 - 20</p>
                <p className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-tertiary"></span> <strong>Annual Meet:</strong> May 05</p>
                <p className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-error"></span> <strong>Membership Ends:</strong> August 30</p>
              </div>
            </div>
            <div className="lg:col-span-8">
              <div className="bg-white p-6 rounded-xl border border-outline-variant/10 shadow-sm overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-xl">{currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}</h3>
                  <div className="flex gap-4">
                    <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className="material-symbols-outlined text-slate-400 hover:text-primary">arrow_back_ios</button>
                    <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className="material-symbols-outlined text-slate-400 hover:text-primary">arrow_forward_ios</button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-[10px] font-bold text-slate-400 uppercase py-2">{day}</div>
                  ))}
                  {renderCalendarDays().map((d, index) => (
                    <div key={index} className={`h-16 flex items-center justify-center rounded-lg border border-transparent transition-all ${d.isCurrent ? 'bg-slate-50 hover:border-primary/20' : 'opacity-20'} ${d.isToday ? 'bg-primary text-white font-bold shadow-lg shadow-primary/30' : ''}`}>
                      {d.day}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
