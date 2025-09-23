import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const IntroAnimation = ({ onFinish }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageKey, setImageKey] = useState(0);
  const [showContent, setShowContent] = useState(false);
  
  // Use public path for images
  const images = ["/images/Profile.jpg", "/images/icon.jpg"];

  useEffect(() => {
    // Show content after initial delay
    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 500);

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onFinish();
      }, 800);
    }, 4500);

    return () => {
      clearTimeout(contentTimer);
      clearTimeout(timer);
    };
  }, [onFinish]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
      setImageKey((prev) => prev + 1);
    }, 2000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          className="fixed inset-0 bg-gradient-to-br from-[#0a192f] to-[#17c0f8] flex items-center justify-center z-50 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 1} }}
          exit={{ 
            opacity: 0, 
            scale: 1.1,
            transition: { duration: 1, ease: "easeInOut" } 
          }}
        >
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-y-12"></div>
          </div>

          <div className="text-center relative z-10">
            {showContent && (
              <>
                {/* Professional Profile Image */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    transition: {
                      duration: 0.6,
                      type: "spring",
                      stiffness: 100,
                      damping: 15,
                    },
                  }}
                  className="mb-8"
                >
                  <div className="w-28 h-28 mx-auto rounded-full border-3 border-white/30 overflow-hidden relative shadow-2xl">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={imageKey}
                        src={images[currentIndex]}
                        alt="Rajesh Lingala"
                        className="w-full h-full object-cover"
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.6 }}
                        onError={(e) => {
                          console.warn(`Failed to load image: ${e.target.src}`);
                          e.target.style.display = 'none';
                        }}
                      />
                    </AnimatePresence>
                  </div>
                </motion.div>
                
                {/* Professional Typography */}

              <motion.h1
              className="text-white font-bold text-4xl md:text-5xl mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { delay: 1, duration: 0.8 },
              }}
            >
              Welcome to My Portfolio
            </motion.h1>
            
            <motion.p
              className="text-gray-200 text-xl"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { delay: 1.5, duration: 0.8 },
              }}
            >
              Rajesh Lingala
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
