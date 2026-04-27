import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';

const SkeletonStory = React.memo(({ reversed = false }) => (
  <div className="mb-24 animate-pulse">
    <h1 className={`text-5xl md:text-7xl font-bold mb-8 text-white ${reversed ? 'text-right' : ''}`}>
      <div className="h-10 bg-gray-700 rounded w-2/3 mx-auto" />
    </h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      {!reversed && (
        <div className="space-y-4">
          <div className="h-4 bg-gray-700 rounded w-full" />
          <div className="h-4 bg-gray-800 rounded w-5/6" />
          <div className="h-4 bg-gray-700 rounded w-4/6" />
        </div>
      )}
      <div className="w-full h-64 bg-gray-800 rounded-xl" />
      {reversed && (
        <div className="space-y-4">
          <div className="h-4 bg-gray-700 rounded w-full" />
          <div className="h-4 bg-gray-800 rounded w-5/6" />
          <div className="h-4 bg-gray-700 rounded w-4/6" />
        </div>
      )}
    </div>
  </div>
));

const Story = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStoryData = useCallback(async () => {
    try {
      // Fetch all documents from hero collection
      const heroCollection = collection(db, 'hero');
      const heroSnapshot = await getDocs(heroCollection);
      
      // Extract story IDs from documents
      const storyIds = heroSnapshot.docs.map(doc => doc.id);
      
      // Fetch all stories data
      const storyPromises = storyIds.map(id => getDoc(doc(db, 'hero', id)));
      const storySnapshots = await Promise.all(storyPromises);

      const fetchedStories = storySnapshots
        .map((snap, index) => 
          snap.exists() ? { 
            id: storyIds[index], 
            order: index,
            ...snap.data() 
          } : null
        )
        .filter(story => story !== null);

      setStories(fetchedStories);
    } catch (error) {
      console.error('Error fetching story data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStoryData();
  }, [fetchStoryData]);

  // Optimize particle generation with useMemo
  const particles = useMemo(() => 
    [...Array(80)].map((_, i) => ({ // Balanced particle count
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 5 + Math.random() * 3,
    })), []
  );

  return (
    <section className="min-h-screen pt-20 bg-gradient-to-b from-midnight to-navy relative overflow-hidden scroll-smooth">
      {/* Optimized background effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-purple-600 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-blue-600 blur-3xl"></div>
      </div>
      
      {/* Enhanced particles with smooth animations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-cyan-400/40 rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              willChange: 'transform, opacity',
            }}
            animate={{
              y: [0, -120, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Title */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-20 text-center"
          >
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-4">
              My Journey
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-cyan-400 to-purple-400 mx-auto rounded"></div>
          </motion.div>

          {loading ? (
            <>
              <SkeletonStory />
              <SkeletonStory reversed />
            </>
          ) : (
            <div className="space-y-24">
              {stories.map((story, index) => {
                const isReversed = index % 2 === 1;
                return (
                  <motion.div 
                    key={story.id}
                    initial={{ opacity: 0, y: 50 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.8, delay: 0.2 + index * 0.2 }}
                  >
                    <h2 className={`text-4xl md:text-6xl font-bold mb-8 text-white ${isReversed ? 'text-right' : ''}`}>
                      {story.title || story.id}
                    </h2>
                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${isReversed ? 'md:auto-cols-fr' : ''}`}>
                      {/* Text Content */}
                      <motion.div
                        className={`max-h-[450px] overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500 scrollbar-track-transparent transition-all duration-300 ${isReversed ? 'md:order-2' : ''}`}
                        initial={{ opacity: 0, x: isReversed ? 50 : -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 + index * 0.2 }}
                      >
                        <p className="text-lg text-gray-300 leading-relaxed">
                          {story.description}
                        </p>
                      </motion.div>

                      {/* Image Content */}
                      <motion.div 
                        className={`relative ${isReversed ? 'md:order-1' : ''}`}
                        initial={{ opacity: 0, x: isReversed ? -50 : 50 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ duration: 0.8, delay: 0.3 + index * 0.2 }}
                        whileHover={{ 
                          scale: 1.03,
                          transition: { duration: 0.3, ease: "easeOut" }
                        }}
                      >
                        <div className={`absolute ${isReversed ? '-left-4' : '-right-4'} -bottom-4 w-full h-full ${index % 2 === 0 ? 'bg-cyan-400' : 'bg-purple-400'} rounded-xl opacity-20`}></div>
                        <img 
                          src={story.imageUrl}
                          alt={story.id}
                          className="rounded-xl w-full relative z-10 transition-transform duration-300"
                          loading="lazy"
                          decoding="async"
                        />
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Story;
