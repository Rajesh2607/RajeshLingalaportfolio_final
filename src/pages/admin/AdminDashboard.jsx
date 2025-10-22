import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Award,
  Briefcase,
  Code2,
  LogOut,
  User,
  Wrench,
  Medal,
  Menu,
  X,
  Settings,
  Share2,
  FileText,
  ChevronRight,
  Activity,
  Plus,
  TrendingUp,
  Code,
  ArrowUp
} from 'lucide-react';

import AboutManager from './components/AboutManager';
import ExperienceManager from './components/ExperienceManager';
import CertificatesManager from './components/CertificatesManager';
import ProjectsManager from './components/ProjectsManager';
import SkillManager from './components/SkillManager';
import AdminEducationForm from './components/AdminEducationForm';
import AchievementsManager from './components/AchievementsManager';
import SocialMediaManager from './components/SocialMediaManager';
import HeroManager from './components/HeroManager';
import AdminBlogManager from './components/AdminBlogManager';
import WhoIAmIntroManager from './components/whoiamintroManager';
import WhoAboutManager from './components/WhoAboutManager';
import { usePersistentSessionCheck, clearPersistentSession } from '../../hooks/usePersistentSession';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 768);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    projects: 0,
    certificates: 0,
    blogs: 0,
    skills: 0,
    experiences: 0,
    achievements: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const navigate = useNavigate();

  // Persistent session check - validates session even after browser close
  usePersistentSessionCheck();

  // Check if mobile view
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      const contentArea = document.querySelector('.content-area');
      if (contentArea) {
        setShowScrollTop(contentArea.scrollTop > 300);
      }
    };

    const contentArea = document.querySelector('.content-area');
    if (contentArea) {
      contentArea.addEventListener('scroll', handleScroll);
      return () => contentArea.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    const contentArea = document.querySelector('.content-area');
    if (contentArea) {
      contentArea.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchDashboardStats = async () => {
      setStatsLoading(true);
      try {
        const collections = [
          'projects',
          'certificates', 
          'blogs',
          'experiences',
          'achievements'
        ];

        const stats = {};
        let totalSkills = 0;

        // Fetch counts for each collection
        for (const collectionName of collections) {
          const snapshot = await getDocs(collection(db, collectionName));
          stats[collectionName] = snapshot.size;
        }

        // Fetch skills count (sum of all skills across categories)
        const skillsSnapshot = await getDocs(collection(db, 'skills'));
        skillsSnapshot.forEach(doc => {
          const data = doc.data();
          if (data.items && Array.isArray(data.items)) {
            totalSkills += data.items.length;
          }
        });

        setDashboardStats({
          projects: stats.projects || 0,
          certificates: stats.certificates || 0,
          blogs: stats.blogs || 0,
          skills: totalSkills,
          experiences: stats.experiences || 0,
          achievements: stats.achievements || 0
        });

      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    if (activeSection === 'dashboard') {
      fetchDashboardStats();
    }
  }, [activeSection]);

  const handleLogout = async () => {
    setLoading(true);
    try {
      // Clear persistent session data
      clearPersistentSession();
      
      // Sign out from Firebase
      await signOut(auth);
      
      // Set manual logout reason
      sessionStorage.setItem('logoutReason', 'manual');
      
      navigate('/admin/login');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity, color: 'text-blue-400' },
    { id: 'about', label: 'About', icon: User, color: 'text-green-400' },
    { id: 'whoiamintro', label: 'Who I Am Intro', icon: FileText, color: 'text-teal-400' },
    { id: 'whoabout', label: 'Who I Am About', icon: Code, color: 'text-purple-400' },
    { id: 'hero', label: 'Hero Section', icon: FileText, color: 'text-purple-400' },
    { id: 'experience', label: 'Experience', icon: Briefcase, color: 'text-orange-400' },
    { id: 'education', label: 'Education', icon: BookOpen, color: 'text-indigo-400' },
    { id: 'skills', label: 'Skills', icon: Wrench, color: 'text-yellow-400' },
    { id: 'projects', label: 'Projects', icon: Code2, color: 'text-cyan-400' },
    { id: 'certificates', label: 'Certificates', icon: Award, color: 'text-emerald-400' },
    { id: 'achievements', label: 'Achievements', icon: Medal, color: 'text-pink-400' },
    { id: 'adminBlog', label: 'Blog', icon: BookOpen, color: 'text-red-400' },
    { id: 'socialMedia', label: 'Social Media', icon: Share2, color: 'text-violet-400' },
  ];

  const renderContent = () => {
    const components = {
      dashboard: <DashboardOverview 
        stats={dashboardStats} 
        loading={statsLoading}
        onSectionChange={handleSectionChange}
      />,
      about: <AboutManager />,
      whoiamintro: <WhoIAmIntroManager />,
      whoabout: <WhoAboutManager />,
      experience: <ExperienceManager />,
      certificates: <CertificatesManager />,
      projects: <ProjectsManager />,
      education: <AdminEducationForm />,
      adminBlog: <AdminBlogManager />,
      skills: <SkillManager />,
      hero: <HeroManager />,
      achievements: <AchievementsManager />,
      socialMedia: <SocialMediaManager />,
    };

    return components[activeSection] || <DashboardOverview 
      stats={dashboardStats} 
      loading={statsLoading}
      onSectionChange={handleSectionChange}
    />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a192f] via-[#0f1419] to-[#0a192f] flex overflow-hidden">
      {/* Sidebar - Full screen on mobile when open */}
      <AnimatePresence>
        {(!isMobile || sidebarOpen) && (
          <motion.aside
            initial={isMobile ? { x: '-100%' } : false}
            animate={{
              width: sidebarOpen ? (isMobile ? '100vw' : '280px') : (isMobile ? '100vw' : '80px'),
              x: 0,
            }}
            exit={isMobile ? { x: '-100%' } : {}}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={`bg-gradient-to-b from-[#112240] to-[#1a2f4a] text-white relative border-r border-gray-700/50 z-50 flex flex-col ${
              isMobile ? 'fixed h-full w-full' : 'sticky top-0 h-screen'
            }`}
          >
        {/* Header */}
        <div className={`${isMobile ? 'p-4' : 'p-6'} border-b border-gray-700/50 flex-shrink-0`}>
          <div className="flex items-center justify-between">
            {sidebarOpen ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center space-x-3"
              >
                <div className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center`}>
                  <Settings size={isMobile ? 16 : 20} className="text-white" />
                </div>
                <div>
                  <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text`}>
                    Admin Panel
                  </h2>
                  <p className="text-xs text-gray-400">Portfolio Management</p>
                </div>
              </motion.div>
            ) : (
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center mx-auto">
                <Settings size={20} className="text-white" />
              </div>
            )}
            
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`${isMobile ? 'p-3' : 'p-2'} hover:bg-white/10 rounded-lg transition-colors`}
            >
              {sidebarOpen ? <X size={isMobile ? 20 : 20} /> : <Menu size={isMobile ? 20 : 20} />}
            </button>
          </div>
        </div>

        {/* Navigation - Scrollable */}
        <nav className={`flex-1 ${isMobile ? 'p-4' : 'p-4'} ${isMobile ? 'space-y-2' : 'space-y-1'} overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-500`}>
          {menuItems.map((item) => (
            <SidebarButton
              key={item.id}
              item={item}
              isActive={activeSection === item.id}
              onClick={() => handleSectionChange(item.id)}
              sidebarOpen={sidebarOpen}
              isMobile={isMobile}
            />
          ))}
        </nav>

        {/* Footer */}
        <div className={`${isMobile ? 'p-4' : 'p-4'} border-t border-gray-700/50 flex-shrink-0`}>
          <button
            onClick={handleLogout}
            disabled={loading}
            className={`flex items-center w-full ${isMobile ? 'px-4 py-3' : 'px-4 py-3'} text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <LogOut size={isMobile ? 18 : 18} className="flex-shrink-0" />
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`${isMobile ? 'ml-3 text-base' : 'ml-3'}`}
              >
                {loading ? 'Signing out...' : 'Sign Out'}
              </motion.span>
            )}
          </button>
        </div>
      </motion.aside>
      )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {/* Top Bar */}
        <header className="bg-[#112240]/80 backdrop-blur-sm border-b border-gray-700/50 p-3 md:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 md:space-x-4">
              {(!sidebarOpen || isMobile) && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Menu size={isMobile ? 20 : 24} />
                </button>
              )}
              <div>
                <h1 className="text-lg md:text-2xl lg:text-3xl font-bold text-white truncate">
                  {menuItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
                </h1>
                <p className="text-gray-400 text-xs md:text-sm hidden sm:block">
                  Manage your portfolio content
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-2 md:p-4 lg:p-6 h-[calc(100vh-64px)] md:h-[calc(100vh-88px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-500 content-area">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto"
          >
            {renderContent()}
          </motion.div>
        </div>
      </main>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
            style={{ backdropFilter: 'blur(10px)' }}
          >
            <ArrowUp size={isMobile ? 16 : 20} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

// Enhanced Sidebar Button Component
const SidebarButton = ({ item, isActive, onClick, sidebarOpen, isMobile }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={`flex items-center w-full ${isMobile ? 'px-4 py-3' : 'px-3 md:px-4 py-2.5 md:py-3'} text-left transition-all duration-200 rounded-lg group ${
      isActive
        ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-400 border border-cyan-400/30'
        : 'hover:bg-white/5 text-gray-300 hover:text-white'
    }`}
  >
    <item.icon 
      size={isMobile ? 18 : 20} 
      className={`flex-shrink-0 ${isActive ? item.color : 'text-gray-400 group-hover:text-white'}`} 
    />
    
    {sidebarOpen && (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className={`flex items-center justify-between w-full ${isMobile ? 'ml-3' : 'ml-3'}`}
      >
        <span className={`font-medium ${isMobile ? 'text-base' : 'text-base'}`}>{item.label}</span>
        {isActive && (
          <ChevronRight size={isMobile ? 16 : 16} className="text-cyan-400" />
        )}
      </motion.div>
    )}
  </motion.button>
);

// Dashboard Overview Component - Enhanced with More Options
const DashboardOverview = ({ stats, loading, onSectionChange }) => {
  const statsConfig = [
    { 
      label: 'Total Projects', 
      value: stats.projects, 
      color: 'from-[#17c0f8] to-[#1a2f4a]', 
      bgGlow: 'bg-[#17c0f8]/10',
      icon: Code2,
      action: 'projects',
      iconColor: 'text-[#17c0f8]'
    },
    { 
      label: 'Certificates', 
      value: stats.certificates, 
      color: 'from-emerald-400 to-teal-600', 
      bgGlow: 'bg-emerald-400/10',
      icon: Award,
      action: 'certificates',
      iconColor: 'text-emerald-400'
    },
    { 
      label: 'Blog Posts', 
      value: stats.blogs, 
      color: 'from-purple-400 to-pink-500', 
      bgGlow: 'bg-purple-400/10',
      icon: BookOpen,
      action: 'adminBlog',
      iconColor: 'text-purple-400'
    },
    { 
      label: 'Skills', 
      value: stats.skills, 
      color: 'from-yellow-400 to-orange-500', 
      bgGlow: 'bg-yellow-400/10',
      icon: Wrench,
      action: 'skills',
      iconColor: 'text-yellow-400'
    },
    { 
      label: 'Experiences', 
      value: stats.experiences, 
      color: 'from-orange-400 to-red-500', 
      bgGlow: 'bg-orange-400/10',
      icon: Briefcase,
      action: 'experience',
      iconColor: 'text-orange-400'
    },
    { 
      label: 'Achievements', 
      value: stats.achievements, 
      color: 'from-pink-400 to-rose-500', 
      bgGlow: 'bg-pink-400/10',
      icon: Medal,
      action: 'achievements',
      iconColor: 'text-pink-400'
    },
  ];

  const quickActions = [
    { 
      label: 'Add New Project', 
      action: 'projects', 
      icon: Code2, 
      color: 'from-[#17c0f8] to-[#1a2f4a]',
      iconBg: 'bg-[#17c0f8]/20',
      iconColor: 'text-[#17c0f8]',
      description: 'Create a new project showcase'
    },
    { 
      label: 'Write Blog Post', 
      action: 'adminBlog', 
      icon: BookOpen, 
      color: 'from-purple-400 to-pink-500',
      iconBg: 'bg-purple-400/20',
      iconColor: 'text-purple-400',
      description: 'Share your thoughts and experiences'
    },
    { 
      label: 'Update About', 
      action: 'about', 
      icon: User, 
      color: 'from-emerald-400 to-teal-600',
      iconBg: 'bg-emerald-400/20',
      iconColor: 'text-emerald-400',
      description: 'Edit your personal information'
    },
    { 
      label: 'Add Certificate', 
      action: 'certificates', 
      icon: Award, 
      color: 'from-yellow-400 to-orange-500',
      iconBg: 'bg-yellow-400/20',
      iconColor: 'text-yellow-400',
      description: 'Add new certification'
    },
    { 
      label: 'Update Skills', 
      action: 'skills', 
      icon: Wrench, 
      color: 'from-cyan-400 to-blue-500',
      iconBg: 'bg-cyan-400/20',
      iconColor: 'text-cyan-400',
      description: 'Manage your skill set'
    },
    { 
      label: 'Add Experience', 
      action: 'experience', 
      icon: Briefcase, 
      color: 'from-orange-400 to-red-500',
      iconBg: 'bg-orange-400/20',
      iconColor: 'text-orange-400',
      description: 'Add work experience'
    },
    { 
      label: 'Update Hero Section', 
      action: 'hero', 
      icon: FileText, 
      color: 'from-indigo-400 to-purple-500',
      iconBg: 'bg-indigo-400/20',
      iconColor: 'text-indigo-400',
      description: 'Modify landing page content'
    },
    { 
      label: 'Add Achievement', 
      action: 'achievements', 
      icon: Medal, 
      color: 'from-pink-400 to-rose-500',
      iconBg: 'bg-pink-400/20',
      iconColor: 'text-pink-400',
      description: 'Showcase your achievements'
    },
  ];

  const contentSections = [
    {
      title: 'Profile Management',
      items: [
        { label: 'About Me', action: 'about', icon: User, color: 'text-emerald-400' },
        { label: 'Hero Section', action: 'hero', icon: FileText, color: 'text-indigo-400' },
        { label: 'Who I Am Intro', action: 'whoiamintro', icon: FileText, color: 'text-teal-400' },
        { label: 'Who I Am About', action: 'whoabout', icon: Code, color: 'text-purple-400' },
      ]
    },
    {
      title: 'Professional Content',
      items: [
        { label: 'Experience', action: 'experience', icon: Briefcase, color: 'text-orange-400' },
        { label: 'Education', action: 'education', icon: BookOpen, color: 'text-indigo-400' },
        { label: 'Skills', action: 'skills', icon: Wrench, color: 'text-yellow-400' },
        { label: 'Certificates', action: 'certificates', icon: Award, color: 'text-emerald-400' },
      ]
    },
    {
      title: 'Portfolio Showcase',
      items: [
        { label: 'Projects', action: 'projects', icon: Code2, color: 'text-[#17c0f8]' },
        { label: 'Achievements', action: 'achievements', icon: Medal, color: 'text-pink-400' },
        { label: 'Blog Posts', action: 'adminBlog', icon: BookOpen, color: 'text-purple-400' },
        { label: 'Social Media', action: 'socialMedia', icon: Share2, color: 'text-violet-400' },
      ]
    },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#112240] to-[#1a2f4a] rounded-2xl p-6 md:p-8 border border-[#17c0f8]/30 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#17c0f8]/5 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Welcome to My Admin Dashboard 👋
          </h2>
          <p className="text-gray-400 text-sm md:text-base">
            Manage your portfolio content efficiently from this central hub
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div>
        <h3 className="text-lg md:text-xl font-bold text-white mb-4 flex items-center">
          <Activity size={20} className="mr-2 text-[#17c0f8]" />
          Portfolio Statistics
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {statsConfig.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="relative group cursor-pointer"
              onClick={() => onSectionChange(stat.action)}
            >
              <div className="bg-gradient-to-br from-[#112240] to-[#1a2f4a] rounded-xl p-4 md:p-5 border border-gray-700/50 group-hover:border-gray-600 transition-all duration-300 relative overflow-hidden">
                {/* Background Glow Effect */}
                <div className={`absolute -top-10 -right-10 w-32 h-32 ${stat.bgGlow} rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`inline-flex p-2 bg-gradient-to-r ${stat.color} rounded-lg mb-3 shadow-lg`}>
                    <stat.icon size={20} className="text-white" />
                  </div>
                  
                  {/* Value */}
                  <div className="mb-1">
                    {loading ? (
                      <div className="h-8 w-12 bg-gray-700/50 rounded animate-pulse"></div>
                    ) : (
                      <h3 className={`text-2xl md:text-3xl font-bold ${stat.iconColor}`}>
                        {stat.value}
                      </h3>
                    )}
                  </div>
                  
                  {/* Label */}
                  <p className="text-gray-400 text-xs font-medium">
                    {stat.label}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg md:text-xl font-bold text-white flex items-center">
            <Plus size={20} className="mr-2 text-[#17c0f8]" />
            Quick Actions
          </h3>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              whileHover={{ scale: 1.03, y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSectionChange(action.action)}
              className="relative group bg-gradient-to-br from-[#112240] to-[#1a2f4a] rounded-xl p-4 md:p-5 border border-gray-700/50 hover:border-gray-600 transition-all duration-300 text-left overflow-hidden"
            >
              {/* Gradient Overlay on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-r ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              
              <div className="relative z-10">
                {/* Icon */}
                <div className={`inline-flex p-2.5 ${action.iconBg} rounded-lg mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon size={20} className={action.iconColor} />
                </div>
                
                {/* Title */}
                <h4 className={`text-white font-semibold mb-1.5 text-sm md:text-base`}>
                  {action.label}
                </h4>
                
                {/* Description */}
                <p className="text-gray-400 text-xs leading-relaxed">
                  {action.description}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Content Management Sections */}
      <div>
        <h3 className="text-lg md:text-xl font-bold text-white mb-4 flex items-center">
          <Settings size={20} className="mr-2 text-[#17c0f8]" />
          Content Management
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {contentSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + sectionIndex * 0.1 }}
              className="bg-gradient-to-br from-[#112240] to-[#1a2f4a] rounded-xl p-5 border border-gray-700/50"
            >
              <h4 className="text-white font-bold mb-4 text-base flex items-center">
                <div className="w-1.5 h-1.5 bg-[#17c0f8] rounded-full mr-2"></div>
                {section.title}
              </h4>
              <div className="space-y-2">
                {section.items.map((item, itemIndex) => (
                  <motion.button
                    key={item.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + sectionIndex * 0.1 + itemIndex * 0.05 }}
                    whileHover={{ x: 5 }}
                    onClick={() => onSectionChange(item.action)}
                    className="w-full flex items-center p-3 rounded-lg hover:bg-white/5 transition-all duration-200 group"
                  >
                    <item.icon size={18} className={`${item.color} mr-3`} />
                    <span className="text-gray-300 text-sm group-hover:text-white transition-colors">
                      {item.label}
                    </span>
                    <ChevronRight size={16} className="ml-auto text-gray-600 group-hover:text-[#17c0f8] transition-colors" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Additional Info Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-r from-[#112240]/50 to-[#1a2f4a]/50 rounded-2xl p-6 border border-gray-700/30"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-gray-400 text-sm mb-1">Portfolio Status</p>
            <p className="text-white font-semibold">All systems operational ✨</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-emerald-400 text-sm font-medium">Active</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;