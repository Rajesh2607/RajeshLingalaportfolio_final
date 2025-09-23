import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import { HelmetProvider } from 'react-helmet-async';

import IntroAnimation from './components/IntroAnimation';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Certificates from './pages/Certificates';
import Projects from './pages/Projects';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import WhoIAm from './pages/WhoIAm';
import ScrollToTop from './components/ScrollToTop';
import { preloadCriticalResources } from './utils/seo';

function App() {
  const [showContent, setShowContent] = useState(false);

  // Prevent double scrollbar during initial loading and preload critical resources
  useEffect(() => {
    // Add loading class to body during intro animation
    document.body.classList.add('loading-state');
    
    // Preload critical resources for better performance
    preloadCriticalResources();
    
    return () => {
      // Remove loading class when component unmounts
      document.body.classList.remove('loading-state');
    };
  }, []);

  const handleIntroFinish = () => {
    setShowContent(true);
    // Remove loading state to restore normal scrolling
    document.body.classList.remove('loading-state');
  };

  return (
    <HelmetProvider>
      <Router>
        <div className="bg-[#0a0f24] text-white overflow-x-hidden">
          <div className="min-h-screen bg-[#0a192f]">
            <AnimatePresence>
              {!showContent && (
                <IntroAnimation onFinish={handleIntroFinish} />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showContent && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                >
                  <Routes>
                    {/* Admin Routes */}
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route
                      path="/admin/*"
                      element={
                        <AdminProtectedRoute>
                          <AdminDashboard />
                        </AdminProtectedRoute>
                      }
                    />

                    {/* Public Routes */}
                    <Route
                      path="*"
                      element={
                        <>
                          <Navbar />
                          <div className="pt-16"> 
                            <ScrollToTop />
                            <Routes>
                              <Route path="/" element={<Home />} />
                              <Route path="/certificates" element={<Certificates />} />
                              <Route path="/projects" element={<Projects />} />
                              <Route path="/blog" element={<Blog />} />
                              <Route path="/blog/:id" element={<BlogDetail />} />
                              <Route path="/whoiam" element={<WhoIAm />} />
                            </Routes>
                          </div>
                          {/* Footer */}
                          <Footer />
                        </>
                      }
                    />
                  </Routes>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        <Analytics />
      </Router>
    </HelmetProvider>
  );
}

export default App;