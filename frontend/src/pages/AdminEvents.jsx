import { motion } from 'framer-motion';
import { Calendar, Plus, MoreVertical, MapPin, Clock } from 'lucide-react';

export default function AdminEvents() {
  const events = [
    { id: 1, title: 'Rongali Bihu Fest', date: 'April 25, 2026', location: 'Open Grounds', status: 'Upcoming' },
    { id: 2, title: 'Annual General Meet', date: 'May 05, 2026', location: 'Seminar Hall', status: 'Scheduled' },
  ];

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-slate-900 mb-2">Event Roadmap</h2>
          <p className="text-slate-500 font-medium text-sm tracking-tight">Curate intellectual symposiums and cultural celebrations for the RGUASF community.</p>
        </div>
        <button className="bg-primary text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold text-sm shadow-xl shadow-primary/20 hover:scale-105 transition-all">
          <Plus size={20} />
          Schedule New Event
        </button>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {events.map((e) => (
          <motion.div 
            key={e.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/70 backdrop-blur-xl border border-slate-200/20 p-8 rounded-[2.5rem] shadow-xl shadow-slate-900/5 hover:translate-y-[-4px] transition-all group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-primary/5 text-primary rounded-2xl group-hover:bg-primary group-hover:text-white transition-all">
                 <Calendar size={24} />
              </div>
              <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                <MoreVertical size={20} />
              </button>
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-4">{e.title}</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-500 font-semibold tracking-tight">
                <Clock size={16} className="text-primary" />
                {e.date}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-500 font-semibold tracking-tight">
                <MapPin size={16} className="text-primary" />
                {e.location}
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${e.status === 'Upcoming' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-400'}`}>
                 {e.status}
              </span>
              <button className="text-primary font-black text-[10px] uppercase tracking-widest hover:underline transition-all">
                 Edit Details
              </button>
            </div>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
