import React, { useState, useEffect } from 'react';
import { 
  Github, 
  Linkedin, 
  Mail, 
  ArrowUp,
  Code2,
  Sparkles,
  Heart,
  Coffee,
  Terminal,
  Rocket,
  Globe
} from 'lucide-react';
import { FaBehance } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Check scroll position for scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    {
      name: 'GitHub',
      href: 'https://github.com/Rajesh2607',
      icon: <Github size={24} />,
      color: 'from-gray-600 to-gray-800',
      hoverColor: 'from-white to-gray-300'
    },
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/in/lingala-rajesh-03a336280',
      icon: <Linkedin size={24} />,
      color: 'from-blue-600 to-blue-800',
      hoverColor: 'from-blue-400 to-blue-600'
    },
    {
      name: 'Behance',
      href: 'https://www.behance.net/lingalarajesh',
      icon: <FaBehance size={24} />,
      color: 'from-purple-600 to-indigo-800',
      hoverColor: 'from-purple-400 to-indigo-600'
    },
    {
      name: 'Email',
      href: 'mailto:rajeshlingala26072005@gmail.com',
      icon: <Mail size={24} />,
      color: 'from-cyan-600 to-teal-800',
      hoverColor: 'from-cyan-400 to-teal-600'
    }
  ];

  const techStack = ['React', 'Firebase', 'Node.js', 'Tailwind', 'Framer Motion'];
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      className="relative bg-[#0a192f] overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 5 }}
    >
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" 
          style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, #17c0f8 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, #a855f7 0%, transparent 50%),
                            radial-gradient(circle at 40% 40%, #17c0f8 0%, transparent 50%)`,
            backgroundSize: '600px 600px',
            animation: 'pulse 6s ease-in-out infinite alternate'
          }}
        />
      </div>

      {/* Simple Floating Particles - Like Who I Am page */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut",
              }}
            />
        ))}
        {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 text-purple-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 0.5,
                ease: "easeInOut",
              }}
            />
        ))}
        
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Content */}
        <div className="mb-8">
          {/* Professional Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Professional Name */}
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 relative"
              style={{
                background: 'linear-gradient(135deg, red-500,cyan-400)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'gradientShift 3s ease infinite',
              }}
            >
              LINGALA RAJESH
            </motion.h2>

            {/* Professional Title */}
            <motion.div
              className="flex items-center justify-center gap-3 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[#17c0f8]"></div>
              <div className="flex items-center gap-2 px-4 py-2 bg-[#1a2332]/50 backdrop-blur-sm rounded-full border border-[#17c0f8]/20">
                <Code2 size={16} className="text-[#17c0f8]" />
                <span className="text-gray-300 text-sm font-medium"> CS Developer</span>
                <Sparkles size={14} className="text-purple-400" />
              </div>
              <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[#a855f7]"></div>
            </motion.div>
{/* Professional Description */}
      <motion.p
        className="text-gray-400 text-xs sm:text-sm lg:text-lg leading-relaxed max-w-xl sm:max-w-2xl mx-auto px-2 sm:px-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        "Passionate about learning and adapting new technologies to solve problems in my own way, using creativity, skills, and critical thinking."
      </motion.p>
      </motion.div>

      {/* Professional Social Links */}
      <motion.div
      className="flex justify-center items-center gap-4 sm:gap-8 mb-8"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.3 }}
      >
      {socialLinks.map((social, index) => (
        <motion.a
        key={social.name}
        href={social.href}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 + index * 0.1 }}
        whileHover={{ scale: 1.05, y: -3 }}
        whileTap={{ scale: 0.95 }}
        >
        <div className={`
          relative w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${social.color} 
          group-hover:bg-gradient-to-br group-hover:${social.hoverColor}
          flex items-center justify-center transition-all duration-500
          shadow-lg group-hover:shadow-2xl
          border border-white/10 group-hover:border-white/25
          backdrop-blur-sm
        `}>
          <span className="text-white transition-transform duration-300 group-hover:scale-110">
          {social.icon}
          </span>
          
          {/* Professional glow effect */}
          <div className={`
          absolute inset-0 rounded-xl bg-gradient-to-br ${social.hoverColor}
          opacity-0 group-hover:opacity-25 transition-opacity duration-500 blur-lg
          `} />
        </div>
        
        {/* Professional label */}
        <div className="absolute -bottom-8 sm:-bottom-10 left-1/2 transform -translate-x-1/2 
          opacity-0 group-hover:opacity-100 transition-all duration-300">
          <span className="text-xs text-gray-400 bg-[#1a2332]/80 backdrop-blur-sm 
          px-2 py-0.5 rounded-full border border-gray-600/30 whitespace-nowrap">
          {social.name}
          </span>
        </div>
        </motion.a>
      ))}
      </motion.div>


      {/* Professional Bottom Section */}
          <motion.div
            className="border-t border-gray-700/30 pt-6"
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              {/* Professional Copyright */}
              <motion.div
                className="flex items-center gap-3 text-gray-400 text-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <span>© {currentYear} Lingala Rajesh</span>
                <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                <span>All Rights Reserved</span>
              </motion.div>

              {/* Professional Status */}
              <motion.div
                className="flex items-center gap-6 text-xs text-gray-500"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Available for opportunities</span>
                </div>
                <div className="hidden sm:block w-px h-4 bg-gray-600"></div>
                <div className="flex items-center gap-2">
                  <Globe size={12} className="text-[#17c0f8]" />
                  <span>India, IST {currentTime.toLocaleTimeString('en-IN', { 
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
              </motion.div>
            </div>

           
          </motion.div>
        </div>
      </div>

      {/* Floating Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-[#17c0f8] to-[#a855f7] 
              rounded-full flex items-center justify-center shadow-lg hover:shadow-xl 
              hover:shadow-[#17c0f8]/25 transition-all duration-300 z-50 group"
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0, rotate: 180 }}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowUp size={20} className="text-white group-hover:animate-bounce" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#17c0f8] to-[#a855f7] 
              opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Enhanced CSS */}
      <style>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.3; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </motion.footer>
  );
};

export default Footer;
