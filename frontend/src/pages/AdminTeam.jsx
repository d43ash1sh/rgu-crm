import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, ShieldAlert, Upload, X, Save } from 'lucide-react';
import { getTeamMembers, addTeamMember, updateTeamMember, deleteTeamMember, uploadFile } from '../api';

export default function AdminTeam() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    department: '',
    photoURL: ''
  });
  
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const data = await getTeamMembers();
      setTeam(data);
    } catch (err) {
      console.error('Failed to fetch team roster:', err);
      setError('Failed to load team roster from database.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const res = await uploadFile(file);
      setFormData(prev => ({ ...prev, photoURL: res.url }));
    } catch (err) {
      console.error('Cloudinary upload failure:', err);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const openAddForm = () => {
    setEditId(null);
    setFormData({ name: '', role: '', department: '', photoURL: '' });
    setIsFormOpen(true);
  };

  const openEditForm = (member) => {
    setEditId(member._id);
    setFormData({
      name: member.name,
      role: member.role,
      department: member.department || '',
      photoURL: member.photoURL || ''
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.role) {
      alert('Name and Role are required.');
      return;
    }

    try {
      if (editId) {
        await updateTeamMember(editId, formData);
      } else {
        await addTeamMember(formData);
      }
      setIsFormOpen(false);
      fetchTeam();
    } catch (err) {
      console.error('Form submission failure:', err);
      alert('Failed to save executive member details.');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to revoke the executive role of ${name}?`)) return;
    try {
      await deleteTeamMember(id);
      fetchTeam();
    } catch (err) {
      console.error('Failed to revoke role:', err);
      alert('Failed to remove executive profile.');
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header Area */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#d8dee4]">
        <div>
          <h1 className="text-2xl font-semibold text-[#24292f] tracking-tight">Executive Committee</h1>
          <p className="text-xs text-[#57606a] mt-1">Manage the governing body, roles, and administrative privileges for the RGUASF portal.</p>
        </div>
        {!isFormOpen && (
          <button 
            onClick={openAddForm}
            className="bg-[#2da44e] hover:bg-[#2c974b] text-white py-1.5 px-3 border border-[rgba(27,31,36,0.15)] rounded-md font-semibold text-xs shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Plus size={14} />
            Assign New Role
          </button>
        )}
      </header>

      {/* Roster Input Form (Clean GitHub style modal/card) */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.section 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white border border-[#d8dee4] rounded-md shadow-sm overflow-hidden"
          >
            <div className="px-4 py-3 bg-[#f6f8fa] border-b border-[#d8dee4] flex items-center justify-between">
              <h3 className="font-semibold text-xs text-[#24292f] uppercase tracking-wider">
                {editId ? 'Edit Executive Profile' : 'Assign Executive Role'}
              </h3>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="text-[#57606a] hover:text-[#24292f] transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Profile Photo Uploader */}
                <div className="flex flex-col items-center justify-center p-4 border border-dashed border-[#d8dee4] rounded-md bg-[#f6f8fa]/50">
                  {formData.photoURL ? (
                    <div className="relative w-24 h-24 rounded-full overflow-hidden border border-[#d8dee4] group">
                      <img src={formData.photoURL} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, photoURL: '' }))}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center cursor-pointer w-24 h-24 rounded-full border border-dashed border-[#d8dee4] hover:bg-white transition-colors">
                      {uploading ? (
                        <span className="text-[10px] text-[#57606a] animate-pulse">Uploading...</span>
                      ) : (
                        <>
                          <Upload size={18} className="text-[#57606a] mb-1" />
                          <span className="text-[9px] text-[#57606a] font-medium">Upload Image</span>
                        </>
                      )}
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handlePhotoUpload}
                        disabled={uploading}
                      />
                    </label>
                  )}
                </div>

                {/* Text Fields */}
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <label className="block font-semibold text-[#24292f] mb-1">Full Representative Name <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      placeholder="e.g. Debashish Bordoloi"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-1.5 border border-[#d0d7de] rounded-md focus:border-[#0969da] focus:ring-1 focus:ring-[#0969da] outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-[#24292f] mb-1">Office / Executive Role <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        placeholder="e.g. President"
                        required
                        value={formData.role}
                        onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                        className="w-full px-3 py-1.5 border border-[#d0d7de] rounded-md focus:border-[#0969da] focus:ring-1 focus:ring-[#0969da] outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#24292f] mb-1">Department / Branch</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Computer Science"
                        value={formData.department}
                        onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                        className="w-full px-3 py-1.5 border border-[#d0d7de] rounded-md focus:border-[#0969da] focus:ring-1 focus:ring-[#0969da] outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-2 border-t border-[#d8dee4]">
                <button 
                  type="button" 
                  onClick={() => setIsFormOpen(false)}
                  className="bg-[#f6f8fa] hover:bg-[#f3f4f6] text-[#24292f] border border-[#d0d7de] py-1.5 px-3 rounded-md font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={uploading}
                  className="bg-[#2da44e] hover:bg-[#2c974b] text-white border border-[rgba(27,31,36,0.15)] py-1.5 px-3 rounded-md font-semibold transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Save size={14} />
                  {editId ? 'Update Details' : 'Publish Profile'}
                </button>
              </div>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Roster Listing Card */}
      <section className="bg-white border border-[#d8dee4] rounded-md shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-[#f6f8fa] border-b border-[#d8dee4] flex items-center justify-between">
          <h3 className="font-semibold text-xs text-[#24292f] uppercase tracking-wider">Governing Body Roster</h3>
          <span className="text-[10px] text-[#57606a] font-medium">{team.length} executives verified</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-[#57606a] text-xs">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#0969da] mx-auto mb-2"></div>
            Loading committee roster from database...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500 text-xs">
            {error}
          </div>
        ) : team.length === 0 ? (
          <div className="p-8 text-center text-[#57606a] text-xs">
            No executive members registered. Click "Assign New Role" to register.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#f6f8fa]/50 text-[#57606a] border-b border-[#d8dee4]">
                  <th className="px-4 py-3 font-semibold">Representative</th>
                  <th className="px-4 py-3 font-semibold">Assigned Office / Title</th>
                  <th className="px-4 py-3 font-semibold">Department</th>
                  <th className="px-4 py-3 font-semibold">Administrative Access</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d8dee4] text-[#24292f]">
                {team.map((member) => (
                  <tr key={member._id} className="hover:bg-[#f6f8fa]/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-[#d8dee4] shrink-0 bg-slate-100 flex items-center justify-center font-bold text-[10px]">
                          {member.photoURL ? (
                            <img src={member.photoURL} alt={member.name} className="w-full h-full object-cover" />
                          ) : (
                            member.name.substring(0, 1).toUpperCase()
                          )}
                        </div>
                        <span className="font-semibold text-sm">{member.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#24292f] font-medium">{member.role}</td>
                    <td className="px-4 py-3 text-[#57606a]">{member.department || 'General'}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#dafbe1] text-[#1a7f37] border border-[#aef1b9]">
                        Active
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => openEditForm(member)}
                          className="p-1 hover:bg-[#f3f4f6] text-[#57606a] hover:text-[#24292f] rounded transition-colors cursor-pointer"
                          title="Edit Profile"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button 
                          onClick={() => handleDelete(member._id, member.name)}
                          className="p-1 hover:bg-[#ffebe9] text-[#cf222e] rounded transition-colors cursor-pointer"
                          title="Revoke Role"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Security Advisory Block */}
      <section className="p-4 bg-[#fff8c5] border border-[#d4a72c]/30 rounded-md text-xs flex gap-3 text-[#735c0f]">
        <ShieldAlert size={18} className="shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold">Security Advisory: Executive Audits</h4>
          <p className="text-slate-600 mt-1 leading-relaxed">
            Changing executive roles distributes access permissions for approving student registries and housing postings. Verify candidate identities prior to assigning administrative access.
          </p>
        </div>
      </section>
    </div>
  );
}
