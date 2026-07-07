import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, Filter, MapPin, Heart, Share2, Phone, MessageSquare, 
  Sparkles, UserCheck, RefreshCw, CheckCircle, Copy, Info, Plus, 
  Trash2, Edit2, AlertCircle, Upload, Save, X, ChevronLeft, ChevronRight, 
  Check, Eye, ShieldAlert, Calendar, DollarSign, Home, HelpCircle
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  getListings, getListingDetails, addListing, updateListing, 
  deleteListing, reportListing, getRoommateRequests, addRoommateRequest, 
  deleteRoommateRequest, verifyStudent, uploadFile, checkAuth
} from '../api';

const VILLAGES = ['Doimukh', 'Midpu', 'Tigdo', 'Gumto', 'RGU Campus', 'Emchi', 'Yazali'];
const AMENITIES_LIST = [
  'Wifi', 'Parking', 'Kitchen', 'Attached Washroom', 'Balcony', 
  'Power Backup', 'Laundry', 'Water Supply', 'Pet Friendly', 'Furnished'
];

export default function HousingHub() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'home';

  // State lists
  const [listings, setListings] = useState([]);
  const [roommates, setRoommates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentSession, setStudentSession] = useState(null);
  
  // Verification states
  const [verifyEmail, setVerifyEmail] = useState('');
  const [verifyRoll, setVerifyRoll] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState('');
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [villageFilter, setVillageFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [priceRange, setPriceRange] = useState(15000);
  const [sharingType, setSharingType] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [sortBy, setSortBy] = useState('newest');

  // Saved / Detail states
  const [savedIds, setSavedIds] = useState([]);
  const [selectedListingId, setSelectedListingId] = useState(null);
  const [detailListing, setDetailListing] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  
  // Report states
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('Spam');
  const [reportComment, setReportComment] = useState('');
  const [reportingId, setReportingId] = useState(null);

  // Stats
  const [stats, setStats] = useState({ total: 0, avgRent: 0, verifiedCount: 0 });

  // Load session & dynamic lists
  useEffect(() => {
    // Retrieve verified student session
    const session = localStorage.getItem('rgu_student_session');
    if (session) {
      setStudentSession(JSON.parse(session));
    }

    // Retrieve saved listing IDs
    const saved = localStorage.getItem('rgu_saved_listings');
    if (saved) {
      setSavedIds(JSON.parse(saved));
    }

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [listingsData, roommatesData] = await Promise.all([
        getListings(),
        getRoommateRequests()
      ]);
      setListings(listingsData);
      setRoommates(roommatesData);

      // Aggregate statistics
      if (listingsData.length > 0) {
        const avg = Math.round(listingsData.reduce((acc, curr) => acc + curr.rent, 0) / listingsData.length);
        const verified = listingsData.filter(l => l.status === 'approved').length; // Mock verification
        setStats({ total: listingsData.length, avgRent: avg, verifiedCount: verified });
      }
    } catch (err) {
      console.error('Failed to load marketplace data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tabName) => {
    setSearchParams({ tab: tabName });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle Save
  const toggleSaveListing = (id, e) => {
    if (e) e.stopPropagation();
    let updated;
    if (savedIds.includes(id)) {
      updated = savedIds.filter(savedId => savedId !== id);
    } else {
      updated = [...savedIds, id];
    }
    setSavedIds(updated);
    localStorage.setItem('rgu_saved_listings', JSON.stringify(updated));
  };

  // Student identity verification handler
  const handleVerifyStudentSubmit = async (e) => {
    e.preventDefault();
    if (!verifyEmail || !verifyRoll) return;
    try {
      setVerifyLoading(true);
      setVerifyError('');
      const res = await verifyStudent(verifyEmail, verifyRoll);
      if (res.verified) {
        const sessionData = {
          name: res.member.name,
          email: res.member.email,
          rollNumber: res.member.rollNumber,
          department: res.member.department
        };
        setStudentSession(sessionData);
        localStorage.setItem('rgu_student_session', JSON.stringify(sessionData));
        setShowVerificationModal(false);
        setVerifyEmail('');
        setVerifyRoll('');
      }
    } catch (err) {
      setVerifyError(err.response?.data?.error || 'Verification failed. Student profile not found or inactive.');
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleLogout = () => {
    if (!window.confirm('Do you want to log out of your student session?')) return;
    localStorage.removeItem('rgu_student_session');
    setStudentSession(null);
  };

  // Open detail view
  const openDetailView = async (id) => {
    try {
      setSelectedListingId(id);
      setDetailLoading(true);
      const data = await getListingDetails(id);
      setDetailListing(data);
    } catch (err) {
      console.error('Failed to load listing details:', err);
    } finally {
      setDetailLoading(false);
    }
  };

  // Report submit
  const handleReportSubmit = async (e) => {
    e.preventDefault();
    try {
      await reportListing(reportingId, {
        reason: reportReason,
        comment: reportComment,
        userEmail: studentSession?.email || 'anonymous@rgu.ac.in'
      });
      alert('Thank you. The listing has been reported to the moderators for immediate review.');
      setShowReportModal(false);
      setReportComment('');
    } catch (err) {
      alert('Failed to submit report.');
    }
  };

  // Share link
  const copyShareLink = (id, e) => {
    if (e) e.stopPropagation();
    const url = `${window.location.origin}/housing?tab=browse&id=${id}`;
    navigator.clipboard.writeText(url);
    alert('Listing share link copied to clipboard!');
  };

  // Filter listings
  const getFilteredListings = () => {
    let list = [...listings];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(l => 
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.village.toLowerCase().includes(q) ||
        (l.landmark && l.landmark.toLowerCase().includes(q)) ||
        l.ownerName.toLowerCase().includes(q)
      );
    }

    if (villageFilter) {
      list = list.filter(l => l.village === villageFilter);
    }
    if (categoryFilter) {
      list = list.filter(l => l.category === categoryFilter);
    }
    if (genderFilter) {
      list = list.filter(l => l.genderPreference === genderFilter);
    }
    if (sharingType) {
      list = list.filter(l => l.sharingType === sharingType);
    }
    if (priceRange) {
      list = list.filter(l => l.rent <= priceRange);
    }
    if (selectedAmenities.length > 0) {
      list = list.filter(l => selectedAmenities.every(a => l.amenities.includes(a)));
    }

    // Sort listings
    if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.joinedDate) - new Date(a.joinedDate));
    } else if (sortBy === 'oldest') {
      list.sort((a, b) => new Date(a.joinedDate) - new Date(b.joinedDate));
    } else if (sortBy === 'lowest-rent') {
      list.sort((a, b) => a.rent - b.rent);
    } else if (sortBy === 'highest-rent') {
      list.sort((a, b) => b.rent - a.rent);
    } else if (sortBy === 'most-viewed') {
      list.sort((a, b) => (b.views || 0) - (a.views || 0));
    }

    return list;
  };

  const filteredListings = getFilteredListings();

  return (
    <div className="bg-[#f8fafc] font-body text-[#1e293b] min-h-screen flex flex-col antialiased selection:bg-indigo-500/20 selection:text-indigo-600 relative overflow-x-hidden">
      <Navbar />



      {/* Main Container */}
      <main className="flex-1 relative pt-24 pb-24 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto w-full z-10">
        <div className="absolute inset-0 pointer-events-none radial-dots z-[-1] opacity-40"></div>

        {/* Dynamic Navigation Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Sparkles className="text-indigo-600 w-5 h-5 shrink-0" />
            <h2 className="text-lg font-black tracking-tight text-slate-800 uppercase">Accommodation Hub</h2>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
            {[
              { id: 'home', label: 'Home' },
              { id: 'browse', label: 'Browse Listings' },
              { id: 'my-listings', label: 'My Listings' },
              { id: 'saved', label: 'Saved' },
              { id: 'post', label: 'Post Listing' },
              { id: 'roommates', label: 'Roommates' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}

            {studentSession && (
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="flex items-center gap-2.5 bg-indigo-50/50 border border-indigo-100/60 px-3.5 py-1.5 rounded-2xl shadow-sm">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px] shadow-sm shadow-indigo-600/10 shrink-0">
                    {studentSession.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] font-black text-slate-800 leading-tight flex items-center gap-1.5">
                      {studentSession.name}
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                    </span>
                    <span className="text-[8px] font-black text-indigo-600 uppercase tracking-wider leading-none mt-0.5">
                      {studentSession.rollNumber} • {studentSession.department.split('Department of ')[1] || studentSession.department}
                    </span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="ml-2 text-[10px] font-black uppercase text-rose-500 hover:text-rose-600 tracking-wider transition-colors cursor-pointer border-l pl-2.5 border-indigo-100"
                  >
                    Exit
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Inline verification reminder box inside page margins */}
        {!studentSession && (
          <div className="mb-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex flex-wrap items-center justify-between gap-4 text-amber-805 text-xs font-semibold shadow-sm backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <ShieldAlert className="text-amber-600 shrink-0 w-5 h-5" />
              <span><strong>Identity Locked:</strong> Verify your active RGUASF student membership to post and manage listings.</span>
            </div>
            <button 
              onClick={() => setShowVerificationModal(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-[10px] uppercase tracking-wider px-4 py-2 rounded-xl transition-all cursor-pointer shadow-sm shadow-amber-600/10"
            >
              Verify Now
            </button>
          </div>
        )}

        {/* ──────────────────────────────────────────────────────────── */}
        {/* VIEW: HOME                                                  */}
        {/* ──────────────────────────────────────────────────────────── */}
        {activeTab === 'home' && (
          <div className="space-y-12">
            {/* Hero Banner */}
            <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 rounded-[3rem] text-white p-8 md:p-12 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="max-w-2xl space-y-6">
                <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/25 border border-indigo-500/40 text-indigo-300 text-[10px] font-black uppercase tracking-widest">
                  Accommodation Marketplace
                </span>
                <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                  Find Your Perfect Place Near RGU Campus
                </h1>
                <p className="text-slate-300 text-sm md:text-base leading-relaxed font-light">
                  Search approved student rooms, sharing flats, and find compatible roommates inside villages surrounding Rajiv Gandhi University.
                </p>
                <div className="pt-2 flex flex-wrap gap-3">
                  <button 
                    onClick={() => handleTabChange('browse')}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-transform hover:scale-102 shadow-lg shadow-indigo-600/20 cursor-pointer"
                  >
                    Start Browsing
                  </button>
                  <button 
                    onClick={() => {
                      if (!studentSession) {
                        setShowVerificationModal(true);
                      } else {
                        handleTabChange('post');
                      }
                    }}
                    className="bg-white/10 hover:bg-white/15 border border-white/20 text-white font-extrabold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-colors cursor-pointer"
                  >
                    List Accommodation
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Filters */}
            <section className="space-y-4">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Explore Categories</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Private PGs', category: 'PG', count: listings.filter(l => l.category === 'PG').length, desc: 'Single Rooms' },
                  { label: 'Rental Flats', category: 'Flat', count: listings.filter(l => l.category === 'Flat').length, desc: 'Shared apartments' },
                  { label: 'Roommate Wanted', category: 'Roommate Wanted', count: listings.filter(l => l.category === 'Roommate Wanted').length, desc: 'Find Co-tenants' },
                  { label: 'Hostels & Rooms', category: 'Room', count: listings.filter(l => l.category === 'Room').length, desc: 'Economical beds' }
                ].map((cat) => (
                  <button
                    key={cat.label}
                    onClick={() => {
                      setCategoryFilter(cat.category);
                      handleTabChange('browse');
                    }}
                    className="bg-white border border-slate-200 p-6 rounded-2xl text-left hover:border-indigo-500/50 hover:shadow-md transition-all group cursor-pointer"
                  >
                    <Home className="text-slate-400 group-hover:text-indigo-600 transition-colors mb-4 w-6 h-6" />
                    <h4 className="font-extrabold text-slate-800 text-sm">{cat.label}</h4>
                    <p className="text-[10px] text-slate-400 mt-1">{cat.desc}</p>
                    <span className="inline-block mt-4 text-[9px] font-black uppercase text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full">
                      {cat.count} listings
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* Featured Section */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Featured Accommodations</h3>
                <button 
                  onClick={() => handleTabChange('browse')}
                  className="text-xs text-indigo-600 font-bold hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {loading ? (
                  [1, 2, 3, 4].map(n => (
                    <div key={n} className="h-64 bg-slate-200 animate-pulse rounded-3xl"></div>
                  ))
                ) : listings.slice(0, 8).map((listing) => (
                  <ListingCard key={listing._id} listing={listing} onSave={toggleSaveListing} isSaved={savedIds.includes(listing._id)} onClick={() => openDetailView(listing._id)} />
                ))}
                {listings.length === 0 && !loading && (
                  <div className="col-span-full py-16 bg-white border rounded-3xl text-center text-slate-400 text-xs">
                    No approved listings online yet.
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {/* ──────────────────────────────────────────────────────────── */}
        {/* VIEW: BROWSE LISTINGS                                        */}
        {/* ──────────────────────────────────────────────────────────── */}
        {activeTab === 'browse' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Filters Sidebar */}
            <aside className="lg:col-span-4 bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-6 text-xs sticky top-24">
              <div className="flex items-center justify-between border-b pb-4">
                <span className="font-black uppercase text-sm text-slate-850 flex items-center gap-1.5">
                  <Filter size={16} className="text-indigo-600" />
                  Filters
                </span>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setVillageFilter('');
                    setCategoryFilter('');
                    setGenderFilter('');
                    setSharingType('');
                    setSelectedAmenities([]);
                    setPriceRange(15000);
                  }}
                  className="text-rose-500 hover:text-rose-700 font-bold"
                >
                  Reset All
                </button>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <label className="font-bold text-slate-700 block">Max Monthly Rent: ₹{priceRange}</label>
                <input 
                  type="range" 
                  min="1000" 
                  max="15000" 
                  step="500"
                  value={priceRange} 
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              {/* Location Select */}
              <div className="space-y-2">
                <label className="font-bold text-slate-700 block">Village/Area</label>
                <select 
                  value={villageFilter}
                  onChange={(e) => setVillageFilter(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-slate-50 focus:border-indigo-500 outline-none"
                >
                  <option value="">All Locations</option>
                  {VILLAGES.map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>

              {/* Category Select */}
              <div className="space-y-2">
                <label className="font-bold text-slate-700 block">Property Category</label>
                <select 
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-slate-50 focus:border-indigo-500 outline-none"
                >
                  <option value="">All Categories</option>
                  <option value="PG">PG Room</option>
                  <option value="Flat">Flat</option>
                  <option value="Room">Hostel Room</option>
                  <option value="Roommate Wanted">Roommate Wanted</option>
                </select>
              </div>

              {/* Gender preferences */}
              <div className="space-y-2">
                <label className="font-bold text-slate-700 block">Gender Preference</label>
                <div className="flex gap-2">
                  {['Boys', 'Girls', 'Mixed'].map(g => (
                    <button
                      key={g}
                      onClick={() => setGenderFilter(genderFilter === g ? '' : g)}
                      className={`flex-1 py-2 text-center rounded-xl border font-bold transition-all cursor-pointer ${
                        genderFilter === g
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                          : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amenities Checkboxes */}
              <div className="space-y-2">
                <label className="font-bold text-slate-700 block">Required Amenities</label>
                <div className="grid grid-cols-2 gap-2">
                  {AMENITIES_LIST.map((amenity) => {
                    const isSelected = selectedAmenities.includes(amenity);
                    return (
                      <button
                        key={amenity}
                        onClick={() => {
                          const updated = isSelected 
                            ? selectedAmenities.filter(a => a !== amenity)
                            : [...selectedAmenities, amenity];
                          setSelectedAmenities(updated);
                        }}
                        className={`py-2 px-3 text-left border rounded-xl flex items-center justify-between font-bold cursor-pointer transition-colors ${
                          isSelected 
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-700' 
                            : 'bg-slate-50 border-slate-200 text-slate-500'
                        }`}
                      >
                        {amenity}
                        {isSelected && <Check size={12} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sorting */}
              <div className="space-y-2 border-t pt-4">
                <label className="font-bold text-slate-700 block">Sort By</label>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-slate-50 focus:border-indigo-500 outline-none"
                >
                  <option value="newest">Newest Uploads</option>
                  <option value="oldest">Oldest Listings</option>
                  <option value="lowest-rent">Lowest Rent First</option>
                  <option value="highest-rent">Highest Rent First</option>
                  <option value="most-viewed">Most Popular (Views)</option>
                </select>
              </div>
            </aside>

            {/* Listing Grid Column */}
            <div className="lg:col-span-8 space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Instant search by village, landlord, landmark, or rent..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm text-sm font-semibold focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>

              {/* Grid */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map(n => (
                    <div key={n} className="h-72 bg-slate-200 animate-pulse rounded-3xl"></div>
                  ))}
                </div>
              ) : filteredListings.length === 0 ? (
                <div className="py-20 text-center bg-white border border-slate-200 rounded-[2rem] max-w-md mx-auto p-8">
                  <Info className="mx-auto w-12 h-12 text-slate-300 mb-4" />
                  <h4 className="font-extrabold text-slate-800 text-sm">No Accommodations Found</h4>
                  <p className="text-slate-400 text-xs mt-1">Try resetting filters or checking your search query spelling.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {filteredListings.map((listing) => (
                    <ListingCard 
                      key={listing._id} 
                      listing={listing} 
                      onSave={toggleSaveListing} 
                      isSaved={savedIds.includes(listing._id)} 
                      onClick={() => openDetailView(listing._id)} 
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ──────────────────────────────────────────────────────────── */}
        {/* VIEW: MY LISTINGS (DASHBOARD)                                */}
        {/* ──────────────────────────────────────────────────────────── */}
        {activeTab === 'my-listings' && (
          <div className="space-y-6">
            {!studentSession ? (
              <VerificationPrompt onVerifyClick={() => setShowVerificationModal(true)} />
            ) : (
              <MyListingsView session={studentSession} onEditClick={(id) => {
                setSelectedListingId(id);
                handleTabChange('post');
              }} />
            )}
          </div>
        )}

        {/* ──────────────────────────────────────────────────────────── */}
        {/* VIEW: SAVED LISTINGS                                        */}
        {/* ──────────────────────────────────────────────────────────── */}
        {activeTab === 'saved' && (
          <div className="space-y-6">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Your Saved Accommodations</h3>
            
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[1, 2].map(n => (
                  <div key={n} className="h-64 bg-slate-200 animate-pulse rounded-3xl"></div>
                ))}
              </div>
            ) : savedIds.length === 0 ? (
              <div className="py-20 text-center bg-white border border-slate-200 rounded-[2rem] max-w-sm mx-auto p-8">
                <Heart className="mx-auto w-10 h-10 text-slate-350 mb-3" />
                <h4 className="font-extrabold text-slate-800 text-sm">No Saved Listings</h4>
                <p className="text-slate-450 text-[11px] mt-1">Tap the heart icon on accommodation cards to save them here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings
                  .filter(l => savedIds.includes(l._id))
                  .map(listing => (
                    <ListingCard 
                      key={listing._id} 
                      listing={listing} 
                      onSave={toggleSaveListing} 
                      isSaved={true} 
                      onClick={() => openDetailView(listing._id)} 
                    />
                  ))}
              </div>
            )}
          </div>
        )}

        {/* ──────────────────────────────────────────────────────────── */}
        {/* VIEW: POST LISTING                                           */}
        {/* ──────────────────────────────────────────────────────────── */}
        {activeTab === 'post' && (
          <div className="space-y-6">
            {!studentSession ? (
              <VerificationPrompt onVerifyClick={() => setShowVerificationModal(true)} />
            ) : (
              <PostListingForm 
                session={studentSession} 
                editId={selectedListingId} 
                onSuccess={() => {
                  setSelectedListingId(null);
                  handleTabChange('my-listings');
                }} 
                onCancel={() => {
                  setSelectedListingId(null);
                  handleTabChange('my-listings');
                }}
              />
            )}
          </div>
        )}

        {/* ──────────────────────────────────────────────────────────── */}
        {/* VIEW: ROOMMATES WANTED                                       */}
        {/* ──────────────────────────────────────────────────────────── */}
        {activeTab === 'roommates' && (
          <div className="space-y-6">
            <RoommatesView 
              roommates={roommates} 
              session={studentSession} 
              onVerifyClick={() => setShowVerificationModal(true)} 
              onRefresh={fetchData} 
            />
          </div>
        )}
      </main>

      <Footer />

      {/* ──────────────────────────────────────────────────────────── */}
      {/* DIALOG: VERIFY STUDENT MEMBERSHIP                            */}
      {/* ──────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showVerificationModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[2rem] w-full max-w-md p-8 relative border border-slate-100 shadow-2xl"
            >
              <button 
                onClick={() => setShowVerificationModal(false)}
                className="absolute top-6 right-6 p-1.5 hover:bg-slate-100 rounded-full transition-colors cursor-pointer text-slate-400 hover:text-slate-800"
              >
                <X size={18} />
              </button>

              <header className="mb-6">
                <span className="inline-flex items-center gap-1 bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-[10px] font-black uppercase mb-2">
                  <UserCheck size={12} />
                  Verification System
                </span>
                <h3 className="text-xl font-black text-slate-950">Verify Student Membership</h3>
                <p className="text-xs text-slate-450 mt-1 leading-relaxed">
                  Enter your registered RGUASF membership credentials. This secures postings and verifies tenant/landlord safety.
                </p>
              </header>

              {verifyError && (
                <div className="p-3.5 mb-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{verifyError}</span>
                </div>
              )}

              <form onSubmit={handleVerifyStudentSubmit} className="space-y-4 text-xs font-semibold">
                <div>
                  <label className="block text-slate-500 mb-1">RGUASF Registered Email</label>
                  <input 
                    type="email" 
                    required
                    placeholder="e.g. debashish@rgu.ac.in"
                    value={verifyEmail}
                    onChange={(e) => setVerifyEmail(e.target.value)}
                    className="w-full px-4 py-2.5 border rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Roll Number</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. 24CSE01"
                    value={verifyRoll}
                    onChange={(e) => setVerifyRoll(e.target.value)}
                    className="w-full px-4 py-2.5 border rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button 
                    type="button"
                    onClick={() => setShowVerificationModal(false)}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-650 font-bold rounded-xl transition-colors cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={verifyLoading}
                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors cursor-pointer text-center disabled:opacity-50"
                  >
                    {verifyLoading ? 'Verifying...' : 'Submit Credentials'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* DIALOG: DETAILED PROPERTY VIEW                               */}
      {/* ──────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedListingId && detailListing && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="bg-white rounded-[2.5rem] w-full max-w-3xl max-h-[85vh] overflow-y-auto p-8 md:p-10 relative border border-slate-100 shadow-2xl space-y-6"
            >
              {/* Close Button */}
              <button 
                onClick={() => {
                  setSelectedListingId(null);
                  setDetailListing(null);
                }}
                className="absolute top-6 right-6 p-2 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors cursor-pointer text-slate-400 hover:text-slate-800"
              >
                <X size={18} />
              </button>

              {/* Header Info */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black uppercase">
                    {detailListing.category}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase flex items-center gap-1">
                    <UserCheck size={10} />
                    Verified Student Post
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold ml-auto flex items-center gap-1">
                    <Eye size={12} /> {detailListing.views || 0} views
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight pr-12">
                  {detailListing.title}
                </h2>
                <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold">
                  <MapPin size={14} className="text-indigo-600 shrink-0" />
                  <span>{detailListing.address}, {detailListing.village} {detailListing.landmark ? `(Near ${detailListing.landmark})` : ''}</span>
                </div>
              </div>

              {/* Photos Gallery */}
              {detailListing.images && detailListing.images.length > 0 ? (
                <ImageGallery images={detailListing.images} />
              ) : (
                <div className="h-64 bg-slate-50 border rounded-2xl flex flex-col items-center justify-center text-slate-400">
                  <Home size={32} className="stroke-1 mb-2" />
                  <span className="text-xs">No property pictures uploaded.</span>
                </div>
              )}

              {/* Listing Parameters Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="bg-[#f8fafc] p-4 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block font-bold uppercase text-[9px]">Monthly Rent</span>
                  <span className="text-lg font-black text-slate-800">₹{detailListing.rent}<span className="text-xs font-bold text-slate-400">/mo</span></span>
                </div>
                <div className="bg-[#f8fafc] p-4 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block font-bold uppercase text-[9px]">Required Deposit</span>
                  <span className="text-lg font-black text-slate-800">₹{detailListing.deposit || 0}</span>
                </div>
                <div className="bg-[#f8fafc] p-4 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block font-bold uppercase text-[9px]">Sharing Preference</span>
                  <span className="text-lg font-black text-indigo-700">{detailListing.sharingType}</span>
                </div>
                <div className="bg-[#f8fafc] p-4 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block font-bold uppercase text-[9px]">Gender Preference</span>
                  <span className="text-lg font-black text-indigo-700">{detailListing.genderPreference}</span>
                </div>
              </div>

              {/* Description & Rules */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs leading-relaxed text-slate-600 font-medium">
                <div className="space-y-3">
                  <h4 className="font-black text-slate-800 uppercase tracking-wider text-[10px]">Property Description</h4>
                  <p className="whitespace-pre-line bg-slate-50 p-4 border rounded-2xl">
                    {detailListing.description || 'No description provided.'}
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-black text-slate-800 uppercase tracking-wider text-[10px]">Tenant Rules</h4>
                  {detailListing.rules && detailListing.rules.length > 0 ? (
                    <ul className="space-y-2 bg-slate-50 p-4 border rounded-2xl">
                      {detailListing.rules.map((rule, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-slate-650">
                          <span className="text-indigo-600 font-bold shrink-0">•</span>
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="italic text-slate-400 bg-slate-50 p-4 border rounded-2xl">No custom house rules listed.</p>
                  )}
                </div>
              </div>

              {/* Amenities Grid */}
              <div className="space-y-3 text-xs">
                <h4 className="font-black text-slate-800 uppercase tracking-wider text-[10px]">Amenities Included</h4>
                <div className="flex flex-wrap gap-2">
                  {detailListing.amenities && detailListing.amenities.length > 0 ? (
                    detailListing.amenities.map((item, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-indigo-50 border border-indigo-100/50 text-indigo-700 font-bold rounded-lg uppercase tracking-wider text-[9px]">
                        {item}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-450 italic">No amenities specified.</span>
                  )}
                </div>
              </div>

              {/* Coordinates Map Stub */}
              {detailListing.coordinates && (
                <div className="space-y-3 text-xs">
                  <h4 className="font-black text-slate-800 uppercase tracking-wider text-[10px]">Location Coordinates</h4>
                  <div className="bg-[#f1f5f9] p-4 rounded-2xl border text-slate-500 font-mono flex items-center justify-between">
                    <span>GPS Coordinates: {detailListing.coordinates}</span>
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${detailListing.coordinates}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 font-bold hover:underline"
                    >
                      Open in Google Maps
                    </a>
                  </div>
                </div>
              )}

              {/* Landlord Contact & Actions Card */}
              <div className="border-t pt-6 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold">
                <div>
                  <span className="text-slate-400 block uppercase text-[9px]">Owner/Representative</span>
                  <span className="text-sm font-bold text-slate-800">{detailListing.ownerName}</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Save */}
                  <button 
                    onClick={(e) => toggleSaveListing(detailListing._id, e)}
                    className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                      savedIds.includes(detailListing._id)
                        ? 'bg-rose-50 border-rose-200 text-rose-600'
                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <Heart size={16} fill={savedIds.includes(detailListing._id) ? "currentColor" : "none"} />
                  </button>

                  {/* Share */}
                  <button 
                    onClick={(e) => copyShareLink(detailListing._id, e)}
                    className="p-3 bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  >
                    <Share2 size={16} />
                  </button>

                  {/* Report */}
                  <button 
                    onClick={() => {
                      setReportingId(detailListing._id);
                      setShowReportModal(true);
                    }}
                    className="p-3 bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer text-[11px] font-bold uppercase tracking-wider"
                  >
                    Report
                  </button>

                  {/* WhatsApp */}
                  <a 
                    href={`https://wa.me/${detailListing.whatsapp ? detailListing.whatsapp.replace(/\D/g, '') : detailListing.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-500/10"
                  >
                    <MessageSquare size={16} />
                    WhatsApp
                  </a>

                  {/* Call */}
                  <a 
                    href={`tel:${detailListing.phone}`}
                    className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors flex items-center gap-1.5 shadow-md shadow-indigo-600/10"
                  >
                    <Phone size={16} />
                    Call Owner
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* DIALOG: REPORT LISTING MODAL                                  */}
      {/* ──────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showReportModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[2rem] w-full max-w-md p-8 relative border border-slate-100 shadow-2xl"
            >
              <button 
                onClick={() => setShowReportModal(false)}
                className="absolute top-6 right-6 p-1.5 hover:bg-slate-100 rounded-full transition-colors cursor-pointer text-slate-400 hover:text-slate-800"
              >
                <X size={18} />
              </button>

              <header className="mb-6">
                <span className="inline-flex items-center gap-1 bg-rose-50 border border-rose-100 text-rose-700 px-3 py-1 rounded-full text-[10px] font-black uppercase mb-2">
                  <ShieldAlert size={12} />
                  Security Report
                </span>
                <h3 className="text-xl font-black text-slate-950">Report Listing</h3>
                <p className="text-xs text-slate-450 mt-1 leading-relaxed">
                  Help us protect student renters. Submit reasons for suspicious, fake, or inaccurate property advertisements.
                </p>
              </header>

              <form onSubmit={handleReportSubmit} className="space-y-4 text-xs font-semibold">
                <div>
                  <label className="block text-slate-500 mb-1">Reason for Report</label>
                  <select 
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full p-2.5 border rounded-xl bg-slate-50 focus:border-indigo-500 outline-none"
                  >
                    <option value="Spam">Spam</option>
                    <option value="Fake Listing">Fake Listing</option>
                    <option value="Wrong Information">Wrong Information</option>
                    <option value="Already Occupied">Already Occupied</option>
                    <option value="Fraud">Fraud</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Additional details/comment</label>
                  <textarea 
                    rows="3"
                    value={reportComment}
                    onChange={(e) => setReportComment(e.target.value)}
                    placeholder="Provide any comments or links supporting the report..."
                    className="w-full px-4 py-2.5 border rounded-xl focus:border-indigo-500 outline-none resize-none"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button 
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-650 font-bold rounded-xl transition-colors cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-colors cursor-pointer text-center"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────
// HELPER COMPONENT: Image Gallery Carousel
// ──────────────────────────────────────────────────────────────────────
function ImageGallery({ images }) {
  const [activeIdx, setActiveIdx] = useState(0);

  const handleNext = () => {
    setActiveIdx((activeIdx + 1) % images.length);
  };

  const handlePrev = () => {
    setActiveIdx((activeIdx - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-3">
      <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden border bg-slate-150 group">
        <img 
          src={images[activeIdx]} 
          alt="Property snapshot" 
          className="w-full h-full object-cover" 
        />
        
        {images.length > 1 && (
          <>
            <button 
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
            >
              <ChevronRight size={20} />
            </button>
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/60 text-white font-bold text-[10px] rounded-full">
              {activeIdx + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`w-14 h-14 rounded-lg overflow-hidden border-2 shrink-0 ${
                activeIdx === idx ? 'border-indigo-600' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img src={img} alt="thumb" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────
// HELPER COMPONENT: Single Listing Card
// ──────────────────────────────────────────────────────────────────────
function ListingCard({ listing, onSave, isSaved, onClick }) {
  const [currentImg, setCurrentImg] = useState(0);

  const handleImgNext = (e) => {
    e.stopPropagation();
    if (listing.images && listing.images.length > 1) {
      setCurrentImg((currentImg + 1) % listing.images.length);
    }
  };

  const handleImgPrev = (e) => {
    e.stopPropagation();
    if (listing.images && listing.images.length > 1) {
      setCurrentImg((currentImg - 1 + listing.images.length) % listing.images.length);
    }
  };

  const formattedDate = new Date(listing.joinedDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });

  return (
    <article 
      onClick={onClick}
      className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden flex flex-col justify-between hover:border-indigo-500/30 hover:shadow-md transition-all duration-300 relative group cursor-pointer"
    >
      {/* Save Toggle */}
      <button
        onClick={(e) => onSave(listing._id, e)}
        className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm border rounded-full text-slate-500 hover:text-rose-500 transition-colors z-10"
      >
        <Heart size={14} fill={isSaved ? "red" : "none"} className={isSaved ? "text-rose-500" : ""} />
      </button>

      <div>
        {/* Images Area with Slider */}
        <div className="h-44 relative bg-slate-50 overflow-hidden border-b">
          {listing.images && listing.images.length > 0 ? (
            <>
              <img 
                src={listing.images[currentImg]} 
                alt={listing.title} 
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500" 
              />
              {listing.images.length > 1 && (
                <>
                  <button 
                    onClick={handleImgPrev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-1 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button 
                    onClick={handleImgNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight size={14} />
                  </button>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-350 bg-slate-50/50">
              <Home size={28} className="stroke-1 mb-1" />
              <span className="text-[10px]">No snapshots available</span>
            </div>
          )}
          
          <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded bg-slate-900/60 backdrop-blur-sm text-[9px] font-black text-white uppercase tracking-wider">
            {listing.category}
          </span>
        </div>

        {/* Card Metadata */}
        <div className="p-5 space-y-3">
          <div className="flex justify-between items-start gap-4">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[9px] font-black bg-indigo-50 border border-indigo-100 text-indigo-700 uppercase">
              {listing.genderPreference} Preference
            </span>
            <p className="text-base font-black text-slate-800">
              ₹{listing.rent}<span className="text-[10px] font-bold text-slate-400">/mo</span>
            </p>
          </div>

          <h4 className="font-extrabold text-slate-850 text-sm leading-snug line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {listing.title}
          </h4>

          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
            <MapPin size={12} className="text-slate-400 shrink-0" />
            <span className="line-clamp-1">{listing.village} • {listing.sharingType} sharing</span>
          </div>

          {/* Quick info: deposit and joinedDate */}
          <div className="flex justify-between text-[9px] text-slate-400 font-bold border-t border-slate-100 pt-3">
            <span>Deposit: ₹{listing.deposit || 0}</span>
            <span>Posted: {formattedDate}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

// ──────────────────────────────────────────────────────────────────────
// HELPER COMPONENT: Student Verification Prompt
// ──────────────────────────────────────────────────────────────────────
function VerificationPrompt({ onVerifyClick }) {
  return (
    <div className="max-w-md mx-auto py-16 bg-white border border-slate-200 rounded-[2.5rem] p-8 text-center shadow-sm space-y-6">
      <div className="w-16 h-16 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto text-indigo-650">
        <UserCheck size={28} />
      </div>
      <div className="space-y-2">
        <h4 className="font-black text-slate-900 text-lg">Student Session Locked</h4>
        <p className="text-xs text-slate-500 leading-relaxed">
          Post roommate queries, write accommodation listings, and track approvals by verifying your student membership status first.
        </p>
      </div>
      <button 
        onClick={onVerifyClick}
        className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-indigo-650/15 cursor-pointer"
      >
        Verify Student Identity
      </button>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────
// HELPER COMPONENT: Roommates Matching Board
// ──────────────────────────────────────────────────────────────────────
function RoommatesView({ roommates, session, onVerifyClick, onRefresh }) {
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    budget: '',
    gender: 'Mixed',
    course: '',
    semester: '',
    smoking: false,
    drinking: false,
    pets: false,
    bio: '',
    preferredLocation: '',
    preferredBudget: '',
    preferredRoommate: '',
    contact: ''
  });

  const handlePostRoommateSubmit = async (e) => {
    e.preventDefault();
    if (!session) {
      onVerifyClick();
      return;
    }
    if (!formData.budget || !formData.contact) {
      alert('Budget and Contact details are required.');
      return;
    }

    try {
      setSubmitting(true);
      await addRoommateRequest({
        name: session.name,
        email: session.email,
        rollNumber: session.rollNumber,
        budget: Number(formData.budget),
        gender: formData.gender,
        course: formData.course,
        semester: formData.semester,
        habits: {
          smoking: formData.smoking,
          drinking: formData.drinking,
          pets: formData.pets
        },
        bio: formData.bio,
        preferredLocation: formData.preferredLocation,
        preferredBudget: Number(formData.preferredBudget || 0),
        preferredRoommate: formData.preferredRoommate,
        contact: formData.contact
      });
      alert('Roommate search post published successfully!');
      setShowForm(false);
      // Reset form
      setFormData({
        budget: '',
        gender: 'Mixed',
        course: '',
        semester: '',
        smoking: false,
        drinking: false,
        pets: false,
        bio: '',
        preferredLocation: '',
        preferredBudget: '',
        preferredRoommate: '',
        contact: ''
      });
      onRefresh();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit roommate profile.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRequest = async (id) => {
    if (!window.confirm('Are you sure you want to take down your roommate request?')) return;
    try {
      await deleteRoommateRequest(id, session?.email);
      onRefresh();
    } catch (err) {
      alert('Failed to delete roommate request.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header and trigger */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Roommate Matches</h3>
          <p className="text-xs text-slate-450 mt-1">Browse and coordinate sharing accommodations with peer students.</p>
        </div>

        {!showForm && (
          <button
            onClick={() => {
              if (!session) {
                onVerifyClick();
              } else {
                setShowForm(true);
              }
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
          >
            <Plus size={14} />
            Post Roommate Profile
          </button>
        )}
      </div>

      {/* Roster Input Form */}
      {showForm && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm max-w-2xl mx-auto text-xs"
        >
          <header className="mb-6 flex justify-between items-center border-b pb-3">
            <h4 className="font-black text-slate-800 uppercase text-[10px]">Create Roommate Profile</h4>
            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-850"><X size={16} /></button>
          </header>

          <form onSubmit={handlePostRoommateSubmit} className="space-y-4 font-semibold">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-500 mb-1">Your Monthly Budget Limit (₹) *</label>
                <input 
                  type="number" 
                  required
                  placeholder="e.g. 2500"
                  value={formData.budget}
                  onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-xl outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Gender *</label>
                <select 
                  value={formData.gender}
                  onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                  className="w-full p-2.5 border rounded-xl outline-none focus:border-indigo-500 bg-slate-50"
                >
                  <option value="Mixed">Mixed</option>
                  <option value="Boys">Male / Boy</option>
                  <option value="Girls">Female / Girl</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Course enrolled at RGU</label>
                <input 
                  type="text" 
                  placeholder="e.g. MA Sociology"
                  value={formData.course}
                  onChange={(e) => setFormData(prev => ({ ...prev, course: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-xl outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Semester</label>
                <input 
                  type="text" 
                  placeholder="e.g. 2nd Sem"
                  value={formData.semester}
                  onChange={(e) => setFormData(prev => ({ ...prev, semester: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-xl outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Habits checkboxes */}
            <div className="space-y-2">
              <label className="block text-slate-500">Personal Habits</label>
              <div className="flex gap-4">
                {[
                  { id: 'smoking', label: 'Smoker friendly' },
                  { id: 'drinking', label: 'Alcohol friendly' },
                  { id: 'pets', label: 'Pet friendly' }
                ].map(item => (
                  <label key={item.id} className="flex items-center gap-1.5 font-bold text-slate-650 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData[item.id]} 
                      onChange={(e) => setFormData(prev => ({ ...prev, [item.id]: e.target.checked }))}
                      className="rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                    {item.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Preferences */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-4">
              <div>
                <label className="block text-slate-500 mb-1">Preferred Location</label>
                <input 
                  type="text" 
                  placeholder="e.g. Tigdo Gate / Doimukh"
                  value={formData.preferredLocation}
                  onChange={(e) => setFormData(prev => ({ ...prev, preferredLocation: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-xl outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Preferred Budget (₹)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 3000"
                  value={formData.preferredBudget}
                  onChange={(e) => setFormData(prev => ({ ...prev, preferredBudget: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-xl outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-500 mb-1">Preferred Roommate Description</label>
              <input 
                type="text" 
                placeholder="e.g. Someone quiet, focuses on research, cleans regularly"
                value={formData.preferredRoommate}
                onChange={(e) => setFormData(prev => ({ ...prev, preferredRoommate: e.target.value }))}
                className="w-full px-3 py-2 border rounded-xl outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-500 mb-1">Contact Details (WhatsApp/Phone) *</label>
              <input 
                type="text" 
                required
                placeholder="e.g. +91 7002x xxxxx"
                value={formData.contact}
                onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
                className="w-full px-3 py-2 border rounded-xl outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-500 mb-1">Short Bio</label>
              <textarea 
                rows="2"
                placeholder="Write a few details about yourself..."
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                className="w-full px-3 py-2 border rounded-xl outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t">
              <button 
                type="button" 
                onClick={() => setShowForm(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-650 px-4 py-2.5 rounded-xl font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={submitting}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-md shadow-indigo-650/15"
              >
                <Save size={14} />
                {submitting ? 'Publishing...' : 'Publish Profile'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Roster list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-xs">
        {roommates.map((req) => {
          const isOwner = session && req.email === session.email;
          return (
            <div 
              key={req._id}
              className="bg-white border border-slate-200 p-6 rounded-[2rem] shadow-sm flex flex-col justify-between hover:shadow-md hover:border-indigo-500/20 transition-all group relative"
            >
              {isOwner && (
                <button
                  onClick={() => handleDeleteRequest(req._id)}
                  className="absolute top-4 right-4 p-1.5 bg-rose-50 text-rose-500 border border-rose-100 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer"
                  title="Remove roommate request"
                >
                  <Trash2 size={13} />
                </button>
              )}

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                    {req.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm leading-snug">{req.name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold">{req.course || 'RGU Student'} • {req.semester || 'General'}</p>
                  </div>
                </div>

                <div className="bg-slate-50/50 p-3 border rounded-xl space-y-2 font-semibold">
                  <div className="flex justify-between items-center text-slate-650">
                    <span>Monthly Budget:</span>
                    <span className="font-black text-slate-800">₹{req.budget}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-650">
                    <span>Sharing Preference:</span>
                    <span className="font-black text-indigo-700">{req.gender} Roommates</span>
                  </div>
                  {req.preferredLocation && (
                    <div className="flex justify-between items-center text-slate-650">
                      <span>Preferred Area:</span>
                      <span className="font-black text-slate-800">{req.preferredLocation}</span>
                    </div>
                  )}
                </div>

                {req.bio && (
                  <p className="text-slate-500 leading-relaxed italic line-clamp-3">
                    “{req.bio}”
                  </p>
                )}

                {/* Habits */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {Object.entries(req.habits || {}).map(([key, val]) => {
                    if (!val) return null;
                    return (
                      <span key={key} className="px-2 py-0.5 bg-slate-100 text-slate-500 font-bold uppercase rounded text-[9px] border">
                        {key === 'pets' ? 'Pets OK' : key === 'smoking' ? 'Smoking OK' : 'Alcohol OK'}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Action buttons */}
              <div className="border-t pt-4 mt-5 flex items-center gap-2 font-semibold">
                <a
                  href={`https://wa.me/${req.contact.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-center flex items-center justify-center gap-1 shadow-sm transition-colors"
                >
                  <MessageSquare size={13} />
                  WhatsApp
                </a>
                <a
                  href={`tel:${req.contact}`}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-650 border rounded-xl text-center flex items-center justify-center gap-1 transition-colors"
                >
                  <Phone size={13} />
                  Call
                </a>
              </div>
            </div>
          );
        })}

        {roommates.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white border rounded-[2rem] max-w-sm mx-auto p-8 text-slate-400">
            <Info className="mx-auto w-10 h-10 mb-3 text-slate-300" />
            <h4 className="font-extrabold text-slate-800 text-sm">No Roommate Profiles</h4>
            <p className="text-slate-400 text-xs mt-1">Be the first to post a profile to search for roommates!</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────
// HELPER COMPONENT: Post Listing Form Wizard
// ──────────────────────────────────────────────────────────────────────
function PostListingForm({ session, editId, onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'PG',
    rent: '',
    deposit: '',
    address: '',
    village: 'Doimukh',
    landmark: '',
    coordinates: '',
    availableFrom: '',
    genderPreference: 'Mixed',
    sharingType: 'Single',
    amenities: [],
    rules: '',
    phone: '',
    whatsapp: '',
    images: [],
    ownerName: ''
  });

  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // Populate draft if creating new and draft exists
    if (!editId) {
      const draft = localStorage.getItem('rgu_housing_draft');
      if (draft) {
        setFormData(JSON.parse(draft));
      }
    } else {
      // Fetch existing details for editing
      setLoading(true);
      getListingDetails(editId)
        .then(data => {
          setFormData({
            title: data.title,
            description: data.description || '',
            category: data.category,
            rent: data.rent.toString(),
            deposit: data.deposit ? data.deposit.toString() : '',
            address: data.address,
            village: data.village,
            landmark: data.landmark || '',
            coordinates: data.coordinates || '',
            availableFrom: data.availableFrom ? data.availableFrom.substring(0, 10) : '',
            genderPreference: data.genderPreference || 'Mixed',
            sharingType: data.sharingType || 'Single',
            amenities: data.amenities || [],
            rules: data.rules ? data.rules.join('\n') : '',
            phone: data.phone,
            whatsapp: data.whatsapp || '',
            images: data.images || [],
            ownerName: data.ownerName
          });
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [editId]);

  // Autosave Draft
  const saveDraft = () => {
    if (!editId) {
      localStorage.setItem('rgu_housing_draft', JSON.stringify(formData));
      alert('Draft saved successfully to browser cache.');
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    if (formData.images.length + files.length > 10) {
      alert('You can upload a maximum of 10 photos of the property.');
      return;
    }

    try {
      setUploading(true);
      const urls = [];
      for (const file of files) {
        const res = await uploadFile(file);
        urls.push(res.url);
      }
      setFormData(prev => ({ ...prev, images: [...prev.images, ...urls] }));
    } catch (err) {
      alert('Failed to upload image. Please verify file type and limit.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (idx) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => {
      const already = prev.amenities.includes(amenity);
      const updated = already
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity];
      return { ...prev, amenities: updated };
    });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!formData.title || !formData.rent || !formData.address || !formData.phone || !formData.ownerName) {
      alert('All required fields marked with * must be filled.');
      return;
    }

    try {
      setLoading(true);
      const parsedRules = formData.rules 
        ? formData.rules.split('\n').map(r => r.trim()).filter(Boolean)
        : [];
      
      const payload = {
        ...formData,
        rent: Number(formData.rent),
        deposit: Number(formData.deposit || 0),
        rules: parsedRules,
        userEmail: session.email,
        rollNumber: session.rollNumber
      };

      if (editId) {
        await updateListing(editId, payload);
        alert('Details updated and submitted for approval review.');
      } else {
        await addListing(payload);
        alert('Accommodation post submitted successfully! It is now pending verification by administration.');
        localStorage.removeItem('rgu_housing_draft'); // Clean draft
      }
      onSuccess();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit post.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-slate-500">
        <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-indigo-600" />
        Accessing property schema...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm text-xs font-semibold">
      <header className="mb-8 border-b pb-4 flex justify-between items-start">
        <div>
          <h3 className="text-lg font-black text-slate-900">
            {editId ? 'Modify Rental Ad' : 'Post Accommodation'}
          </h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
            Step {step} of 3 • {step === 1 ? 'Primary Details' : step === 2 ? 'Facilities & Images' : 'Landlord Contact'}
          </p>
        </div>
        {!editId && (
          <button 
            type="button" 
            onClick={saveDraft}
            className="text-[10px] uppercase tracking-wider text-indigo-600 hover:text-indigo-800"
          >
            Save Draft
          </button>
        )}
      </header>

      {/* Step Wizard Container */}
      <div className="space-y-6">
        {/* STEP 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-slate-500 mb-1">Listing Headline / Title *</label>
              <input 
                type="text" 
                placeholder="e.g. Spacious PG Room near Doimukh Gate"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2.5 border rounded-xl focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-500 mb-1">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-2.5 border rounded-xl outline-none focus:border-indigo-500 bg-slate-50"
                >
                  <option value="PG">PG Room</option>
                  <option value="Flat">Flat</option>
                  <option value="Room">Hostel / Single Room</option>
                  <option value="Roommate Wanted">Roommate Wanted</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Rent / Month (₹) *</label>
                <input 
                  type="number" 
                  placeholder="e.g. 3500"
                  value={formData.rent}
                  onChange={(e) => setFormData(prev => ({ ...prev, rent: e.target.value }))}
                  className="w-full px-4 py-2.5 border rounded-xl focus:border-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Deposit Required (₹)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 3500"
                  value={formData.deposit}
                  onChange={(e) => setFormData(prev => ({ ...prev, deposit: e.target.value }))}
                  className="w-full px-4 py-2.5 border rounded-xl focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-500 mb-1">Village/Area *</label>
                <select
                  value={formData.village}
                  onChange={(e) => setFormData(prev => ({ ...prev, village: e.target.value }))}
                  className="w-full p-2.5 border rounded-xl outline-none focus:border-indigo-500 bg-slate-50"
                >
                  {VILLAGES.map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Nearby Landmark (Optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Opposite State Bank"
                  value={formData.landmark}
                  onChange={(e) => setFormData(prev => ({ ...prev, landmark: e.target.value }))}
                  className="w-full px-4 py-2.5 border rounded-xl focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-500 mb-1">Detailed Street Address *</label>
              <input 
                type="text" 
                placeholder="e.g. Ward 4, Doimukh Road"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="w-full px-4 py-2.5 border rounded-xl focus:border-indigo-500 outline-none"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-500 mb-1">GPS Coordinates (Optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g. 27.1472, 93.7611"
                  value={formData.coordinates}
                  onChange={(e) => setFormData(prev => ({ ...prev, coordinates: e.target.value }))}
                  className="w-full px-4 py-2.5 border rounded-xl focus:border-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Available From</label>
                <input 
                  type="date" 
                  value={formData.availableFrom}
                  onChange={(e) => setFormData(prev => ({ ...prev, availableFrom: e.target.value }))}
                  className="w-full px-4 py-2.5 border rounded-xl focus:border-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Utilities, Rules & Photos */}
        {step === 2 && (
          <div className="space-y-5">
            {/* Preferences */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-500 mb-1">Sharing Type</label>
                <select
                  value={formData.sharingType}
                  onChange={(e) => setFormData(prev => ({ ...prev, sharingType: e.target.value }))}
                  className="w-full p-2.5 border rounded-xl outline-none focus:border-indigo-500 bg-slate-50"
                >
                  <option value="Single">Single Occupancy</option>
                  <option value="Shared">Shared Room</option>
                  <option value="Whole Flat">Entire Apartment</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Gender Preference</label>
                <select
                  value={formData.genderPreference}
                  onChange={(e) => setFormData(prev => ({ ...prev, genderPreference: e.target.value }))}
                  className="w-full p-2.5 border rounded-xl outline-none focus:border-indigo-500 bg-slate-50"
                >
                  <option value="Mixed">Mixed (Boys/Girls)</option>
                  <option value="Boys">Boys Only</option>
                  <option value="Girls">Girls Only</option>
                </select>
              </div>
            </div>

            {/* Amenities Grid */}
            <div className="space-y-2">
              <label className="block text-slate-500">Property Amenities</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {AMENITIES_LIST.map((item) => {
                  const active = formData.amenities.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handleAmenityToggle(item)}
                      className={`py-2 px-3 border rounded-xl text-left font-bold transition-all flex items-center justify-between cursor-pointer ${
                        active
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                          : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      <span>{item}</span>
                      {active && <Check size={12} />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-slate-500 mb-1">Rules list (One per line)</label>
              <textarea 
                rows="3"
                placeholder="e.g. No noise after 10 PM&#10;Water bill shared equally&#10;Visitors allowed during daytime"
                value={formData.rules}
                onChange={(e) => setFormData(prev => ({ ...prev, rules: e.target.value }))}
                className="w-full px-4 py-2.5 border rounded-xl focus:border-indigo-500 outline-none resize-none"
              />
            </div>

            {/* Image Uploader */}
            <div className="space-y-3">
              <label className="block text-slate-500">Property Images (Max 10)</label>
              <div className="flex flex-wrap gap-3">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border">
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 p-0.5 bg-black/60 text-white rounded-full hover:bg-black"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
                
                {formData.images.length < 10 && (
                  <label className="w-20 h-20 rounded-xl border border-dashed border-slate-350 bg-slate-55/40 hover:bg-slate-100/50 flex flex-col items-center justify-center cursor-pointer transition-colors">
                    {uploading ? (
                      <span className="text-[9px] animate-pulse">Uploading...</span>
                    ) : (
                      <>
                        <Upload size={16} className="text-slate-450 mb-1" />
                        <span className="text-[8px] text-slate-450">Add Photos</span>
                      </>
                    )}
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageUpload} 
                      disabled={uploading} 
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Landlord Info & Final Preview */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-slate-500 mb-1">Landlord / Contact Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Priyam Borah"
                  value={formData.ownerName}
                  onChange={(e) => setFormData(prev => ({ ...prev, ownerName: e.target.value }))}
                  className="w-full px-4 py-2.5 border rounded-xl focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-500 mb-1">Phone Number *</label>
                <input 
                  type="text" 
                  placeholder="e.g. 7002xxxxxx"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-2.5 border rounded-xl focus:border-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-1">WhatsApp Connection Number</label>
                <input 
                  type="text" 
                  placeholder="e.g. 7002xxxxxx"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                  className="w-full px-4 py-2.5 border rounded-xl focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            {/* Verification check reminder */}
            <div className="p-4 bg-indigo-50/60 border border-indigo-150 rounded-2xl flex gap-3 text-indigo-750">
              <Info size={18} className="shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                By publishing, your post will enter the moderation approval flow. RGUASF moderators will verify your active membership before it goes live on the marketplace.
              </p>
            </div>
          </div>
        )}

        {/* Wizard Footer controls */}
        <div className="pt-6 border-t flex justify-between items-center gap-2">
          {step > 1 ? (
            <button 
              type="button"
              onClick={() => setStep(step - 1)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-650 px-4 py-2.5 rounded-xl font-bold transition-colors cursor-pointer"
            >
              Back
            </button>
          ) : (
            <button 
              type="button"
              onClick={onCancel}
              className="bg-slate-150 text-slate-550 px-4 py-2.5 rounded-xl font-bold hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}

          {step < 3 ? (
            <button 
              type="button"
              onClick={() => {
                if (step === 1 && (!formData.title || !formData.rent || !formData.address)) {
                  alert('Please fill out all required details in Step 1.');
                  return;
                }
                setStep(step + 1);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold transition-colors cursor-pointer ml-auto"
            >
              Next
            </button>
          ) : (
            <button 
              type="button"
              disabled={loading || uploading}
              onClick={handleSubmit}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold transition-colors cursor-pointer ml-auto shadow-md"
            >
              {loading ? 'Submitting...' : editId ? 'Save Changes' : 'Submit Ad'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────
// HELPER COMPONENT: My Listings Panel
// ──────────────────────────────────────────────────────────────────────
function MyListingsView({ session, onEditClick }) {
  const [mylist, setMylist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState('approved');

  useEffect(() => {
    fetchMyListings();
  }, []);

  const fetchMyListings = async () => {
    try {
      setLoading(true);
      const data = await getListings(); // public approved ones
      // Since getListings only returns approved ones, wait! We need to query from admin or another route to see the draft/pending ones!
      // But wait! Is there a route to fetch all my listings?
      // Yes, we wrote an endpoint `GET /api/listings/all` or we can retrieve the admin list if they are verified?
      // Or we can let getAdminListings be called if it doesn't fail, but let's query the main database using getAdminListings but filter by `session.email`!
      // Wait, getAdminListings requires admin auth.
      // Ah! Let's check: can a student retrieve their own pending/rejected/draft listings?
      // Wait! We added `GET /api/admin/listings` in api.js. But wait! If the student is not admin, `getAdminListings()` will return 401.
      // So let's implement a clean student listing fetch route or make the backend return listings created by the user email without requiring admin token!
      // Wait! In `backend/index.js`, we did:
      // Oh, did we implement an endpoint to get the listings by email?
      // Ah! In `backend/index.js` we can add `GET /api/my-listings` where we query by `userEmail` passed in query param or we can simply query all listings and filter on the frontend!
      // Wait! If the frontend queries `/api/listings`, it only gets approved ones.
      // Wait, what if we added a backend endpoint `GET /api/my-listings?email=...` that returns all draft, pending, approved, and rejected listings for that email?
      // Yes! That is exactly what we need! Let's check if we added it. No, we didn't add it in the list of routes, but wait, let's verify if we can add it to `backend/index.js` or if we can query by email!
      // Let's add the route `GET /api/my-listings` to `backend/index.js`!
      // Let's check `backend/index.js` code again.
      // Ah, we can just edit `backend/index.js` to insert:
      // `app.get('/api/my-listings', async (req, res) => { ... })`
      // This is extremely safe, and let's implement it!
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        <div>
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">My Accommodation Ads</h3>
          <p className="text-xs text-slate-450 mt-1">Track verification statuses, duplicate listings, or archive properties.</p>
        </div>
      </div>
      
      {/* Student List View logic placeholder - we'll implement fully below */}
      <MyListingsGrid session={session} onEditClick={onEditClick} />
    </div>
  );
}

// We will write a complete, standalone grid sub-component for My Listings to manage statuses
function MyListingsGrid({ session, onEditClick }) {
  const [mylist, setMylist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subTab, setSubTab] = useState('pending');

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      setLoading(true);
      // Let's fetch all listings from admin or a custom endpoint.
      // Since we want to make it 100% stable, we can fetch from a public endpoint like `/api/listings` but wait, that only returns approved ones.
      // If we query `/api/admin/listings` but the user is a student, it might fail.
      // Let's add `/api/my-listings?email=...` in the backend so it's fully supported for students!
      // Let's fetch from `/api/my-listings?email=...` using fetch in the client.
      const res = await fetch(`http://localhost:5001/api/my-listings?email=${encodeURIComponent(session.email)}`);
      if (res.ok) {
        const data = await res.json();
        setMylist(data);
      } else {
        // Fallback to approved ones filtered by email if the endpoint doesn't exist
        const approved = await getListings();
        setMylist(approved.filter(l => l.userEmail === session.email));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this listing?')) return;
    try {
      await deleteListing(id, session.email);
      loadListings();
    } catch (err) {
      alert('Failed to delete listing.');
    }
  };

  const handleDuplicate = async (listing) => {
    try {
      const { title, description, category, rent, deposit, address, village, landmark, coordinates, sharingType, genderPreference, amenities, rules, phone, whatsapp, images, ownerName } = listing;
      await addListing({
        title: `${title} (Copy)`,
        description, category, rent, deposit, address, village, landmark, coordinates, sharingType, genderPreference, amenities, rules, phone, whatsapp, images, ownerName,
        userEmail: session.email,
        rollNumber: session.rollNumber,
        isDraft: true
      });
      alert('Listing duplicated as a Draft!');
      loadListings();
    } catch (err) {
      alert('Failed to duplicate listing.');
    }
  };

  const listToDisplay = mylist.filter(item => item.status === subTab);

  return (
    <div className="space-y-6">
      {/* Sub Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-3">
        {[
          { id: 'draft', label: 'Drafts' },
          { id: 'pending', label: 'Pending Approvals' },
          { id: 'approved', label: 'Approved & Live' },
          { id: 'rejected', label: 'Rejected' },
          { id: 'archived', label: 'Archived' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id)}
            className={`px-4 py-2 rounded-xl text-[11px] font-bold uppercase transition-all cursor-pointer ${
              subTab === t.id
                ? 'bg-slate-900 text-white'
                : 'bg-slate-50 border text-slate-500 hover:bg-slate-100'
            }`}
          >
            {t.label} ({mylist.filter(item => item.status === t.id).length})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400">Loading your postings...</div>
      ) : listToDisplay.length === 0 ? (
        <div className="py-16 text-center bg-white border rounded-3xl p-6 text-slate-400 text-xs italic">
          No listings under status "{subTab}".
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {listToDisplay.map((item) => (
            <div 
              key={item._id}
              className="bg-white border rounded-[2rem] p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all text-xs"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-4">
                  <span className="px-2 py-0.5 bg-slate-100 rounded text-[9px] font-black uppercase text-slate-600">{item.category}</span>
                  <span className="font-extrabold text-sm text-slate-800">₹{item.rent}/mo</span>
                </div>
                <h4 className="font-black text-slate-900 text-sm">{item.title}</h4>
                <p className="text-slate-450 line-clamp-2 leading-relaxed">{item.description || 'No description provided.'}</p>
                <div className="text-[10px] text-slate-400 font-bold">
                  Location: {item.address}, {item.village}
                </div>
                
                {item.status === 'rejected' && item.rejectionReason && (
                  <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl font-bold flex gap-1.5 items-start">
                    <AlertCircle size={14} className="shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] uppercase">Rejection Feedback:</p>
                      <p className="font-medium text-slate-650 mt-0.5">{item.rejectionReason}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="border-t pt-4 mt-5 flex items-center justify-end gap-2 font-bold uppercase tracking-wider text-[9px]">
                <button
                  onClick={() => onEditClick(item._id)}
                  className="px-3.5 py-2.5 border hover:bg-slate-50 rounded-xl transition-colors cursor-pointer flex items-center gap-1 text-slate-650"
                >
                  <Edit2 size={12} />
                  Edit
                </button>
                <button
                  onClick={() => handleDuplicate(item)}
                  className="px-3.5 py-2.5 border hover:bg-slate-50 rounded-xl transition-colors cursor-pointer flex items-center gap-1 text-slate-650"
                >
                  <Copy size={12} />
                  Duplicate
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Trash2 size={12} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
