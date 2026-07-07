import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Trash2, AlertCircle, Plus, Clock, MapPin, Save } from 'lucide-react';
import { getEvents, addEvent, deleteEvent } from '../api';

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (err) {
      console.error('Failed to fetch events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await addEvent({ title, description, date, location });
      setTitle('');
      setDescription('');
      setDate('');
      setLocation('');
      setShowAddForm(false);
      fetchEvents();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to schedule event.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await deleteEvent(id);
      fetchEvents();
    } catch (err) {
      console.error('Failed to delete event:', err);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header Area */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#d8dee4]">
        <div>
          <h1 className="text-2xl font-semibold text-[#24292f] tracking-tight">Event Roadmap</h1>
          <p className="text-xs text-[#57606a] mt-1">Schedule intellectual symposiums, general meets, and cultural festivals for the RGUASF community.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-[#2da44e] hover:bg-[#2c974b] text-white py-1.5 px-3 border border-[rgba(27,31,36,0.15)] rounded-md font-semibold text-xs shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <Plus size={14} />
          {showAddForm ? 'Cancel' : 'Schedule Event'}
        </button>
      </header>

      {/* Creation Card Form */}
      {showAddForm && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-[#d8dee4] rounded-md shadow-sm p-4 space-y-4"
        >
          <h3 className="font-semibold text-xs text-[#24292f] uppercase tracking-wider">Schedule New Event</h3>
          
          {error && (
            <div className="p-3 bg-[#ffebe9] border border-[#ffc1c0] text-[#cf222e] text-xs rounded-md flex items-center gap-2">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-[#24292f]">Event Title</label>
              <input 
                type="text" 
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Rongali Bihu Fest 2026"
                className="w-full px-3 py-1.5 bg-[#f6f8fa] border border-[#d0d7de] rounded-md text-xs outline-none focus:bg-white focus:border-[#0969da] focus:ring-[3px] focus:ring-[#0969da]/20 transition-all text-[#24292f]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-[#24292f]">Event Description</label>
              <textarea 
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the schedule, expectations, or guest details..."
                className="w-full px-3 py-1.5 bg-[#f6f8fa] border border-[#d0d7de] rounded-md text-xs outline-none focus:bg-white focus:border-[#0969da] focus:ring-[3px] focus:ring-[#0969da]/20 transition-all text-[#24292f]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-[#24292f]">Date</label>
                <input 
                  type="date" 
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#f6f8fa] border border-[#d0d7de] rounded-md text-xs outline-none focus:bg-white focus:border-[#0969da] text-[#24292f]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-[#24292f]">Location / Venue</label>
                <input 
                  type="text" 
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. RGU Seminar Hall"
                  className="w-full px-3 py-1.5 bg-[#f6f8fa] border border-[#d0d7de] rounded-md text-xs outline-none focus:bg-white focus:border-[#0969da] text-[#24292f]"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={submitting}
              className="bg-[#2da44e] hover:bg-[#2c974b] disabled:bg-[#94d3a2] text-white py-1.5 px-3 border border-[rgba(27,31,36,0.15)] rounded-md font-semibold text-xs shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Save size={14} />
              {submitting ? 'Scheduling...' : 'Schedule Event'}
            </button>
          </form>
        </motion.div>
      )}

      {/* Events Listing Card Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="md:col-span-2 p-12 text-center bg-white rounded-md border border-[#d8dee4] text-xs text-[#57606a]">
            Loading schedules...
          </div>
        ) : events.length === 0 ? (
          <div className="md:col-span-2 p-12 text-center bg-white rounded-md border border-[#d8dee4] text-xs text-[#57606a] italic">
            No events scheduled. Use "Schedule Event" to publish one.
          </div>
        ) : (
          events.map((e) => (
            <div 
              key={e._id}
              className="bg-white border border-[#d8dee4] p-4 rounded-md shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start gap-4">
                  <span className="p-1.5 bg-[#f6f8fa] text-[#57606a] rounded border border-[#d8dee4]">
                    <Calendar size={16} />
                  </span>
                  <button 
                    onClick={() => handleDelete(e._id)}
                    className="p-1 hover:bg-[#ffebe9] text-[#cf222e] rounded transition-colors cursor-pointer"
                    title="Remove Event"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <h3 className="font-semibold text-sm text-[#24292f] leading-snug">{e.title}</h3>
                <p className="text-xs text-[#57606a] leading-relaxed line-clamp-3">{e.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#f6f8fa] flex flex-wrap justify-between items-center gap-2 text-[10px] text-[#57606a] font-medium">
                <span className="flex items-center gap-1">
                  <Clock size={11} />
                  {new Date(e.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={11} />
                  {e.location}
                </span>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
