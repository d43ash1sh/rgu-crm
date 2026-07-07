import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { addMember } from '../api';

const RGU_DEPARTMENTS = {
  "Faculty of Commerce & Management": [
    "Department of Commerce",
    "Department of Management"
  ],
  "Faculty of Environmental Sciences": [
    "Department of Geography",
    "Department of Geology"
  ],
  "Faculty of Agricultural Sciences": [
    "Department of Agricultural Economics",
    "Department of Agricultural Engineering",
    "Department of Agricultural Extension & Communication",
    "Department of Agronomy",
    "Department of Entomology",
    "Department of Genetics and Plant Breeding",
    "Department of Horticulture",
    "Department of Plant Pathology",
    "Department of Soil Science and Agricultural Chemistry"
  ],
  "Faculty of Basic Sciences": [
    "Department of Chemistry",
    "Department of Mathematics",
    "Department of Physics",
    "Department of Statistics"
  ],
  "Faculty of Communication Studies": [
    "Department of Libray and Information Science",
    "Department of Mass Communication"
  ],
  "Faculty of Education": [
    "Department of Education"
  ],
  "Faculty of Engineering and Technology": [
    "Department of Computer Science & Engineering",
    "Department of Electronics & Communication",
    "Department of Food Technology"
  ],
  "Faculty of Languages": [
    "Department of English",
    "Department of Hindi"
  ],
  "Faculty of Law": [
    "Department of Law"
  ],
  "Faculty of Life Sciences": [
    "Centre with Potential for Excellence in Biodiversity",
    "Department of Botany",
    "Department of Zoology"
  ],
  "Faculty of Physical Education and Sport Science": [
    "Department of Physical Education",
    "Department of Sports Biomechanics",
    "Department of Sports Physiology",
    "Department of Sports Psychology",
    "Department of Strength Training and Conditioning"
  ],
  "Faculty of Social Sciences": [
    "Arunachal Institute of Tribal Studies",
    "Department of Anthropology",
    "Department of Economics",
    "Department of History",
    "Department of National Security Studies",
    "Department of Political Science",
    "Department of Psychology",
    "Department of Social Work",
    "Department of Sociology",
    "Institute of Distance Education"
  ],
  "Faculty of Visual and Performing Arts": [
    "Department of Fine Arts and Music"
  ]
};

const ASSAM_DISTRICTS = [
  "Bajali", "Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Charaideo", 
  "Chirang", "Darrang", "Dhemaji", "Dhubri", "Dibrugarh", "Dima Hasao", "Goalpara", 
  "Golaghat", "Hailakandi", "Hojai", "Jorhat", "Kamrup", "Kamrup Metropolitan", 
  "Karbi Anglong", "Karimganj", "Kokrajhar", "Lakhimpur", "Majuli", "Morigaon", 
  "Nagaon", "Nalbari", "Sivasagar", "Sonitpur", "South Salmara-Mankachar", 
  "Tinsukia", "Udalguri", "West Karbi Anglong", "Tamulpur"
];

