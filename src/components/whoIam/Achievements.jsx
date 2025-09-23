import React, { useEffect, useState } from 'react';
import { Award, Bookmark, Medal, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { db } from '../../firebase/config'; 
import { collection, getDocs } from 'firebase/firestore';
import 'react-loading-skeleton/dist/skeleton.css';

const iconMapping = {
  Trophy,
  Medal,
  Bookmark,
  Award,
};

const Achievements = () => {
  const [achievementData, setAchievementData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'achievements'));
        const data = querySnapshot.docs.map((doc) => doc.data());
        setAchievementData(data);
      } catch (error) {
        console.error('Error fetching achievements data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  if (loading) {
    return (
      <section id="achievements" className="py-20 bg-midnight text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 text-transparent bg-clip-text">
                Activities & Achievements
              </span>
            </h2>

            <div className="grid grid-cols-1 gap-8">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse bg-navy rounded-lg p-6 md:p-8 shadow-lg border border-gray-600"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="mb-4 md:mb-0 md:mr-6 flex items-start">
                      <div className="w-12 h-12 bg-purple-400 bg-opacity-20 rounded-lg" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-gray-600 rounded w-1/2" />
                      <div className="h-3 bg-gray-700 rounded w-1/3" />
                      <div className="h-3 bg-gray-700 rounded w-full" />
                      <div className="h-3 bg-gray-800 rounded w-5/6" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="achievements" className="py-20 bg-midnight text-white">
      <div className="container mx-auto px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center">
              <h2 className="text-3xl md:text-4xl font-bold text-center">
                <span className="bg-gradient-to-r p-5 from-purple-400 via-cyan-400 to-blue-400 text-transparent bg-clip-text">
                  Activities & Achievements
                </span>
              </h2>

              {/* Gradient line below */}
              <>
              <br />
              </>
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
                          </div>
            <div className='p-10'></div>

          <div className="grid grid-cols-1 gap-8">
            {achievementData.map((achievement, index) => {
              const Icon = iconMapping[achievement.icon] || Trophy;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 * index }}
                >
                 <div className="relative bg-navy rounded-lg p-6 md:p-8 shadow-lg border border-gray-600 hover:border-cyan-400 transition-colors duration-300
  before:absolute before:top-0 before:bottom-0 before:left-0 before:w-1 before:bg-gradient-to-b before:from-purple-400 before:to-cyan-400 before:rounded-full
  after:absolute after:top-0 after:bottom-0 after:right-0 after:w-1 after:bg-gradient-to-b after:from-purple-400 after:to-cyan-400 after:rounded-full
">
                    <div className="flex flex-col md:flex-row items-start">
                      <div className="mb-4 md:mb-0 md:mr-6 flex items-start">
                        <div className="p-3 bg-purple-400 bg-opacity-20 rounded-lg">
                          <Icon className="text-purple-400" size={28} />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-2">
                          <h3 className="text-xl font-semibold">{achievement.title}</h3>
                          <span className="text-sm text-cyan-400 mt-1 md:mt-0">{achievement.year}</span>
                        </div>
                        <p className="text-gray-300 mb-2">{achievement.organization}</p>
                        <p className="text-gray-400">{achievement.description}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Achievements;

