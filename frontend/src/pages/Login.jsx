import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../api';
import { motion } from 'framer-motion';
import { ShieldCheck, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await loginAdmin(email, password);
      navigate('/admin/cms');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Check credentials or database connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f9ff] relative overflow-hidden font-body antialiased selection:bg-primary/20 selection:text-primary">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(#737686 0.5px, transparent 0.5px)", backgroundSize: "32px 32px" }}></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -mr-96 -mt-96"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-tertiary/5 rounded-full blur-[100px] -ml-64 -mb-64"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white/70 backdrop-blur-3xl p-12 rounded-[2.5rem] shadow-[0_32px_120px_rgba(3,85,211,0.08)] border border-white/50">
          <div className="text-center mb-12">
            <div className="inline-flex p-4 bg-primary text-white rounded-2xl shadow-xl shadow-primary/20 mb-6 scale-95 group-hover:scale-100 transition-transform">
               <ShieldCheck size={32} />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Gatekeeper</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em]">Secure Administration Portal</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-xl flex items-center gap-3"
            >
              <AlertCircle size={18} />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Identity</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all outline-none placeholder:text-slate-300"
                  placeholder="admin@asf.rgu"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Access Phrase</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-error transition-colors" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-primary/5 focus:border-error/20 transition-all outline-none placeholder:text-slate-300"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/10 hover:bg-primary transition-all hover:shadow-primary/30 flex items-center justify-center gap-3 group disabled:opacity-50"
            >
              {loading ? (
                 <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Establish Connection
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="text-center mt-12 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            © 2025 Assam Students Forum • Unit RGU
          </p>
        </div>
      </motion.div>
    </div>
  );
}