export default function Membership() {


  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'Department of Commerce',
    year: '1st Year',
    contact: '',
    rollNumber: '',
    homeDistrict: 'Bajali',
    bloodGroup: 'O+',
    gender: 'Male'
  });

  const [isManualDept, setIsManualDept] = useState(false);
  const [manualDeptVal, setManualDeptVal] = useState('');
  const [isManualDistrict, setIsManualDistrict] = useState(false);
  const [manualDistrictVal, setManualDistrictVal] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleDeptChange = (e) => {
    const val = e.target.value;
    setFormData({ ...formData, department: val });
    if (val === 'Other') {
      setIsManualDept(true);
    } else {
      setIsManualDept(false);
    }
  };

  const handleDistrictChange = (e) => {
    const val = e.target.value;
    setFormData({ ...formData, homeDistrict: val });
    if (val === 'Other') {
      setIsManualDistrict(true);
    } else {
      setIsManualDistrict(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    // Prepare final body overrides for manual input choices
    const finalPayload = { ...formData };
    if (isManualDept) {
      if (!manualDeptVal.trim()) {
        setError('Please enter your department name manually.');
        setSubmitting(false);
        return;
      }
      finalPayload.department = manualDeptVal.trim();
    }
    if (isManualDistrict) {
      if (!manualDistrictVal.trim()) {
        setError('Please enter your home district manually.');
        setSubmitting(false);
        return;
      }
      finalPayload.homeDistrict = manualDistrictVal.trim();
    }

    try {
      await addMember(finalPayload);
      setSubmitted(true);
      setFormData({ 
        name: '', 
        email: '', 
        department: 'Department of Commerce', 
        year: '1st Year', 
        contact: '',
        rollNumber: '',
        homeDistrict: 'Bajali',
        bloodGroup: 'O+',
        gender: 'Male'
      });
      setIsManualDept(false);
      setManualDeptVal('');
      setIsManualDistrict(false);
      setManualDistrictVal('');
    } catch (err) {
      console.error("Submission error:", err);
      setError('Something went wrong. Please try again or contact support.');
    } finally {
      setSubmitting(false);
    }
  };



  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary/20 selection:text-primary min-h-screen flex flex-col antialiased">
      <Navbar />

      <main className="flex-1 pt-32 pb-24 px-8 max-w-7xl mx-auto w-full relative z-10">
        <div className="absolute inset-0 pointer-events-none radial-dots z-[-1] opacity-50"></div>

        {/* Header Section */}
        <section className="mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black tracking-widest uppercase mb-4">
            Registration Portal
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 max-w-4xl text-slate-900 leading-tight">
            Membership Enrollment
          </h1>
          <p className="text-lg md:text-xl text-slate-500 font-light leading-relaxed max-w-2xl">
            Join the student community of the Assam Students' Forum. Your application will be verified and approved by the core committee.
          </p>
        </section>

        {/* Membership Application Form */}
        <section id="apply" className="mb-24">
          <div className="max-w-4xl">
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="bg-emerald-50/70 border border-emerald-100 p-12 rounded-[2.5rem] text-center backdrop-blur-md"
              >
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="material-symbols-outlined text-emerald-650 text-3xl">check_circle</span>
                </div>
                <h3 className="text-2xl font-black text-emerald-900 mb-2">Application Received!</h3>
                <p className="text-emerald-700 mb-8 max-w-md mx-auto">Thank you for applying. The forum administrators will review your details and reach out within 48 hours.</p>
                <button 
                  onClick={() => setSubmitted(false)} 
                  className="bg-white border border-slate-200 text-slate-700 px-8 py-3 rounded-2xl font-bold hover:bg-slate-50 transition-colors shadow-sm active:scale-95"
                >
                  Submit Another Form
                </button>
              </motion.div>
            ) : (
              <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_12px_40px_rgb(0,0,0,0.03)] p-8 md:p-12 rounded-[2.5rem]">
                <div className="mb-10">
                   <span className="text-primary font-label text-[10px] uppercase tracking-[0.25em] mb-2 block font-extrabold">New Memberships</span>
                   <h2 className="text-3xl font-black tracking-tight text-slate-900">Application Form</h2>
                </div>

                {error && (
                  <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-650 rounded-xl text-sm font-medium flex items-center gap-3">
                    <span className="material-symbols-outlined text-red-500">error</span>
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name field */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Full Name</label>
                    <input
                      required
                      type="text"
                      placeholder="Enter your full name"
                      className="w-full bg-slate-50/50 border border-slate-200/80 rounded-2xl px-6 py-4 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none text-slate-800 text-sm"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  {/* Email field */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Email Address</label>
                    <input
                      required
                      type="email"
                      placeholder="Enter your university email"
                      className="w-full bg-slate-50/50 border border-slate-200/80 rounded-2xl px-6 py-4 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none text-slate-800 text-sm"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  {/* Department Select Grouped by Faculties */}
                  <div className="space-y-2 relative">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Department</label>
                    <div className="relative">
                      <select
                        className="w-full bg-slate-50/50 border border-slate-200/80 rounded-2xl px-6 py-4 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none appearance-none text-slate-800 text-sm pr-10"
                        value={formData.department}
                        onChange={handleDeptChange}
                      >
                        {Object.entries(RGU_DEPARTMENTS).map(([faculty, depts]) => (
                          <optgroup label={faculty} key={faculty}>
                            {depts.map(dept => (
                              <option key={dept} value={dept}>{dept}</option>
                            ))}
                          </optgroup>
                        ))}
                        <option value="Other">Other / Add Manually</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">expand_more</span>
                    </div>
                  </div>

                  {/* Roll Number field */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Roll / Enrollment Number</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. RGU/2026/PHYS-09"
                      className="w-full bg-slate-50/50 border border-slate-200/80 rounded-2xl px-6 py-4 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none text-slate-800 text-sm"
                      value={formData.rollNumber}
                      onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                    />
                  </div>

                  {/* Manual Department field (Rendered dynamically) */}
                  {isManualDept && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-2 md:col-span-2"
                    >
                      <label className="text-xs font-bold uppercase tracking-wider text-primary ml-1">Specify Department Name</label>
                      <input
                        required
                        type="text"
                        placeholder="Enter the name of your department/centre"
                        className="w-full bg-blue-50/10 border border-blue-200 rounded-2xl px-6 py-4 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none text-slate-800 text-sm"
                        value={manualDeptVal}
                        onChange={(e) => setManualDeptVal(e.target.value)}
                      />
                    </motion.div>
                  )}

                  {/* Contact Number field */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Contact Number</label>
                    <input
                      required
                      type="tel"
                      placeholder="WhatsApp enabled number preferred"
                      className="w-full bg-slate-50/50 border border-slate-200/80 rounded-2xl px-6 py-4 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none text-slate-800 text-sm"
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    />
                  </div>

                  {/* Home District Select (Assam Districts list) */}
                  <div className="space-y-2 relative">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Home District (Assam)</label>
                    <div className="relative">
                      <select
                        className="w-full bg-slate-50/50 border border-slate-200/80 rounded-2xl px-6 py-4 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none appearance-none text-slate-800 text-sm pr-10"
                        value={formData.homeDistrict}
                        onChange={handleDistrictChange}
                      >
                        {ASSAM_DISTRICTS.map(dist => (
                          <option key={dist} value={dist}>{dist}</option>
                        ))}
                        <option value="Other">Other / Add Manually</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">expand_more</span>
                    </div>
                  </div>

                  {/* Manual District field (Rendered dynamically) */}
                  {isManualDistrict && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-2 md:col-span-2"
                    >
                      <label className="text-xs font-bold uppercase tracking-wider text-primary ml-1">Specify Home District</label>
                      <input
                        required
                        type="text"
                        placeholder="Enter the name of your home district in Assam"
                        className="w-full bg-blue-50/10 border border-blue-200 rounded-2xl px-6 py-4 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none text-slate-800 text-sm"
                        value={manualDistrictVal}
                        onChange={(e) => setManualDistrictVal(e.target.value)}
                      />
                    </motion.div>
                  )}

                  {/* Study Year dropdown */}
                  <div className="space-y-2 relative">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Year of Study</label>
                    <div className="relative">
                      <select
                        className="w-full bg-slate-50/50 border border-slate-200/80 rounded-2xl px-6 py-4 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none appearance-none text-slate-800 text-sm"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      >
                        <option>1st Year</option>
                        <option>2nd Year</option>
                        <option>3rd Year</option>
                        <option>Final Year</option>
                        <option>PG / PhD</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">expand_more</span>
                    </div>
                  </div>

                  {/* Blood Group dropdown */}
                  <div className="space-y-2 relative">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Blood Group</label>
                    <div className="relative">
                      <select
                        className="w-full bg-slate-50/50 border border-slate-200/80 rounded-2xl px-6 py-4 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none appearance-none text-slate-800 text-sm"
                        value={formData.bloodGroup}
                        onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                      >
                        <option>A+</option>
                        <option>A-</option>
                        <option>B+</option>
                        <option>B-</option>
                        <option>O+</option>
                        <option>O-</option>
                        <option>AB+</option>
                        <option>AB-</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">expand_more</span>
                    </div>
                  </div>

                  {/* Gender dropdown */}
                  <div className="space-y-2 relative md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Gender</label>
                    <div className="relative">
                      <select
                        className="w-full bg-slate-50/50 border border-slate-200/80 rounded-2xl px-6 py-4 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none appearance-none text-slate-800 text-sm"
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      >
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">expand_more</span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="md:col-span-2 pt-4">
                    <button
                      disabled={submitting}
                      type="submit"
                      className="w-full bg-primary text-white py-5 rounded-2xl font-bold text-base shadow-xl shadow-primary/25 hover:bg-blue-650 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 cursor-pointer"
                    >
                      {submitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/35 border-t-white rounded-full animate-spin"></div>
                          Processing Application...
                        </>
                      ) : 'Submit Membership Application'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
