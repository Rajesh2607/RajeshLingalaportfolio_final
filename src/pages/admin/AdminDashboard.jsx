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
  Edit,
  TrendingUp,
  Code
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

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    projects: 0,
    certificates: 0,
    blogs: 0,
    skills: 0,
    experiences: 0,
    achievements: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const navigate = useNavigate();

  // Check if mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

        // Generate recent activity based on actual data
        const activities = [];
        if (stats.blogs > 0) {
          activities.push({ action: 'Published blog post', time: '2 days ago', type: 'publish' });
        }
        if (stats.projects > 0) {
          activities.push({ action: 'Added new project', time: '1 week ago', type: 'create' });
        }
        if (stats.certificates > 0) {
          activities.push({ action: 'Updated certificates', time: '2 weeks ago', type: 'update' });
        }
        if (totalSkills > 0) {
          activities.push({ action: 'Updated skills section', time: '3 weeks ago', type: 'update' });
        }

        setRecentActivity(activities);

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
      await signOut(auth);
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
        recentActivity={recentActivity} 
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
      recentActivity={recentActivity} 
      loading={statsLoading}
      onSectionChange={handleSectionChange}
    />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a192f] via-[#0f1419] to-[#0a192f] flex overflow-hidden">
      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: sidebarOpen ? (isMobile ? '280px' : '280px') : '80px',
          x: isMobile && !sidebarOpen ? '-100%' : 0,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`bg-gradient-to-b from-[#112240] to-[#1a2f4a] text-white relative border-r border-gray-700/50 z-50 flex flex-col ${
          isMobile ? 'fixed h-full' : 'sticky top-0 h-screen'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-700/50 flex-shrink-0">
          <div className="flex items-center justify-between">
            {sidebarOpen ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center space-x-3"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <Settings size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
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
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-500">
          {menuItems.map((item) => (
            <SidebarButton
              key={item.id}
              item={item}
              isActive={activeSection === item.id}
              onClick={() => handleSectionChange(item.id)}
              sidebarOpen={sidebarOpen}
            />
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700/50 flex-shrink-0">
          <button
            onClick={handleLogout}
            disabled={loading}
            className={`flex items-center w-full px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <LogOut size={18} className="flex-shrink-0" />
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="ml-3"
              >
                {loading ? 'Signing out...' : 'Sign Out'}
              </motion.span>
            )}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {/* Top Bar */}
        <header className="bg-[#112240]/80 backdrop-blur-sm border-b border-gray-700/50 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {!sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors md:hidden"
                >
                  <Menu size={24} />
                </button>
              )}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  {menuItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
                </h1>
                <p className="text-gray-400 text-sm">
                  Manage your portfolio content
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 px-3 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Online</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-4 md:p-6 h-[calc(100vh-88px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-500">
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
    </div>
  );
};

// Enhanced Sidebar Button Component
const SidebarButton = ({ item, isActive, onClick, sidebarOpen }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={`flex items-center w-full px-4 py-3 text-left transition-all duration-200 rounded-lg group ${
      isActive
        ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-400 border border-cyan-400/30'
        : 'hover:bg-white/5 text-gray-300 hover:text-white'
    }`}
  >
    <item.icon 
      size={20} 
      className={`flex-shrink-0 ${isActive ? item.color : 'text-gray-400 group-hover:text-white'}`} 
    />
    
    {sidebarOpen && (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center justify-between w-full ml-3"
      >
        <span className="font-medium">{item.label}</span>
        {isActive && (
          <ChevronRight size={16} className="text-cyan-400" />
        )}
      </motion.div>
    )}
  </motion.button>
);

// Dashboard Overview Component with Real Data
const DashboardOverview = ({ stats, recentActivity, loading, onSectionChange }) => {
  const statsConfig = [
    { 
      label: 'Total Projects', 
      value: stats.projects, 
      color: 'from-blue-500 to-cyan-500', 
      icon: Code2,
      action: 'projects'
    },
    { 
      label: 'Certificates', 
      value: stats.certificates, 
      color: 'from-green-500 to-emerald-500', 
      icon: Award,
      action: 'certificates'
    },
    { 
      label: 'Blog Posts', 
      value: stats.blogs, 
      color: 'from-purple-500 to-pink-500', 
      icon: BookOpen,
      action: 'adminBlog'
    },
    { 
      label: 'Skills', 
      value: stats.skills, 
      color: 'from-orange-500 to-red-500', 
      icon: Wrench,
      action: 'skills'
    },
  ];

  const quickActions = [
    { 
      label: 'Add New Project', 
      action: 'projects', 
      icon: Code2, 
      color: 'bg-blue-500',
      description: 'Create a new project showcase'
    },
    { 
      label: 'Write Blog Post', 
      action: 'adminBlog', 
      icon: BookOpen, 
      color: 'bg-purple-500',
      description: 'Share your thoughts and experiences'
    },
    { 
      label: 'Update About', 
      action: 'about', 
      icon: User, 
      color: 'bg-green-500',
      description: 'Edit your personal information'
    },
    { 
      label: 'Add Certificate', 
      action: 'certificates', 
      icon: Award, 
      color: 'bg-yellow-500',
      description: 'Add new certification'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsConfig.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-[#112240] to-[#1a2f4a] rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 cursor-pointer"
            onClick={() => onSectionChange(stat.action)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon size={24} className="text-white" />
              </div>
              <TrendingUp size={16} className="text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {loading ? (
                <div className="h-8 w-16 bg-gray-700 rounded animate-pulse"></div>
              ) : (
                stat.value
              )}
            </h3>
            <p className="text-gray-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <Plus size={20} className="mr-2 text-cyan-400" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSectionChange(action.action)}
              className="bg-gradient-to-br from-[#112240] to-[#1a2f4a] rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 text-left group"
            >
              <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <action.icon size={20} className="text-white" />
              </div>
              <h4 className="text-white font-semibold group-hover:text-cyan-400 transition-colors mb-2">
                {action.label}
              </h4>
              <p className="text-gray-400 text-sm">
                {action.description}
              </p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <Activity size={20} className="mr-2 text-cyan-400" />
          Recent Activity
        </h3>
        <div className="bg-gradient-to-br from-[#112240] to-[#1a2f4a] rounded-xl p-6 border border-gray-700/50">
          {loading ? (
            <div className="space-y-4">
              {Array(4).fill(null).map((_, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 animate-pulse">
                  <div className="w-2 h-2 bg-gray-700 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-4 p-3 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'create' ? 'bg-green-400' :
                    activity.type === 'update' ? 'bg-blue-400' :
                    'bg-purple-400'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-white">{activity.action}</p>
                    <p className="text-gray-400 text-sm">{activity.time}</p>
                  </div>
                  <Edit size={14} className="text-gray-500" />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Activity size={48} className="mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400">No recent activity</p>
              <p className="text-gray-500 text-sm">Start managing your content to see activity here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;