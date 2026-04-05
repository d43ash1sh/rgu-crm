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

  // Initial load
  useEffect(() => {
    fetchJobs(query);
  }, []); // eslint-disable-line

  const handleSearch = () => {
    if (!query.trim()) return;
    fetchJobs(query);
  };

  // Filter Logic
  const filteredJobs = jobs.filter(job => {
    if (activeFilter === 'ALL') return true;
    if (!job.job_employment_type) return false;
    return job.job_employment_type.toUpperCase().includes(activeFilter);
  });

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen flex flex-col antialiased selection:bg-primary/20 selection:text-primary relative overflow-x-hidden">
      <Navbar />

      {/* 3D Environment Layer */}
      <ThreeScene />

      <main className="flex-1 relative pt-32 pb-24 px-8 max-w-7xl mx-auto w-full z-10">
        <div className="absolute inset-0 pointer-events-none radial-dots z-[-1] opacity-50"></div>

        {/* Header Segment */}
        <header className="mb-16 text-center max-w-3xl mx-auto py-12 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="label-md text-primary tracking-[0.3em] mb-4 block uppercase font-bold">RGUASF Career Hub</span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-tight mb-6">
              Discover opportunities, build your future.
            </h1>
            <p className="text-xl text-slate-500 font-light leading-relaxed mb-10">
              A premium space connecting Assamese students and RGU alumni to the digital economy. Find verified internships, remote roles, and full-time careers.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <SearchBar query={query} setQuery={setQuery} handleSearch={handleSearch} />
            <Filters activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
          </motion.div>
        </header>

        {/* Dynamic Feed Segment */}
        <section className="min-h-[500px] relative z-20">
          {loading ? (
            <Loader />
          ) : error ? (
            <div className="text-center py-20 bg-red-50 rounded-2xl border border-red-100">
              <span className="material-symbols-outlined text-4xl text-red-400 mb-4 block">error</span>
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-20 bg-surface-container-lowest rounded-2xl border border-outline-variant/20 shadow-sm">
              <span className="material-symbols-outlined text-4xl text-slate-300 mb-4 block">search_off</span>
              <p className="text-slate-500 font-medium">No active listings found for '{activeFilter}'. Try expanding your search queries.</p>
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
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
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
