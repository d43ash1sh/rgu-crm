import { useState, useEffect } from 'react';
import { getMembers, updateMemberStatus } from '../api';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  XCircle, 
  Download, 
  UserCheck, 
  UserPlus, 
  History,
  MoreHorizontal,
  Mail,
  Smartphone,
  GraduationCap
} from 'lucide-react';

export default function AdminManagement() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getMembers();
      setMembers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    setMembers(members.map(m => m._id === id ? { ...m, status } : m));
    try {
      await updateMemberStatus(id, status);
    } catch (err) {
      console.error(err);
      fetchData();
    }
  };

  const downloadCSV = () => {
    const headers = ['Name,Email,Department,Year,Contact,Status,Joined'];
    const rows = members.map(m => 
      `"${m.name}","${m.email}","${m.department}","${m.year}","${m.contact}","${m.status}","${new Date(m.joinedDate).toLocaleDateString()}"`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "asf_members_registry.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const pending = members.filter(m => m.status === 'pending');
  const approved = members.filter(m => m.status === 'active');

  return (
    <div className="space-y-12 pb-20">
      {/* Header Area */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-[0.3em] mb-4">
             <UserCheck size={14} />
             Registry Audit
          </div>
          <h2 className="text-5xl font-black tracking-tighter text-slate-900 leading-none">
            Member <span className="text-primary italic">Management</span>
          </h2>
          <p className="text-slate-500 font-medium text-lg mt-4 max-w-xl">
            Oversee the official registry, verify credentials, and curate the growing student network of the Assam Students’ Forum.
          </p>
        </div>
        <button 
          onClick={downloadCSV} 
          className="px-6 py-3.5 bg-slate-900 text-white font-bold text-xs uppercase tracking-widest rounded-2xl shadow-2xl shadow-slate-900/20 hover:scale-105 transition-all flex items-center gap-2"
        >
          <Download size={18} />
          Export Registry
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Pending Applications - Left Column */}
        <div className="lg:col-span-7 space-y-8">
          <div className="flex items-center justify-between px-2">
             <div>
                <h3 className="text-2xl font-black tracking-tight text-slate-900">Entrance Queue</h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">{pending.length} Applications Pending Verification</p>
             </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center p-20 bg-white/50 backdrop-blur-md rounded-[3rem] border border-slate-100">
               <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
               <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Accessing Secure Database...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {pending.length === 0 && (
                 <div className="p-20 text-center bg-white/50 backdrop-blur-md rounded-[3rem] border border-slate-100 italic font-bold text-slate-300">
                    Queue is empty. No signals detected.
                 </div>
              )}
              {pending.map((app) => (
                <motion.div 
                  layout
                  key={app._id} 
                  className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-200/10 shadow-xl shadow-slate-900/5 group relative overflow-hidden"
                >
                  <div className="flex justify-between items-start relative z-10">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-slate-900/10">
                         {app.name.substring(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-slate-900 tracking-tight">{app.name}</h4>
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 px-2 py-0.5 rounded-full mt-1 inline-block">
                           {app.department}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleStatusChange(app._id, 'active')} 
                        className="p-3 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white rounded-2xl transition-all shadow-lg shadow-green-600/0 hover:shadow-green-600/20"
                        title="Approve Member"
                      >
                        <CheckCircle2 size={24} />
                      </button>
                      <button 
                        onClick={() => handleStatusChange(app._id, 'rejected')} 
                        className="p-3 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-2xl transition-all shadow-lg shadow-red-600/0 hover:shadow-red-600/20"
                        title="Reject Application"
                      >
                        <XCircle size={24} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-50 relative z-10">
                     <div className="flex items-center gap-3">
                        <Mail size={16} className="text-slate-400" />
                        <span className="text-xs font-bold text-slate-500 truncate">{app.email}</span>
                     </div>
                     <div className="flex items-center gap-3">
                        <Smartphone size={16} className="text-slate-400" />
                        <span className="text-xs font-bold text-slate-500">{app.contact}</span>
                     </div>
                     <div className="flex items-center gap-3">
                        <GraduationCap size={16} className="text-slate-400" />
                        <span className="text-xs font-bold text-slate-500">{app.year}</span>
                     </div>
                  </div>

                  <UserPlus className="absolute -right-6 -bottom-6 w-32 h-32 text-slate-900/5 rotate-[-12deg] select-none pointer-events-none" />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Registry feed - Right Column */}
        <aside className="lg:col-span-5 space-y-8">
          <div className="bg-slate-900/95 backdrop-blur-2xl p-10 rounded-[3rem] text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden">
             <header className="mb-10 relative z-10">
                <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.3em] mb-4">
                   <History size={14} />
                   Approved Registry
                </div>
                <h4 className="text-3xl font-black tracking-tight">Recent <span className="opacity-50 text-white italic">Onboarding</span></h4>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-2">Active Forum Database</p>
             </header>
             
             <div className="space-y-6 relative z-10 h-[600px] overflow-y-auto pr-4 scrollbar-hide">
                {approved.length === 0 ? (
                  <p className="text-sm text-white/30 italic font-medium">Registry is currently locked. Approve applications to see growth signals.</p>
                ) : (
                  approved.map((m) => (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={m._id} 
                      className="p-5 bg-white/5 border border-white/5 rounded-[2rem] hover:bg-white/10 transition-all flex items-center justify-between group"
                    >
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-primary/20 text-primary rounded-xl flex items-center justify-center font-black text-xs">
                             {m.name.substring(0, 1).toUpperCase()}
                          </div>
                          <div>
                             <p className="text-sm font-bold text-white leading-none">{m.name}</p>
                             <p className="text-[10px] font-bold text-primary uppercase tracking-tighter mt-1">{m.department}</p>
                          </div>
                       </div>
                       <button className="text-white/20 group-hover:text-white transition-colors">
                          <MoreHorizontal size={20} />
                       </button>
                    </motion.div>
                  ))
                )}
             </div>

             <div className="absolute top-0 right-0 p-8">
                <div className="w-20 h-20 border border-white/5 rounded-full flex items-center justify-center">
                   <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                </div>
             </div>
          </div>

          <section className="bg-white/50 backdrop-blur-xl p-10 rounded-[3rem] border border-slate-100 flex items-center justify-between shadow-xl shadow-slate-900/5">
              <div>
                 <h4 className="text-lg font-black text-slate-900 tracking-tight">Audit Protocol</h4>
                 <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-widest">All actions are timestamped and logged.</p>
              </div>
              <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center ring-8 ring-slate-50 shadow-2xl">
                 <UserCheck size={20} />
              </div>
          </section>
        </aside>

      </div>
    </div>
  );
}
