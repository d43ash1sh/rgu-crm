import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Trash2, AlertCircle, Plus, Eye, Save } from 'lucide-react';
import { getNotices, addNotice, deleteNotice } from '../api';

export default function AdminNotices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('Live');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const data = await getNotices();
      setNotices(data);
    } catch (err) {
      console.error('Failed to fetch notices:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await addNotice({ title, content, priority, status });
      setTitle('');
      setContent('');
      setShowAddForm(false);
      fetchNotices();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to publish notice.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) return;
    try {
      await deleteNotice(id);
      fetchNotices();
    } catch (err) {
      console.error('Failed to delete notice:', err);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header Area */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#d8dee4]">
        <div>
          <h1 className="text-2xl font-semibold text-[#24292f] tracking-tight">Announcements & notices</h1>
          <p className="text-xs text-[#57606a] mt-1">Manage announcements, circulars, and notifications shown on the live landing board.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-[#2da44e] hover:bg-[#2c974b] text-white py-1.5 px-3 border border-[rgba(27,31,36,0.15)] rounded-md font-semibold text-xs shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <Plus size={14} />
          {showAddForm ? 'Cancel' : 'New Notice'}
        </button>
      </header>

      {/* Creation Card Form */}
      {showAddForm && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-[#d8dee4] rounded-md shadow-sm p-4 space-y-4"
        >
          <h3 className="font-semibold text-xs text-[#24292f] uppercase tracking-wider">Publish New Notice</h3>
          
          {error && (
            <div className="p-3 bg-[#ffebe9] border border-[#ffc1c0] text-[#cf222e] text-xs rounded-md flex items-center gap-2">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-[#24292f]">Notice Title</label>
              <input 
                type="text" 
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Rongali Bihu 2026 Celebration guidelines"
                className="w-full px-3 py-1.5 bg-[#f6f8fa] border border-[#d0d7de] rounded-md text-xs outline-none focus:bg-white focus:border-[#0969da] focus:ring-[3px] focus:ring-[#0969da]/20 transition-all text-[#24292f]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-[#24292f]">Description / Content</label>
              <textarea 
                required
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write the detailed bulletin description here..."
                className="w-full px-3 py-1.5 bg-[#f6f8fa] border border-[#d0d7de] rounded-md text-xs outline-none focus:bg-white focus:border-[#0969da] focus:ring-[3px] focus:ring-[#0969da]/20 transition-all text-[#24292f]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-[#24292f]">Priority Level</label>
                <select 
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#f6f8fa] border border-[#d0d7de] rounded-md text-xs outline-none focus:bg-white focus:border-[#0969da] text-[#24292f]"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-[#24292f]">Publishing Status</label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#f6f8fa] border border-[#d0d7de] rounded-md text-xs outline-none focus:bg-white focus:border-[#0969da] text-[#24292f]"
                >
                  <option value="Live">Live (Active)</option>
                  <option value="Draft">Draft (Hidden)</option>
                </select>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={submitting}
              className="bg-[#2da44e] hover:bg-[#2c974b] disabled:bg-[#94d3a2] text-white py-1.5 px-3 border border-[rgba(27,31,36,0.15)] rounded-md font-semibold text-xs shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Save size={14} />
              {submitting ? 'Publishing...' : 'Publish Notice'}
            </button>
          </form>
        </motion.div>
      )}

      {/* Bulletin Archives Table */}
      <section className="bg-white border border-[#d8dee4] rounded-md shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-[#f6f8fa] border-b border-[#d8dee4] flex items-center justify-between">
          <h3 className="font-semibold text-xs text-[#24292f] uppercase tracking-wider">Bulletin Archives</h3>
          <span className="text-[10px] text-[#57606a] font-medium">{notices.length} notices on file</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#f6f8fa]/50 text-[#57606a] border-b border-[#d8dee4]">
                <th className="px-4 py-3 font-semibold">Heading</th>
                <th className="px-4 py-3 font-semibold">Created Date</th>
                <th className="px-4 py-3 font-semibold">Priority</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d8dee4] text-[#24292f]">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-4 py-10 text-center text-[#57606a] italic">
                    Retrieving bulletin archives...
                  </td>
                </tr>
              ) : notices.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-10 text-center text-[#57606a] italic">
                    No notices published yet. Use "New Notice" to add one.
                  </td>
                </tr>
              ) : (
                notices.map((n) => (
                  <tr key={n._id} className="hover:bg-[#f6f8fa]/50 transition-colors">
                    <td className="px-4 py-3 max-w-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 bg-[#f6f8fa] border border-[#d8dee4] text-[#57606a] rounded-full flex items-center justify-center shrink-0">
                          <Bell size={14} />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{n.title}</p>
                          <p className="text-[10px] text-[#57606a] line-clamp-1 mt-0.5">{n.content}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#57606a]">
                      {new Date(n.timestamp || n.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        n.priority === 'High' 
                          ? 'bg-[#ffebe9] text-[#cf222e] border-[#ffc1c0]' 
                          : n.priority === 'Medium'
                          ? 'bg-[#fff8c5] text-[#735c0f] border-[#d4a72c]/30'
                          : 'bg-[#f6f8fa] text-[#57606a] border-[#d8dee4]'
                      }`}>
                        {n.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#24292f]">
                        <span className={`w-1.5 h-1.5 rounded-full ${n.status === 'Live' ? 'bg-[#2da44e]' : 'bg-[#d4a72c]'}`}></span>
                        {n.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button 
                        onClick={() => handleDelete(n._id)}
                        className="p-1 hover:bg-[#ffebe9] text-[#cf222e] rounded transition-colors cursor-pointer"
                        title="Delete Notice"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
