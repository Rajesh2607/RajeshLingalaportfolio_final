import React from 'react';
import { motion } from 'framer-motion';
import { User, MoreHorizontal, Sparkles, Quote, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutSection = ({ about }) => (
  <section
    id="about"
    className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-[#0a192f] via-[#112240] to-[#0a192f] text-white w-full relative overflow-hidden"
  >
    {/* Background decorative elements */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl"></div>
    </div>

    {/* Floating particles */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(15)].map((_, i) => (
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
    </div>

    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
    >
      {/* Enhanced Header Section */}
      <div className="flex flex-col items-center justify-center mb-12 sm:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="flex items-center mb-6"
        >

          {/* Simple Header */}
      <div className="flex flex-col items-center justify-center mb-4 sm:mb-4">
        <div className="flex items-center">
          <User size={50} className="text-[#17c0f8] mr-3" />
        </div>
      </div>
          <div className="text-center">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-wide"
            >
              <span className="">
                Short Bio About Me
              </span>
            </motion.h2>
            
          </div>
        </motion.div>

        {/* Enhanced gradient line with animation */}
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
          viewport={{ once: true }}
          className="relative"
          style={{ maxWidth: "400px" }}
        >
          <div className="h-1 bg-gradient-to-r from-transparent via-purple-400 through-cyan-400 to-transparent rounded-full"></div>
          <div className="absolute inset-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full blur-sm opacity-60"></div>
        </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex items-center justify-center mt-3 space-x-2"
            >
              <Star size={16} className="text-yellow-400 fill-current" />
              <span className="text-gray-400 text-sm font-medium">Get to know me better</span>
              <Star size={16} className="text-yellow-400 fill-current" />
            </motion.div>
        {/* Decorative elements */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="flex items-center space-x-4 mt-6"
        >
          <Sparkles size={20} className="text-purple-400 animate-pulse" />
          <span className="text-gray-300 text-sm italic">Passionate • Creative • Dedicated</span>
          <Sparkles size={20} className="text-cyan-400 animate-pulse" />
        </motion.div>
      </div>

      {/* Enhanced Content Card */}
      <motion.article
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        viewport={{ once: true }}
        className="relative group"
      >
        {/* Background with multiple layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1b3a70] via-[#1e3a8a] to-[#1b3a70] rounded-3xl transform rotate-1 group-hover:rotate-0 transition-transform duration-500"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#1b3a70] to-[#1a2f4a] rounded-3xl"></div>
        
        {/* Animated border */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 p-[2px]">
          <div className="h-full w-full bg-gradient-to-br from-[#1b3a70] to-[#1a2f4a] rounded-3xl"></div>
        </div>

        {/* Content */}
        <div className="relative p-8 sm:p-12 md:p-16 lg:p-20">
          {/* Quote icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="absolute top-6 left-6 text-purple-400/30"
          >
            <Quote size={48} />
          </motion.div>

          {/* Main content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <p className="text-lg sm:text-xl md:text-2xl leading-relaxed text-justify font-light tracking-wide text-gray-100 mb-8 relative">
              <span className="text-2xl sm:text-3xl text-cyan-400 font-bold mr-2">"</span>
              {about.description ||
                "I'm a passionate Cloud and DevOps Engineer with a strong background in UI Design. With expertise in cloud platforms, containerization, and automation, I help organizations build and maintain scalable infrastructure while ensuring beautiful and functional user interfaces."}
              <span className="text-2xl sm:text-3xl text-cyan-400 font-bold ml-2">"</span>
            </p>

            {/* Enhanced CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
              className="flex justify-center sm:justify-start"
            >
              <Link
                to="/whoiam#"
                aria-label="See more about Lingala Rajesh"
                className="group relative inline-block"
              >
                {/* Button background with animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur-lg opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-blue-600 hover:to-cyan-500 text-white px-8 py-4 rounded-2xl shadow-xl transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-2xl">
                  <MoreHorizontal size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                  <span className="text-base sm:text-lg font-semibold">Discover My Journey</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
                </div>

                {/* Ripple effect */}
                  </Link>
            </motion.div>
          </motion.div>

          {/* Decorative corner elements */}

        </div>
</motion.article>

      {/* Bottom decorative section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        viewport={{ once: true }}
        className="flex justify-center mt-12"
      >
        <div className="flex items-center space-x-6 text-gray-400">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <span className="text-sm">Passionate</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <span className="text-sm">Innovative</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            <span className="text-sm">Dedicated</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  </section>
);

export default AboutSection;