import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ThreeScene from '../components/ThreeScene';
import SearchBar from '../components/SearchBar';
import Filters from '../components/Filters';
import JobCard from '../components/JobCard';
import Loader from '../components/Loader';

export default function CareerHub() {
  const [query, setQuery] = useState('developer jobs ');
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJobs = async (searchQuery) => {
    setLoading(true);
    setError(null);
    try {
      const options = {
        method: 'GET',
        url: 'https://jsearch.p.rapidapi.com/search',
        params: {
          query: searchQuery,
          page: '1',
          num_pages: '1'
        },
        headers: {
          'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_KEY || '329a2c9f35mshd255444172a9e28p190ebfjsnada2d4784d60',
          'x-rapidapi-host': 'jsearch.p.rapidapi.com'
        }
      };

      const response = await axios.request(options);
      setJobs(response.data.data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load career data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(query);
  }, []); // eslint-disable-line

  const handleSearch = () => {
    if (!query.trim()) return;
    fetchJobs(query);
  };

  const filteredJobs = jobs.filter(job => {
    if (activeFilter === 'ALL') return true;
    if (!job.job_employment_type) return false;
    return job.job_employment_type.toUpperCase().includes(activeFilter);
  });

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen flex flex-col antialiased selection:bg-primary/20 selection:text-primary relative overflow-x-hidden">
      <Navbar />

      {/* 3D Background accent layer */}
      <ThreeScene />

      <main className="flex-1 relative pt-32 pb-24 px-8 max-w-7xl mx-auto w-full z-10">
        <div className="absolute inset-0 pointer-events-none radial-dots z-[-1] opacity-50"></div>

        {/* Header Segment */}
        <header className="mb-16 text-center max-w-3xl mx-auto py-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black tracking-widest uppercase">
              RGUASF Career Hub
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight text-slate-900">
              Discover opportunities,<br />build your future.
            </h1>
            <p className="text-lg md:text-xl text-slate-500 font-light leading-relaxed max-w-xl mx-auto">
              A premium space connecting Assamese students and RGU alumni to the digital economy. Find verified internships, remote roles, and full-time careers.
            </p>
          </motion.div>

          {/* Unified search/filters dashboard wrapper */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-12 p-8 bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_12px_40px_rgb(0,0,0,0.03)] rounded-[2.5rem] max-w-4xl mx-auto"
          >
            <SearchBar query={query} setQuery={setQuery} handleSearch={handleSearch} />
            <Filters activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
          </motion.div>
        </header>

        {/* Dynamic Feed Segment */}
        <section className="min-h-[500px] relative z-20">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-20 bg-white/50 backdrop-blur-md rounded-[2.5rem] border border-slate-100/50">
              <Loader />
              <p className="text-xs font-black text-slate-450 uppercase tracking-wider mt-4">Querying RapidAPI Job Feeds...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-red-50/70 backdrop-blur-md rounded-[2.5rem] border border-red-100/60 p-8 max-w-xl mx-auto">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-red-650 text-2xl">error</span>
              </div>
              <p className="text-red-900 font-extrabold text-lg">System Connection Issue</p>
              <p className="text-red-750 text-sm mt-1">{error}</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-20 bg-white/50 backdrop-blur-md rounded-[2.5rem] border border-slate-200/55 shadow-sm p-8 max-w-xl mx-auto">
              <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-slate-400 text-2xl">search_off</span>
              </div>
              <p className="text-slate-800 font-extrabold text-lg">No Results Match</p>
              <p className="text-sm text-slate-505 mt-1">No active listings found for '{activeFilter}'. Try expanding your search queries or keywords.</p>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {filteredJobs.map((job) => (
                  <motion.div
                    key={job.job_id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <JobCard job={job} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
