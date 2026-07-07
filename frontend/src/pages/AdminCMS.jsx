import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getDashboardData } from '../api';
import { 
  Users, 
  Bell, 
  Calendar, 
  BookOpen, 
  ArrowUpRight, 
  Clock, 
  Plus, 
  ShieldCheck
} from 'lucide-react';

export default function AdminCMS() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getDashboardData().then(setData).catch(console.error);
  }, []);

  const stats = data?.stats || { totalMembers: 0, notices: 0, events: 0 };
  const pendingApps = data?.pendingApplications || [];
  const activities = data?.activities || [];

  return (
    <div className="space-y-6 pb-20">
      {/* Header Area */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#d8dee4]">
        <div>
          <h1 className="text-2xl font-semibold text-[#24292f] tracking-tight">Dashboard Overview</h1>
          <p className="text-xs text-[#57606a] mt-1">Real-time status updates of membership queues, notices, and events.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate('/admin/notices')} 
            className="bg-[#2da44e] hover:bg-[#2c974b] text-white py-1.5 px-3 border border-[rgba(27,31,36,0.15)] rounded-md font-semibold text-xs shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Plus size={14} />
            New Notice
          </button>
          <button 
            onClick={() => navigate('/admin')} 
            className="bg-[#f6f8fa] hover:bg-[#f3f4f6] text-[#24292f] border border-[#d0d7de] py-1.5 px-3 rounded-md font-semibold text-xs shadow-sm transition-colors cursor-pointer"
          >
            Review Registry
          </button>
        </div>
      </header>

      {/* Stats Counter Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Verified Members', val: stats.totalMembers, icon: Users, desc: 'Registered students' },
          { label: 'Active Announcements', val: stats.notices, icon: Bell, desc: 'Notices feed' },
          { label: 'Upcoming Events', val: stats.events, icon: Calendar, desc: 'Scheduled meets' },
        ].map((s) => (
          <div 
            key={s.label}
            className="bg-white border border-[#d8dee4] p-4 rounded-md shadow-sm flex items-center justify-between"
          >
            <div>
              <p className="text-xs text-[#57606a] font-medium">{s.label}</p>
              <h3 className="text-2xl font-semibold text-[#24292f] mt-1 tracking-tight">{s.val}</h3>
              <p className="text-[10px] text-[#57606a] mt-0.5">{s.desc}</p>
            </div>
            <div className="p-2 bg-[#f6f8fa] text-[#57606a] rounded-md border border-[#d8dee4]">
              <s.icon size={18} />
            </div>
          </div>
        ))}
      </section>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Pending Registry Table Card */}
        <section className="lg:col-span-8 bg-white border border-[#d8dee4] rounded-md shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-[#f6f8fa] border-b border-[#d8dee4] flex justify-between items-center">
            <h3 className="font-semibold text-xs text-[#24292f] uppercase tracking-wider">Pending Membership Enrolments</h3>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-[#ffebe9] text-[#cf222e] border border-[#ffc1c0]">
              {pendingApps.length} review required
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#f6f8fa]/50 text-[#57606a] border-b border-[#d8dee4]">
                  <th className="px-4 py-3 font-semibold">Student Name</th>
                  <th className="px-4 py-3 font-semibold">Academic Course</th>
                  <th className="px-4 py-3 font-semibold">Submitted Date</th>
                  <th className="px-4 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d8dee4] text-[#24292f]">
                {pendingApps.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-4 py-10 text-center text-[#57606a] italic">
                      All applications reviewed. No pending approvals.
                    </td>
                  </tr>
                ) : (
                  pendingApps.map((app) => (
                    <tr key={app.id} className="hover:bg-[#f6f8fa]/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 bg-[#24292f] text-white rounded-full flex items-center justify-center font-bold text-[10px]">
                            {app.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{app.name}</p>
                            <p className="text-[10px] text-[#57606a]">ID: {app.id.substring(0, 8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium">{app.department}</p>
                        <p className="text-[10px] text-[#57606a]">{app.rollNumber} • {app.year}</p>
                      </td>
                      <td className="px-4 py-3 text-[#57606a]">
                        {new Date(app.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button 
                          onClick={() => navigate('/admin')} 
                          className="bg-white hover:bg-[#f6f8fa] text-[#0969da] border border-[#d0d7de] p-1.5 rounded-md shadow-sm transition-colors cursor-pointer"
                        >
                          <ArrowUpRight size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Activity Feed and Security Panel */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Recent Operations Log */}
          <section className="bg-white border border-[#d8dee4] rounded-md shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-[#f6f8fa] border-b border-[#d8dee4] flex items-center gap-2">
              <Clock size={14} className="text-[#57606a]" />
              <h3 className="font-semibold text-xs text-[#24292f] uppercase tracking-wider">Recent Activity Logs</h3>
            </div>
            
            <div className="p-4 space-y-4">
              {activities.map((act, i) => (
                <div key={i} className="flex gap-2.5 items-start text-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#fd8c73] mt-1 shrink-0"></div>
                  <div>
                    <p className="font-medium text-[#24292f] leading-normal">{act.title}</p>
                    <p className="text-[10px] text-[#57606a] mt-0.5">{act.time}</p>
                  </div>
                </div>
              ))}
              {activities.length === 0 && (
                <p className="text-xs text-[#57606a] italic">No recent logged actions.</p>
              )}
            </div>
          </section>

          {/* Secure Cloud Shield Card */}
          <section className="bg-[#f6f8fa] border border-[#d8dee4] rounded-md shadow-sm p-4 text-[#24292f]">
            <div className="flex items-center gap-2 mb-2 text-[#2da44e]">
              <ShieldCheck size={18} />
              <h4 className="font-semibold text-sm">Security & Synchronization</h4>
            </div>
            <p className="text-xs text-[#57606a] leading-relaxed mb-4">
              All student profile registries and notice operations are end-to-end encrypted and synced. Administrative operations require hardware biometric signatures (FIDO2 Passkeys).
            </p>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#dafbe1] text-[#1a7f37] border border-[#aef1b9]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2da44e] animate-ping"></span>
              Secured Connection
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
