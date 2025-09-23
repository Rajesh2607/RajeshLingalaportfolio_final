import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, MoreHorizontal } from 'lucide-react';
import { FaBehance } from 'react-icons/fa';
import { Typewriter } from 'react-simple-typewriter';
import { Link } from 'react-router-dom';

const HeroSection = ({ about }) => {
  const [isImageLoading, setIsImageLoading] = useState(true);

  const handleImageLoad = () => setIsImageLoading(false);
  const handleImageError = () => {
    console.warn('Failed to load profile image');
    setIsImageLoading(false);
  };

  // Ensure about object has default values to prevent errors
  const safeAbout = {
    title: [],
    profilePic: '',
    resume: '',
    ...about
  };

  return (
    <section
      id="hero"
      className="min-h-[90vh] flex items-center justify-center pt-20 sm:pt-24 md:pt-28 lg:pt-32 px-4 sm:px-6 lg:px-8 w-full"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-10 md:gap-12"
      >
        <motion.header
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 text-center md:text-left max-w-2xl"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-3 leading-snug"
          >
            <span className="relative">
              <span className="absolute -inset-1 rounded-lg bg-gradient-to-r from-purple-400/20 via-cyan-400/20 to-blue-400/20 blur-lg"></span>
              <span className="relative bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 text-transparent bg-clip-text animate-gradient bg-[length:200%_auto]">
                Hi, I'm
              </span>
            </span>
          </motion.h1>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight"
          >
            Lingala Rajesh
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-base sm:text-lg md:text-2xl font-medium text-gray-300 mb-6 h-[50px] sm:h-[60px] overflow-hidden"
          >
            I'm{' '}
            <span className="text-cyan-400">
              <Typewriter
                words={
                  Array.isArray(safeAbout.title) && safeAbout.title.length > 0
                    ? safeAbout.title
                    : ['Cloud & DevOps Engineer', 'UI/UX Designer', 'Full Stack Developer', 'Problem Solver']
                }
                loop={true}
                cursor
                cursorStyle="_"
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={1500}
              />
            </span>
          </motion.p>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start gap-4 sm:gap-6 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex items-center justify-center gap-6"
            >
              <SocialLinks />
            </motion.div>
          </div>

          <div className="relative inline-block">
            <span className="absolute -inset-1 rounded-lg bg-gradient-to-r from-purple-400/20 via-cyan-400/20 to-blue-400/20 blur-lg"></span>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={safeAbout.resume || '/resume.pdf'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-5 py-2 rounded-full shadow hover:shadow-lg transition-all duration-300 text-sm font-semibold relative z-10"
            >
              View Resume/CV
            </motion.a>
          </div>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative w-72 h-72 sm:w-96 sm:h-96 flex-shrink-0 mb-8 md:mb-0"
        >
          {isImageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-full border-4 border-[#17c0f8] shadow-lg">
              <div className="w-8 h-8 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
            </div>
          )}
          <img
            src={safeAbout.profilePic || 'https://via.placeholder.com/450'}
            alt="Profile of Lingala Rajesh"
            className={`w-full h-full object-cover rounded-full border-4 border-[#17c0f8] shadow-2xl transition-opacity duration-500 ${
              isImageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
          <div className="absolute inset-0 rounded-full shadow-[0_0_40px_rgba(23,192,248,0.3)] pointer-events-none"></div>
        </motion.div>
      </motion.div>
    </section>
  );
};

const SocialLinks = () => {
  const icons = [
    {
      href: "https://github.com/Rajesh2607",
      label: "GitHub",
      icon: <Github size={24} />
    },
    {
      href: "https://www.linkedin.com/in/lingala-rajesh-03a336280",
      label: "LinkedIn",
      icon: <Linkedin size={24} />
    },
    {
      href: "https://www.behance.net/lingalarajesh",
      label: "Behance",
      icon: <FaBehance size={24} />
    },
  ];

  return (
    <nav aria-label="Social Links" className="flex items-center space-x-4">
      {icons.map((item, index) => (
        <motion.a
          key={index}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Visit ${item.label} Profile`}
          className="text-white hover:text-[#17c0f8] transition-colors"
          initial={{ x: index % 2 === 0 ? -40 : 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
        >
          {item.icon}
        </motion.a>
      ))}

      <motion.div
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        <Link
          to="/whoiam#connect"
          aria-label="Connect with Lingala Rajesh"
          className="relative group"
        >
          <div className="flex items-center gap-2 hover:bg-[#1d3a6e] text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-md cursor-pointer">
            <MoreHorizontal size={24} />
            <span className="text-base sm:text-lg font-medium">More</span>
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max px-3 py-1 text-sm text-white bg-[#1a1a2e] rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            Go to Connect With Me
          </div>
        </Link>
      </motion.div>
    </nav>
  );
};

export default HeroSection;