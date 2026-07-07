import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin, checkAuth, getLoginOptions, verifyLoginPasskey } from '../api';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Fingerprint, Shield } from 'lucide-react';
import { startAuthentication } from '@simplewebauthn/browser';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [checking, setChecking] = useState(true);
  const [passkeyRegistered, setPasskeyRegistered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth()
      .then(data => {
        if (data.authenticated) {
          navigate('/admin', { replace: true });
        } else {
          setPasskeyRegistered(data.passkeyRegistered);
        }
      })
      .catch((err) => {
        console.error("Auth check failed:", err);
      })
      .finally(() => {
        setChecking(false);
      });
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await loginAdmin(email, password);
      setSuccess(true);
      setTimeout(() => {
        navigate('/admin');
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Incorrect username or password.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasskeyLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const options = await getLoginOptions();
      const assertionResponse = await startAuthentication({ optionsJSON: options });
      const verification = await verifyLoginPasskey(assertionResponse);
      
      if (verification.verified) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/admin');
        }, 1000);
      } else {
        setError('Passkey verification failed.');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Passkey verification failed or cancelled.');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f8fa]">
        <div className="w-8 h-8 border-4 border-[#0969da] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8fa] flex flex-col items-center pt-8 pb-12 px-4 font-body antialiased selection:bg-[#0969da]/20 text-[#24292f]">
      {/* Centered Logo */}
      <div className="mb-6 flex justify-center">
        <a href="/" className="hover:scale-105 transition-transform duration-250">
          <img src="/logo.png" alt="RGUASF Logo" className="w-[48px] h-[48px] rounded-lg shadow-sm border border-slate-200" />
        </a>
      </div>

      {/* Main Header */}
      <h1 className="text-2xl font-light tracking-tight text-center mb-4">
        {passkeyRegistered ? 'Verify your identity' : 'Sign in to RGU Students\' Forum'}
      </h1>

      {/* Outer Card Wrapper */}
      <div className="w-full max-w-[340px]">
        {/* Error Feedback */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-[#ffebe9] border border-[#ffc1c0] text-[#cf222e] text-sm rounded-md flex items-start gap-2.5 leading-relaxed font-sans"
          >
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Success Feedback */}
        {success && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-[#dafbe1] border border-[#aef1b9] text-[#1a7f37] text-sm rounded-md flex items-start gap-2.5 leading-relaxed font-sans"
          >
            <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
            <span>Identity verified. Access granted.</span>
          </motion.div>
        )}

        {/* GitHub-style White Card */}
        <div className="bg-white border border-[#d8dee4] p-5 rounded-md shadow-sm">
          {passkeyRegistered ? (
            <div className="space-y-4 text-center">
              <div className="flex justify-center mb-2">
                <div className="p-3 bg-[#f6f8fa] text-[#57606a] rounded-full border border-[#d8dee4]">
                  <Fingerprint size={28} className="animate-pulse text-[#0969da]" />
                </div>
              </div>
              <p className="text-xs text-[#57606a] leading-relaxed">
                Biometric security shield is active. Use your passkey (Touch ID, Face ID, or Windows Hello) to sign in.
              </p>
              
              <button 
                onClick={handlePasskeyLogin}
                disabled={loading || success}
                className="w-full bg-[#2da44e] hover:bg-[#2c974b] disabled:bg-[#94d3a2] text-white py-2 px-4 border border-[rgba(27,31,36,0.15)] rounded-md font-semibold text-sm shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                   <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    Sign in with a passkey
                    <Fingerprint size={16} />
                  </>
                )}
              </button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-normal mb-1.5 text-[#24292f]">
                  Username or email address
                </label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#f6f8fa] border border-[#d0d7de] rounded-md text-sm outline-none focus:bg-white focus:border-[#0969da] focus:ring-[3px] focus:ring-[#0969da]/20 transition-all font-sans text-[#24292f]"
                  placeholder="admin@asf.rgu"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-normal text-[#24292f]">
                    Password
                  </label>
                </div>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#f6f8fa] border border-[#d0d7de] rounded-md text-sm outline-none focus:bg-white focus:border-[#0969da] focus:ring-[3px] focus:ring-[#0969da]/20 transition-all font-sans text-[#24292f]"
                  placeholder="••••••••"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading || success}
                className="w-full bg-[#2da44e] hover:bg-[#2c974b] disabled:bg-[#94d3a2] text-white py-2 px-4 border border-[rgba(27,31,36,0.15)] rounded-md font-semibold text-sm shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                   <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer info box (GitHub styled) */}
        {!passkeyRegistered && (
          <div className="mt-4 p-4 border border-[#d8dee4] rounded-md text-center bg-[#f6f8fa]">
            <p className="text-xs text-[#57606a]">
              Passkey authentication not configured. Sign in to register biometric access.
            </p>
          </div>
        )}

        {/* Bottom Footer Links */}
        <div className="mt-8 text-center text-xs text-[#57606a] space-y-4">
          <div className="flex justify-center gap-3">
            <a href="/terms" className="hover:text-[#0969da] hover:underline">Terms</a>
            <a href="/privacy" className="hover:text-[#0969da] hover:underline">Privacy</a>
            <a href="/security" className="hover:text-[#0969da] hover:underline">Security</a>
            <a href="/contact" className="hover:text-[#0969da] hover:underline">Contact Forum</a>
          </div>
        </div>
      </div>
    </div>
  );
}
