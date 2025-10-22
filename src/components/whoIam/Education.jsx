import React, { useEffect, useRef, useState } from 'react';
import { GraduationCap, Calendar, Award } from 'lucide-react';
import { db } from '../../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { motion } from 'framer-motion';


const Education = () => {
  const sectionRef = useRef(null);
  const [educationData, setEducationData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'educations'));
        const data = querySnapshot.docs.map((doc) => doc.data());

        const sortedData = data.sort(
          (a, b) => parseInt(b.endYear || 0) - parseInt(a.endYear || 0)
        );
        setEducationData(sortedData);
      } catch (error) {
        console.error('Error fetching education data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100');
          entry.target.classList.remove('opacity-0', 'translate-y-10');

          const items = document.querySelectorAll('.education-item');
          items.forEach((item, index) => {
            setTimeout(() => {
              item.classList.add('opacity-100');
              item.classList.remove('opacity-0', 'translate-y-10');
            }, 300 * index);
          });
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, [educationData]);

  if (loading) {
    return (
      <section className="py-20 bg-navy text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 text-transparent bg-clip-text">
                Education
              </span>
            </h2>

            <div className="space-y-16">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="relative animate-pulse">
                  <div className="flex items-center gap-8">
                    {/* Circular image placeholder */}
                    <div className="w-40 h-40 md:w-48 md:h-48 rounded-full bg-gray-700 flex-shrink-0"></div>
                    
                    {/* Timeline connector */}
                    <div className="flex items-center">
                      <div className="w-12 md:w-16 h-0.5 bg-gray-600"></div>
                    </div>

                    {/* Info card placeholder */}
                    <div className="flex-1 bg-gray-800 rounded-xl p-6 md:p-8 space-y-4">
                      <div className="h-6 bg-gray-600 rounded w-3/4"></div>
                      <div className="h-5 bg-gray-700 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                      <div className="h-4 bg-gray-700 rounded w-1/3"></div>
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
    <section 
      id="education" 
      ref={sectionRef}
      className="py-20 bg-navy text-white transition-all duration-1000 ease-out opacity-0 translate-y-10"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-center">
              <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 text-transparent bg-clip-text">
                Education
              </span>
            </h2>

            <br />
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
              viewport={{ once: true }}
              className="relative"
              style={{ maxWidth: "140px" }}
            >
              <div className="h-1 bg-gradient-to-r from-transparent via-purple-400 through-cyan-400 to-transparent rounded-full"></div>
              <div className="absolute inset-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full blur-sm opacity-60"></div>
            </motion.div>
          </div>

          {/* Timeline with education items */}
          <div className="relative">
            <div className="space-y-16 md:space-y-24">
              {educationData.map((edu, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="education-item opacity-0 translate-y-10 transition-all duration-700 ease-out relative"
                >
                  <div className="flex flex-col md:flex-row items-center md:items-center gap-6">
                    {/* Left: Circular college image */}
                    <div className="relative flex-shrink-0 group z-10">
                      <div className="w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden border-2 border-transparent bg-gradient-to-br from-purple-400 via-cyan-400 to-blue-400 p-0.5 shadow-xl group-hover:scale-105 transition-transform duration-300">
                        <div className="w-full h-full rounded-full overflow-hidden bg-navy">
                          {edu.image ? (
                            <img 
                              src={edu.image} 
                              alt={edu.institution}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div 
                            className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/50 to-cyan-900/50 ${edu.image ? 'hidden' : 'flex'}`}
                          >
                            <GraduationCap size={80} className="text-cyan-400" />
                          </div>
                        </div>
                      </div>
                      {/* Glow effect - minimized */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 via-cyan-400 to-blue-400 opacity-10 blur-lg group-hover:opacity-15 transition-opacity duration-300"></div>
                    </div>

                    {/* Timeline connection section - Hidden on mobile */}
                    <div className="hidden md:flex items-center relative z-10">
                      {/* Horizontal line from image to timeline dot */}
                      <div className="w-10 lg:w-12 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400"></div>
                      
                      {/* Timeline dot with vertical line */}
                      <div className="relative flex items-center justify-center">
                        {/* Vertical line segment - from previous dot to this dot */}
                        {index > 0 && (
                          <div 
                            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0.5 bg-gradient-to-b from-purple-400 via-cyan-400 to-blue-400" 
                            style={{ height: '20rem', marginBottom: '0.125rem' }}>
                          </div>
                        )}
                        
                        {/* Vertical line segment - from this dot to next dot */}
                        {index < educationData.length - 1 && (
                          <div 
                            className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 bg-gradient-to-b from-purple-400 via-cyan-400 to-blue-400" 
                            style={{ height: '23rem', marginTop: '0.125rem' }}>
                          </div>
                        )}
                        
                        {/* Center dot */}
                        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-400 to-cyan-400 shadow-lg shadow-cyan-400/50 relative z-10"></div>
                      </div>
                      
                      {/* Horizontal line from dot to card */}
                      <div className="w-20 lg:w-28 h-0.5 bg-gradient-to-r from-purple-400 to-cyan-400"></div>
                    </div>

                    {/* Right: Education info card */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="flex-1 w-full md:min-w-[450px] lg:min-w-[550px] bg-gradient-to-br from-[#112240] to-[#1a2f4a] rounded-xl p-8 md:p-10 shadow-2xl border border-gray-700 hover:border-cyan-400/50 transition-all duration-300 relative overflow-hidden"
                    >
                      {/* Gradient bars on edges */}
                      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-400 to-cyan-400"></div>
                      <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-purple-400 to-cyan-400"></div>

                      {/* Institution name */}
                      <h3 className="text-2xl md:text-3xl font-bold mb-3">
                        <span className="bg-gradient-to-r from-purple-300 via-cyan-300 to-blue-300 text-transparent bg-clip-text">
                          {edu.institution}
                        </span>
                      </h3>

                      {/* Degree name */}
                      <div className="flex items-center mb-3">
                        <Award className="text-purple-400 mr-3" size={20} />
                        <p className="text-xl font-semibold text-white">{edu.degree}</p>
                      </div>

                      {/* Course/Field of study */}
                      <div className="flex items-center mb-4">
                        <GraduationCap className="text-cyan-400 mr-3" size={18} />
                        <p className="text-lg text-gray-300">{edu.fieldOfStudy}</p>
                      </div>

                      {/* Year of study */}
                      <div className="flex items-center mb-4">
                        <Calendar className="text-blue-400 mr-3" size={18} />
                        <span className="text-cyan-400 font-medium">
                          {edu.startYear || 'Unknown'} - {edu.endYear || 'Present'}
                        </span>
                      </div>

                      {/* Description points */}
                      {edu.description && edu.description.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-gray-600/50">
                          <ul className="space-y-3">
                            {edu.description.map((point, idx) => (
                              <li key={idx} className="flex items-start text-gray-300">
                                <span className="text-cyan-400 mr-3 mt-1 flex-shrink-0">•</span>
                                <span className="text-sm md:text-base leading-relaxed">{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Decorative corner elements */}
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-cyan-400/10 to-transparent rounded-bl-full"></div>
                      <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-purple-400/10 to-transparent rounded-tr-full"></div>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
