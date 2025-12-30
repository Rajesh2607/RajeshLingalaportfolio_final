import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const IntroAnimation = ({ onFinish }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageKey, setImageKey] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Use public path for images
  const images = ["/images/Profile.jpg", "/images/icon.jpg"];

  useEffect(() => {
    // Show content after initial delay
    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 300);

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 30;
        return Math.min(newProgress, 95);
      });
    }, 200);

    const timer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          onFinish();
        }, 600);
      }, 300);
    }, 4200);

    return () => {
      clearTimeout(contentTimer);
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [onFinish]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
      setImageKey((prev) => prev + 1);
    }, 2200);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          className="fixed inset-0 bg-gradient-to-br from-[#06055e] via-[#044492] to-[#17c0f8] flex items-center justify-center z-50 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.8 } }}
          exit={{ 
            opacity: 0, 
            scale: 1.05,
            transition: { duration: 0.8, ease: "easeInOut" } 
          }}
        >
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-y-12"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
          </div>

          {/* Floating orbs background */}
          <motion.div
            className="absolute top-20 left-10 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl"
            animate={{ y: [0, 30, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-40 h-40 bg-cyan-400/10 rounded-full blur-3xl"
            animate={{ y: [30, 0, 30] }}
            transition={{ duration: 4.5, repeat: Infinity }}
          />

          <div className="text-center relative z-10">
            {showContent && (
              <>
                {/* Professional Profile Image with enhanced effects */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    transition: {
                      duration: 0.8,
                      type: "spring",
                      stiffness: 80,
                      damping: 12,
                    },
                  }}
                  className="mb-8"
                >
                  <div className="w-32 h-32 mx-auto rounded-full border-4 border-blue-500 overflow-hidden relative shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full z-10" />
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={imageKey}
                        src={images[currentIndex]}
                        alt="Rajesh Lingala"
                        className="w-full h-full object-cover"
                        initial={{ opacity: 0, scale: 1.2 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.5 }}
                        onError={(e) => {
                          console.warn(`Failed to load image: ${e.target.src}`);
                          e.target.style.display = 'none';
                        }}
                      />
                    </AnimatePresence>
                  </div>
                </motion.div>
                
                {/* Main heading with refined animation */}
                <motion.h1
                  className="text-white font-bold text-5xl md:text-6xl mb-2 bg-gradient-to-r from-white via-blue-200 to-cyan-300 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: 0.6, duration: 0.8, ease: "easeOut" },
                  }}
                >
                <span className="italic font-cursive" style={{ WebkitTextStroke: '1px whilte', color: '#00ffff', textShadow: '0 0 20px rgba(0, 255, 255, 0.4)' }}>Rajesh</span>
                <span className='italic font-cursive' style={{ WebkitTextStroke: '1px whilte', color: '#ff1744', textShadow: '0 0 20px rgba(255, 23, 68, 0.4)' }}> Lingala</span>
                </motion.h1>
                
                {/* Subtitle */}
                <motion.p
                  className="text-red-300 text-lg font-medium tracking-widest mb-8"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: 1.0, duration: 0.8, ease: "easeOut" },
                  }}
                >
                  Full Stack Developer
                </motion.p>

                {/* Tagline */}
                <motion.p
                  className="text-gray-300 text-base max-w-md mx-auto mb-10"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: { delay: 1.4, duration: 0.8 },
                  }}
                >
                  Beyond projects and outcomes.
                  A reflection of how I think and build.
                  Designed with patience.
                Delivered with purpose.
                </motion.p>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroAnimation;
