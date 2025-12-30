import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, MapPin, Building2, ExternalLink } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
    },
  },
};

// Experience Card Component
// Experience Card Component
const ExperienceCard = ({ experience, index }) => {
  return (
    <motion.div
      variants={itemVariants}
      className={`relative flex flex-col md:flex-row gap-8 mb-12 ${
        index % 2 === 0 ? 'md:flex-row-reverse' : ''
      }`}
    >
      {/* Timeline Node */}
      <div className="absolute left-1/2 top-0 transform -translate-x-1/2 translate-y-5 w-8 h-8 z-20">
        {/* Ping Animation */}
        <div className="absolute inset-0 w-full h-full bg-[#f81717] rounded-full animate-ping opacity-20" />
        
        {/* Static Small Dot */}
        <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-[#17c0f8] rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 group-hover:scale-110" />
      </div>

      {/* Experience Content */}
      <div className={`flex-1 pt-6 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
        <div className="bg-[#1d3a6e] rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 group relative">
          {/* Company Logo - Desktop: overlapping top, Mobile: inside card at top */}
          {experience.logo && (
            <>
              {/* Desktop Logo - Above card with decorations */}
              <div className="hidden md:block absolute -top-12 left-1/2 transform -translate-x-1/2 z-10">
                {/* Outer glow - matches your background orbs */}
                <div className="absolute inset-0 w-32 h-32 -left-4 -top-4 bg-gradient-to-r from-purple-500/10 via-[#17c0f8]/10 to-blue-500/10 rounded-full blur-2xl"></div>
                
                {/* Logo container */}
                <div className="relative w-24 h-24 bg-white/90 rounded-2xl shadow-2xl p-3 hover:scale-105 transition-all duration-300 border-[5px] border-[#17c0f8]/30">
                  {/* Animated gradient ring on hover */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400/70 via-[#17c0f8]/70 to-blue-400/70 rounded-2xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300"></div>
                  
                  {/* Inner background */}
                  <div className="absolute inset-0 bg-white/90 rounded-2xl"></div>
                  
                  <img 
                    src={experience.logo} 
                    alt={`${experience.company} logo`}
                    className="w-full h-full object-contain relative z-10"
                  />
                </div>
              </div>
              
              {/* Mobile Logo - Inside card with decorations */}
              <div className="md:hidden flex justify-center pt-4 pb-2">
                <div className="relative">
                  {/* Mobile subtle glow */}
                  <div className="absolute inset-0 w-20 h-20 -left-2 -top-2 bg-gradient-to-r from-purple-500/5 via-[#17c0f8]/5 to-blue-500/5 rounded-full blur-xl"></div>
                  
                  <div className="relative w-16 h-16 bg-white/90 rounded-xl shadow-lg p-2 border-2 border-[#17c0f8]/20">
                    <img 
                      src={experience.logo} 
                      alt={`${experience.company} logo`}
                      className="w-full h-full object-contain relative z-10"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
          
          <div className={`p-6 ${experience.logo ? 'pt-2 md:pt-16' : ''}`}>
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <h3 className="text-xl font-bold text-white">{experience.title}</h3>
              
              <span className="px-3 py-1 bg-[#17c0f8]/10 text-[#17c0f8] rounded-full text-sm flex items-center gap-2">
                <Building2 size={16} className="text-[#17c0f8]" />
                {experience.company}
              </span>
            </div>
            <div className="flex items-center gap-4 text-gray-400 mb-4">
              <div className="flex items-center">
                <Calendar size={16} className="mr-1" />
                {experience.period}
              </div>
              <div className="flex items-center">
                <MapPin size={16} className="mr-1" />
                {experience.location}
              </div>
            </div>
            <ul className="space-y-2 mb-4">
              {(Array.isArray(experience.description) ? experience.description : [experience.description]).map((item, i) => (
                <li key={i} className="text-gray-300 flex items-start">
                  <span className="mr-2 text-[#17c0f8]">•</span>
                  {item}
                </li>
              ))}
            </ul>
            
            {/* Website Link Button */}
            {experience.website && (
              <a
                href={experience.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r to-red-500/70 from-cyan-400/70 hover:from-red-500/20 hover:to-cyan-400/20 text-white rounded-lg transition-all duration-300 hover:scale-105 border border-gradient-to-r from-red-500/30 to-cyan-400/30"
              >
                <ExternalLink size={16} className="text-red-500" />
                <span className="text-sm font-medium">Visit Website</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Spacer for Alignment */}
      <div className="hidden md:block flex-1" />
    </motion.div>
  );
};


// Main Experience Section
const Experience = () => {
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    const fetchExperienceData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'experiences'));
        const experienceList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setExperiences(experienceList);
      } catch (error) {
        console.error('Error fetching experience data: ', error);
      }
    };

    fetchExperienceData();
  }, []);

  return (
    <div className="overflow-x-hidden">
        <section
    id="about"
    className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-[#0a192f] via-[#112240] to-[#0a192f] text-white w-full relative overflow-hidden"
  >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl"></div>
    </div>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading */}
          <div className="flex flex-col items-center justify-center mb-12">
          <div className="flex items-center">
            <Briefcase size={24} className="text-[#17c0f8] mr-2" />
            <h2 className="text-3xl font-bold text-white ">
              <span >
                Experience
              </span>
            </h2>
          </div>
          <>
          <br />
          </>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
          viewport={{ once: true }}
          className="relative"
          style={{ maxWidth: "160px" }}
        >
          <div className="h-1 bg-gradient-to-r from-transparent via-red-600 through-cyan-400 to-transparent rounded-full"></div>
          <div className="absolute inset-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full blur-sm opacity-60"></div>
        </motion.div>
</div>


          {/* Timeline and Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative"
          >
            {/* Vertical Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-[#17c0f8] to-[#0a192f]" />

            {/* Experience Cards */}
            {experiences
              .sort((a, b) => a.order - b.order)
              .map((experience, index) => (
                <ExperienceCard key={experience.id} experience={experience} index={index} />
              ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Experience;
