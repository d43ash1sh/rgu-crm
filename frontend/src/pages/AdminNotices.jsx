import { motion } from 'framer-motion';
import { Bell, Plus, Filter, Trash2, Edit3 } from 'lucide-react';

export default function AdminNotices() {
  const notices = [
    { id: 1, title: 'Rongali Bihu 2026 Registration', date: '2026-04-14', priority: 'High', status: 'Live' },
    { id: 2, title: 'General Body Meeting Agenda', date: '2026-05-01', priority: 'Medium', status: 'Draft' },
  ];

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-slate-900 mb-2">Live Notices</h2>
          <p className="text-slate-500 font-medium text-sm tracking-tight">Central distribution system for official circulars and member bulletins.</p>
        </div>
        <button className="bg-primary text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold text-sm shadow-xl shadow-primary/20 hover:scale-105 transition-all">
          <Plus size={20} />
          Post New Notice
        </button>
      </header>

      <section className="bg-white/50 backdrop-blur-md border border-slate-200/10 rounded-[2rem] overflow-hidden">
        <div className="p-6 border-b border-slate-200/5 flex justify-between items-center px-10">
          <h4 className="font-black text-xs uppercase tracking-[0.3em] text-slate-400">Bulletin Archives</h4>
          <button className="text-slate-400 hover:text-primary transition-colors">
            <Filter size={18} />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Heading</th>
                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Release Date</th>
                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Priority</th>
                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50">
              {notices.map((n) => (
                <motion.tr 
                  key={n.id} 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-50 text-primary rounded-xl flex items-center justify-center shrink-0">
                         <Bell size={20} />
                      </div>
                      <span className="font-bold text-slate-900">{n.title}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-sm text-slate-500 font-medium">{n.date}</td>
                  <td className="px-10 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${n.priority === 'High' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500'}`}>
                      {n.priority}
                    </span>
                  </td>
                  <td className="px-10 py-6">
                     <span className={`flex items-center gap-2 text-[10px] font-black uppercase ${n.status === 'Live' ? 'text-green-600' : 'text-amber-600'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${n.status === 'Live' ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`}></div>
                        {n.status}
                     </span>
                  </td>
                  <td className="px-10 py-6 text-right">
                     <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-slate-400 hover:text-primary transition-colors"><Edit3 size={18} /></button>
                        <button className="p-2 text-slate-400 hover:text-error transition-colors"><Trash2 size={18} /></button>
                     </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
