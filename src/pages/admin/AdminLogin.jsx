import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db } from '../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { Lock, Eye, EyeOff, Shield, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { motion } from 'framer-motion';
import SECURITY_CONFIG from '../../config/securityConfig';
import { initializePersistentSession } from '../../hooks/usePersistentSession';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState('');
  const navigate = useNavigate();
  const { isAdmin } = useAdminAuth();

  useEffect(() => {
    if (isAdmin) {
      navigate('/admin');
    }
    
    // Check for logout reason
    const reason = sessionStorage.getItem(SECURITY_CONFIG.STORAGE_KEYS.LOGOUT_REASON);
    if (reason) {
      const message = SECURITY_CONFIG.LOGOUT_MESSAGES[reason] || 'You have been logged out.';
      setLogoutMessage(message);
      sessionStorage.removeItem(SECURITY_CONFIG.STORAGE_KEYS.LOGOUT_REASON);
      
      // Clear message after 10 seconds
      setTimeout(() => setLogoutMessage(''), 10000);
    }
  }, [isAdmin, navigate]);

  const isLegacyEmailAdmin = async (email) => {
    const normalizedEmail = (email || '').trim().toLowerCase();

    try {
      const mainRef = doc(db, 'admins', 'main');
      const mainSnap = await getDoc(mainRef);
      const mainEmail = mainSnap.exists() ? String(mainSnap.data().email || '').trim().toLowerCase() : '';
      if (mainEmail && mainEmail === normalizedEmail) {
        return true;
      }
    } catch (e) {
      console.error('isLegacyEmailAdmin: failed to read admins/main', e);
      // Permission denied reading admins/main
    }

    // Existing legacy document in your database from previous setup.
    try {
      const legacyRef = doc(db, 'admins', 'h423cObkVbSra5wB0HmC');
      const legacySnap = await getDoc(legacyRef);
      const legacyEmail = legacySnap.exists() ? String(legacySnap.data().email || '').trim().toLowerCase() : '';
      return legacyEmail && legacyEmail === normalizedEmail;
    } catch (e) {
      console.error('isLegacyEmailAdmin: failed to read legacy admin doc', e);
      return false;
    }
  };

  const checkAdminAccess = async (user) => {
    try {
      const adminByUidRef = doc(db, 'admins', user.uid);
      const adminByUidSnap = await getDoc(adminByUidRef);
      if (adminByUidSnap.exists()) {
        return true;
      }
    } catch (e) {
      console.error('checkAdminAccess: failed to read admins/{uid}', e);
      // If permission denied, fall through to legacy email checks which may also fail
    }

    try {
      return await isLegacyEmailAdmin(user.email);
    } catch (e) {
      console.error('checkAdminAccess: legacy email check failed', e);
      return false;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);

      const hasAdminAccess = await checkAdminAccess(credential.user);
      if (!hasAdminAccess) {
        await signOut(auth);
        setError('This account is not authorized for admin access');
        return;
      }
      
      // Initialize persistent session that survives browser close
      initializePersistentSession();
      navigate('/admin');
    } catch (err) {
      console.error('Admin login error:', err);
      const code = err?.code;
      switch (code) {
        case 'auth/invalid-email':
          setError('Invalid email address format');
          break;
        case 'auth/user-not-found':
          setError('No account found with this email');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password');
          break;
        case 'auth/too-many-requests':
          setError('Too many failed attempts. Please try again later');
          break;
        case 'auth/invalid-credential':
          setError('Invalid credentials. This email/password is not found in Firebase Authentication or the password is wrong.');
          break;
        default:
          setError(err?.message || 'Failed to login. Please check your credentials');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleLogin(e);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a192f] via-[#0f1419] to-[#0a192f] px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#17c0f8]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#1a2f4a]/40 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#17c0f8]/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#17c0f8]/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative max-w-md w-full z-10"
      >
        
        {/* Login Card */}
        <div className="bg-gradient-to-br from-[#112240] to-[#1a2f4a] backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-gray-700/50 relative overflow-hidden">
          {/* Card Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#17c0f8]/5 to-transparent rounded-3xl"></div>
          
          {/* Header */}
          <div className="text-center mb-8 relative z-10">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-gradient-to-br from-[#17c0f8] to-[#1a2f4a] rounded-2xl flex items-center justify-center mx-auto mb-6 relative shadow-lg shadow-[#17c0f8]/20"
            >
              <Shield size={32} className="text-white" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-[#17c0f8] to-[#1a2f4a] rounded-2xl"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                style={{ opacity: 0.3 }}
              />
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2"
            >
              <Sparkles size={24} className="text-[#17c0f8]" />
              My Personal Portal
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-400"
            >
              Secure access to portfolio management
            </motion.p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl text-center mb-6 flex items-center justify-center space-x-2 backdrop-blur-sm"
            >
              <AlertCircle size={18} />
              <span className="text-sm">{error}</span>
            </motion.div>
          )}

          {/* Logout Message */}
          {logoutMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#17c0f8]/10 border border-[#17c0f8]/30 text-[#17c0f8] px-4 py-3 rounded-xl text-center mb-6 flex items-center justify-center space-x-2 backdrop-blur-sm"
            >
              <Shield size={18} />
              <span className="text-sm">{logoutMessage}</span>
            </motion.div>
          )}

          {/* Login Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6 relative z-10"
            onSubmit={handleLogin}
          >
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-400">
                Email Address
              </label>
              <div className="relative group">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-3 bg-[#0a192f]/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#17c0f8] focus:border-transparent transition-all duration-300 backdrop-blur-sm group-hover:border-[#17c0f8]/30"
                  placeholder="Enter your admin email"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#17c0f8]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-400">
                Password
              </label>
              <div className="relative group">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-3 pr-12 bg-[#0a192f]/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#17c0f8] focus:border-transparent transition-all duration-300 backdrop-blur-sm group-hover:border-[#17c0f8]/30"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#17c0f8] transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#17c0f8]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading || !email || !password}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full py-3 bg-gradient-to-r from-[#17c0f8] to-[#1a2f4a] text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-[#17c0f8]/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#17c0f8] to-[#0a192f] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 flex items-center space-x-2">
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <Lock size={20} />
                    <span>Access Admin Panel</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </div>
            </motion.button>
          </motion.form>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-6"
        >
          <p className="text-gray-500 text-sm">
            © 2025 My Personal Portal. All rights reserved.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;