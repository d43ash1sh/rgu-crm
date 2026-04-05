import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getDashboardData } from '../api';
import { 
  TrendingUp, 
  Users, 
  Bell, 
  Calendar, 
  BookOpen, 
  ArrowUpRight, 
  Clock, 
  PlusCircle, 
  ChevronRight,
  Database
} from 'lucide-react';

export default function AdminCMS() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getDashboardData().then(setData).catch(console.error);
  }, []);

  const stats = data?.stats || { totalMembers: 0, notices: 0, events: 0, publications: 0 };
  const pendingApps = data?.pendingApplications || [];
  const activities = data?.activities || [];

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-[0.3em] mb-4">
               <TrendingUp size={14} />
               Live Overview
            </div>
            <h2 className="text-5xl font-black tracking-tighter text-slate-900 leading-none">
              Institutional <span className="text-primary italic">Pulse</span>
            </h2>
            <p className="text-slate-500 font-medium text-lg mt-4 max-w-xl">
              Real-time monitoring of membership growth, intellectual engagement, and organizational agility.
            </p>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={() => navigate('/admin/notices')} className="px-6 py-3.5 bg-slate-900 text-white font-bold text-xs uppercase tracking-widest rounded-2xl shadow-2xl shadow-slate-900/20 hover:scale-105 transition-all flex items-center gap-2">
                <PlusCircle size={18} />
                Add Notice
             </button>
             <button onClick={() => navigate('/admin')} className="px-6 py-3.5 bg-white border border-slate-200 text-slate-900 font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-all">
                Review Registry
             </button>
          </div>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Members', val: stats.totalMembers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+12%' },
            { label: 'Active Notices', val: stats.notices, icon: Bell, color: 'text-amber-600', bg: 'bg-amber-50', trend: 'Live' },
            { label: 'Upcoming Events', val: stats.events, icon: Calendar, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: 'Next: 4d' },
            { label: 'Publications', val: stats.publications, icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: 'New' },
          ].map((s, i) => (
            <motion.div 
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/70 backdrop-blur-md border border-slate-200/10 p-8 rounded-[2.5rem] shadow-xl shadow-slate-900/5 group hover:translate-y-[-5px] transition-all"
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 ${s.bg} ${s.color} rounded-2xl group-hover:scale-110 transition-transform`}>
                   <s.icon size={24} />
                </div>
                <span className={`text-[10px] font-black tracking-widest uppercase ${s.color}`}>
                   {s.trend}
                </span>
              </div>
              <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">{s.label}</p>
              <h4 className="text-4xl font-black text-slate-900 tracking-tighter mt-2">{s.val}</h4>
            </motion.div>
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Main List Section */}
          <section className="lg:col-span-8 bg-white/50 backdrop-blur-xl border border-slate-200/10 rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-900/5">
            <div className="p-10 border-b border-slate-200/10 flex justify-between items-center">
              <div>
                 <h4 className="text-2xl font-black tracking-tight text-slate-900">Pending Registrations</h4>
                 <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Audit Queue: Academic Session 25-26</p>
              </div>
              <button onClick={() => navigate('/admin')} className="text-primary font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                 View Full List <ChevronRight size={16} />
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/30">
                    <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Student Identity</th>
                    <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Department</th>
                    <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Timestamp</th>
                    <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Review</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/50">
                  {pendingApps.length === 0 ? (
                    <tr><td colSpan="4" className="px-10 py-20 text-center text-slate-400 font-bold italic">Clear skies! No pending applications in orbit.</td></tr>
                  ) : (
                    pendingApps.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-10 py-6">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-xs shrink-0">
                                 {app.name.substring(0, 2).toUpperCase()}
                              </div>
                              <div>
                                 <p className="font-bold text-slate-900 text-sm">{app.name}</p>
                                 <p className="text-[10px] font-bold text-slate-400 tracking-tighter italic">REF: {app.id.substring(0, 12)}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-10 py-6">
                           <span className="text-xs font-bold text-slate-600 block">{app.department}</span>
                           <span className="text-[10px] text-slate-400 font-medium">B.Tech / M.Sc</span>
                        </td>
                        <td className="px-10 py-6 text-xs text-slate-400 font-bold uppercase tracking-tighter">
                           {new Date(app.date).toLocaleDateString()}
                        </td>
                        <td className="px-10 py-6 text-right">
                           <button onClick={() => navigate('/admin')} className="p-3 bg-slate-100 text-slate-400 rounded-xl group-hover:bg-primary group-hover:text-white transition-all shadow-lg shadow-primary/0 group-hover:shadow-primary/20">
                              <ArrowUpRight size={20} />
                           </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-8 text-center bg-slate-50/20">
               <button onClick={() => navigate('/admin')} className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-primary transition-colors">
                  Initiate Full Sync with Global Database
               </button>
            </div>
          </section>

          {/* Activity Feed Column */}
          <aside className="lg:col-span-4 space-y-8">
             <section className="bg-slate-900/95 backdrop-blur-xl p-10 rounded-[3rem] text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden">
                <header className="mb-8 relative z-10">
                   <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.3em] mb-4">
                      <Clock size={14} />
                      Live Feed
                   </div>
                   <h4 className="text-2xl font-black tracking-tight">Recent <span className="opacity-50">Actions</span></h4>
                </header>
                
                <div className="space-y-10 relative z-10">
                   <div className="absolute left-[3px] top-2 bottom-2 w-[1px] bg-white/10"></div>
                   {activities.map((act, i) => (
                      <div key={i} className="relative pl-8">
                         <div className="absolute left-0 top-1 w-2 h-2 rounded-full bg-primary ring-4 ring-white/5 shadow-xl shadow-primary/50"></div>
                         <p className="text-sm font-bold text-white/90 leading-tight">{act.title}</p>
                         <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-3">{act.time}</p>
                      </div>
                   ))}
                   {activities.length === 0 && <p className="text-sm text-white/40 italic font-medium">Monitoring the void... No recent signals.</p>}
                </div>

                <button className="w-full mt-12 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-white/60 hover:bg-white hover:text-slate-900 transition-all">
                   Audit Logs
                </button>

                {/* Background Decor Component */}
                <Database className="absolute -right-10 -bottom-10 text-white/5 w-48 h-48 rotate-[-15deg] select-none" />
             </section>

             <section className="bg-primary p-10 rounded-[3rem] text-white/90 shadow-2xl shadow-primary/20 group cursor-pointer hover:scale-[1.02] transition-all">
                <h4 className="text-xl font-black tracking-tight mb-2">Cloud Connectivity</h4>
                <p className="text-sm font-medium text-white/70 leading-relaxed mb-6">Backup system is operational. All student data is end-to-end encrypted and synced with ASF central servers.</p>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white">
                   Status: Secured <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                </div>
             </section>
          </aside>
      </div>
    </div>
  );
}
