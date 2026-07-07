import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Trash2, AlertCircle, Plus, Upload, Save } from 'lucide-react';
import { getGalleryItems, addGalleryItem, deleteGalleryItem, uploadFile } from '../api';

export default function AdminGallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Cultural');
  const [date, setDate] = useState('');
  const [src, setSrc] = useState('');
  
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const data = await getGalleryItems();
      setItems(data);
    } catch (err) {
      console.error('Failed to fetch gallery items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    setError(null);
    try {
      const res = await uploadFile(file);
      setSrc(res.url);
    } catch (err) {
      setError('Image upload failed.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!src) {
      setError('Please upload an image file.');
      return;
    }
    setSubmitting(true);
    try {
      await addGalleryItem({ title, category, date, src });
      setTitle('');
      setCategory('Cultural');
      setDate('');
      setSrc('');
      setShowAddForm(false);
      fetchItems();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add image to gallery.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this gallery item?')) return;
    try {
      await deleteGalleryItem(id);
      fetchItems();
    } catch (err) {
      console.error('Failed to delete gallery item:', err);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header Area */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#d8dee4]">
        <div>
          <h1 className="text-2xl font-semibold text-[#24292f] tracking-tight">Gallery Archive</h1>
          <p className="text-xs text-[#57606a] mt-1">Manage the visual history, event snapshots, and cultural archives of the Assam Students’ Forum.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-[#2da44e] hover:bg-[#2c974b] text-white py-1.5 px-3 border border-[rgba(27,31,36,0.15)] rounded-md font-semibold text-xs shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <Plus size={14} />
          {showAddForm ? 'Cancel' : 'Add Photo'}
        </button>
      </header>

      {/* Creation Card Form */}
      {showAddForm && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-[#d8dee4] rounded-md shadow-sm p-4 space-y-4"
        >
          <h3 className="font-semibold text-xs text-[#24292f] uppercase tracking-wider">Upload New Gallery Photo</h3>
          
          {error && (
            <div className="p-3 bg-[#ffebe9] border border-[#ffc1c0] text-[#cf222e] text-xs rounded-md flex items-center gap-2">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold mb-1 text-[#24292f]">Caption / Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Rongali Bihu stage celebration"
                  className="w-full px-3 py-1.5 bg-[#f6f8fa] border border-[#d0d7de] rounded-md text-xs outline-none focus:bg-white focus:border-[#0969da] text-[#24292f]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-[#24292f]">Month & Year</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Apr 2026"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#f6f8fa] border border-[#d0d7de] rounded-md text-xs outline-none focus:bg-white focus:border-[#0969da] text-[#24292f]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-[#24292f]">Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#f6f8fa] border border-[#d0d7de] rounded-md text-xs outline-none focus:bg-white focus:border-[#0969da] text-[#24292f]"
                >
                  <option value="Cultural">Cultural</option>
                  <option value="Ceremonies">Ceremonies</option>
                  <option value="Gatherings">Gatherings</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-[#24292f]">Upload Image File</label>
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer bg-[#f6f8fa] hover:bg-[#f3f4f6] text-[#24292f] border border-[#d0d7de] py-1.5 px-3 rounded-md font-semibold text-xs shadow-sm transition-colors flex items-center gap-1.5">
                    <Upload size={13} />
                    {uploadingImage ? 'Uploading...' : 'Choose File'}
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                  {src && (
                    <span className="text-[10px] text-[#2da44e] font-semibold truncate max-w-[150px]">
                      Uploaded ✓
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={submitting}
              className="bg-[#2da44e] hover:bg-[#2c974b] disabled:bg-[#94d3a2] text-white py-1.5 px-3 border border-[rgba(27,31,36,0.15)] rounded-md font-semibold text-xs shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Save size={14} />
              {submitting ? 'Saving...' : 'Add to Gallery'}
            </button>
          </form>
        </motion.div>
      )}

      {/* Gallery Items Listing Table */}
      <section className="bg-white border border-[#d8dee4] rounded-md shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-[#f6f8fa] border-b border-[#d8dee4] flex items-center justify-between">
          <h3 className="font-semibold text-xs text-[#24292f] uppercase tracking-wider">Archived Snapshots</h3>
          <span className="text-[10px] text-[#57606a] font-medium">{items.length} images cataloged</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#f6f8fa]/50 text-[#57606a] border-b border-[#d8dee4]">
                <th className="px-4 py-3 font-semibold">Image Preview</th>
                <th className="px-4 py-3 font-semibold">Caption</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d8dee4] text-[#24292f]">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-4 py-10 text-center text-[#57606a] italic">
                    Retrieving archived snapshots...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-10 text-center text-[#57606a] italic">
                    No images cataloged. Use "Add Photo" to post one.
                  </td>
                </tr>
              ) : (
                items.map((img) => (
                  <tr key={img._id} className="hover:bg-[#f6f8fa]/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="w-10 h-10 rounded border border-[#d8dee4] overflow-hidden bg-[#f6f8fa] shrink-0">
                        <img src={img.src} alt={img.title || "Preview"} className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-sm">{img.title || 'Untitled Snapshot'}</td>
                    <td className="px-4 py-3 text-[#57606a]">{img.category}</td>
                    <td className="px-4 py-3 text-[#57606a]">{img.date || 'N/A'}</td>
                    <td className="px-4 py-3 text-right">
                      <button 
                        onClick={() => handleDelete(img._id)}
                        className="p-1 hover:bg-[#ffebe9] text-[#cf222e] rounded transition-colors cursor-pointer"
                        title="Delete Image"
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
