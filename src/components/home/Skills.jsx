import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Code2,
  Server,
  Cpu,
  Settings,
  GitBranch,
  FileCode,
  Package,
  Terminal,
} from 'lucide-react';
import { db } from '../../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

// Use a known-safe icon per category name
const categoryIconMap = {
  frontend: Cpu,
  backend: Server,
  devops: Settings,
  tools: Package,
  versioncontrol: GitBranch,
  programming: FileCode,
  scripting: Terminal,
};

// Return an icon component based on category name
const getCategoryIcon = (category) => {
  const key = category.toLowerCase();
  for (const name in categoryIconMap) {
    if (key.includes(name)) {
      return categoryIconMap[name];
    }
  }
  return Code2; // Fallback icon
};

const Skills = () => {
  const [skillsData, setSkillsData] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchSkills = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'skills'));
      const skills = {};

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (Array.isArray(data.items)) {
          skills[doc.id] = data.items;
        }
      });

      setSkillsData(skills);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching skills:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="py-16 sm:py-20 bg-[#0a192f] w-full overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col items-center justify-center mb-8 sm:mb-12">
          <div className="flex items-center">
            <Code2 size={24} className="text-[#17c0f8] mr-3" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              <span >
                Skills
              </span>
            </h2>
          </div>

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
            style={{ maxWidth: "100px" }}
          >
            <div className="h-1 bg-gradient-to-r from-transparent via-red-600 through-red-400 to-transparent rounded-full"></div>
            <div className="absolute inset-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full blur-sm opacity-60"></div>
          </motion.div>
          </div>


        {loading ? (
          <div className="space-y-12">
            {[1, 2, 3].map((group) => (
              <div key={group}>
                <div className="text-center mb-6">
                  <div className="h-6 w-48 bg-gray-700 rounded mx-auto animate-pulse" />
                </div>
                <div className="flex flex-wrap justify-center gap-3 sm:gap-4 w-full">
                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className="bg-[#112240] rounded-lg px-4 py-3 h-12 w-[140px] sm:w-[160px] animate-pulse"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-12 w-full">
            {Object.entries(skillsData).map(([category, skills]) => {
              const Icon = getCategoryIcon(category);
              return (
                <div key={category} className="w-full">
                  <h3 className="text-lg sm:text-xl text-white font-semibold mb-4 sm:mb-6 text-center flex items-center justify-center gap-2">
                    <Icon size={18} className="text-[#17c0f8]" />
                    {category.toUpperCase()}
                  </h3>

                  <div className="flex flex-wrap justify-center gap-3 sm:gap-4 w-full">
                    {skills.map((skill, index) => (
                      <motion.div
                        key={`${category}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-[#112240] rounded-lg px-4 py-3 text-sm sm:text-base text-center hover:bg-[#1d3a6e] transition-colors w-[140px] sm:w-[160px]"
                      >
                        <p className="font-medium text-gray-300 truncate" title={skill}>
                          {skill}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default Skills;
