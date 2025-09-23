import React from 'react';
import { motion } from 'framer-motion';

const SkeletonLoaderForWhoIAm = () => {
  return (
    <div className="bg-[#0a192f] text-white min-h-screen">
      {/* WhoIAmIntro Skeleton */}
      <div className="min-h-screen bg-[#0a192f] text-white flex items-center justify-center px-6 py-12 relative">
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(30)].map((_, i) => (
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
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl text-center z-10"
        >
          {/* Title skeleton */}
          <div className="h-12 bg-[#17c0f8]/20 rounded-lg w-64 mx-auto mb-6 animate-pulse"></div>
          
          {/* Loading animation */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="flex space-x-2">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 bg-[#17c0f8] rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
            <motion.p
              className="text-lg text-gray-400"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              Loading my story...
            </motion.p>
          </div>
        </motion.div>
      </div>

      {/* Hero Section Skeleton */}
      <section className="min-h-screen pt-20 bg-gradient-to-b from-midnight to-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-purple-600 filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-blue-600 filter blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-6xl mx-auto space-y-24">
            {/* Personal Story Skeleton */}
            <div className="animate-pulse">
              <div className="h-16 bg-gray-700 rounded w-2/3 mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-4">
                  <div className="h-4 bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-800 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-700 rounded w-4/6"></div>
                </div>
                <div className="w-full h-64 bg-gray-800 rounded-xl"></div>
              </div>
            </div>
            
            {/* Professional Story Skeleton */}
            <div className="animate-pulse">
              <div className="h-16 bg-gray-700 rounded w-2/3 mb-8 ml-auto"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="w-full h-64 bg-gray-800 rounded-xl md:order-1"></div>
                <div className="space-y-4 md:order-2">
                  <div className="h-4 bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-800 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-700 rounded w-4/6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section Skeleton */}
      <section className="py-20 bg-midnight text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col items-center mb-16 animate-pulse">
              <div className="h-12 bg-gradient-to-r from-purple-400/20 via-cyan-400/20 to-blue-400/20 rounded w-64 mb-4"></div>
              <div className="h-1 bg-gradient-to-r from-transparent via-purple-400/30 to-transparent rounded-full w-48"></div>
            </div>

            {/* UX Design, Full Stack, Data Analysis Sections */}
            {[1, 2, 3].map((item) => (
              <div key={item} className="mb-20 animate-pulse">
                <div className="flex items-center mb-8">
                  <div className="w-8 h-8 bg-cyan-400/20 rounded mr-4"></div>
                  <div className="h-8 bg-gray-700 rounded w-48"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className={item === 2 ? "md:order-2" : ""}>
                    <div className="w-full h-48 bg-gray-800 rounded-lg"></div>
                  </div>
                  <div className={`bg-navy bg-opacity-50 rounded-xl p-6 ${item === 2 ? "md:order-1" : ""}`}>
                    <div className="space-y-4">
                      <div className="h-4 bg-gray-700 rounded w-full"></div>
                      <div className="h-4 bg-gray-800 rounded w-5/6"></div>
                      <div className="h-4 bg-gray-700 rounded w-4/6"></div>
                    </div>
                    <div className="flex gap-4 mt-6">
                      {[1, 2, 3].map((icon) => (
                        <div key={icon} className="w-12 h-12 bg-gray-800 rounded"></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education Section Skeleton */}
      <section className="py-20 bg-navy text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col items-center mb-12 animate-pulse">
              <div className="h-12 bg-gradient-to-r from-purple-400/20 via-cyan-400/20 to-blue-400/20 rounded w-48 mb-4"></div>
              <div className="h-1 bg-gradient-to-r from-transparent via-purple-400/30 to-transparent rounded-full w-32"></div>
            </div>

            <div className="relative pl-8 before:content-[''] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-purple-400 before:via-cyan-400 before:to-blue-400 space-y-12">
              {[1, 2, 3].map((item) => (
                <div key={item} className="relative animate-pulse">
                  <div className="absolute left-0 w-4 h-4 bg-cyan-400 rounded-full transform -translate-x-2 mt-1.5"></div>
                  <div className="bg-midnight bg-opacity-70 rounded-xl p-6 md:p-8 shadow-xl space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="h-6 bg-gray-600 rounded w-2/3"></div>
                      <div className="h-4 bg-gray-700 rounded w-24"></div>
                    </div>
                    <div className="h-5 bg-gray-600 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-700 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section Skeleton */}
      <section className="py-20 bg-midnight text-white">
        <div className="container mx-auto px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col items-center animate-pulse">
              <div className="h-12 bg-gradient-to-r from-purple-400/20 via-cyan-400/20 to-blue-400/20 rounded w-80 mb-4"></div>
              <div className="h-1 bg-gradient-to-r from-transparent via-purple-400/30 to-transparent rounded-full w-96 mb-10"></div>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {[1, 2, 3].map((item) => (
                <div key={item} className="animate-pulse bg-navy rounded-lg p-6 md:p-8 shadow-lg border border-gray-600">
                  <div className="flex flex-col md:flex-row">
                    <div className="mb-4 md:mb-0 md:mr-6 flex items-start">
                      <div className="w-12 h-12 bg-purple-400/20 rounded-lg"></div>
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="h-5 bg-gray-600 rounded w-2/3"></div>
                      <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-700 rounded w-full"></div>
                      <div className="h-4 bg-gray-800 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Section Skeleton */}
      <section className="py-20 bg-midnight text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col items-center mb-12 animate-pulse">
              <div className="h-12 bg-gradient-to-r from-purple-400/20 via-cyan-400/20 to-blue-400/20 rounded w-72 mb-4"></div>
              <div className="h-1 bg-gradient-to-r from-transparent via-purple-400/30 to-transparent rounded-full w-96"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="animate-pulse bg-navy bg-opacity-50 rounded-xl p-6 min-h-[160px]">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-800 rounded-lg"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-800 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SkeletonLoaderForWhoIAm;
