import React, { useEffect, useRef, useState } from 'react';
import { GraduationCap, Calendar } from 'lucide-react';
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
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 text-transparent bg-clip-text">
              Education
            </span>
          </h2>

          <div className="relative pl-8 before:content-[''] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-purple-400 before:via-cyan-400 before:to-blue-400 space-y-12">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="relative animate-pulse">
                <div className="absolute left-0 w-4 h-4 bg-cyan-400 rounded-full transform -translate-x-2 mt-1.5"></div>
                <div className="bg-midnight bg-opacity-70 rounded-xl p-6 md:p-8 shadow-xl space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="h-4 bg-gray-600 rounded w-1/2" />
                    <div className="h-3 bg-gray-700 rounded w-1/4" />
                  </div>
                  <div className="h-4 bg-gray-600 rounded w-1/3" />
                  <div className="h-3 bg-gray-700 rounded w-1/2" />
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
        <div className="max-w-4xl mx-auto">
            <div className="flex flex-col items-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-center">
                <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 text-transparent bg-clip-text">
                  Education
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
          style={{ maxWidth: "140px" }}
        >
          <div className="h-1 bg-gradient-to-r from-transparent via-purple-400 through-cyan-400 to-transparent rounded-full"></div>
          <div className="absolute inset-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full blur-sm opacity-60"></div>
        </motion.div>
            </div>

          <div className="relative pl-8 before:content-[''] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-purple-400 before:via-cyan-400 before:to-blue-400 space-y-12">
            {educationData.map((edu, index) => (
              <div 
                key={index}
                className="education-item opacity-0 translate-y-10 transition-all duration-700 ease-out"
              >
                <div className="absolute left-0 w-4 h-4 bg-cyan-400 rounded-full transform -translate-x-2 mt-1.5"></div>
                <div className="relative bg-navy rounded-lg p-6 md:p-8 shadow-lg border border-gray-600 hover:border-cyan-400 transition-colors duration-300
  before:absolute before:top-0 before:bottom-0 before:left-0 before:w-1 before:bg-gradient-to-b before:from-purple-400 before:to-cyan-400 before:rounded-full
  after:absolute after:top-0 after:bottom-0 after:right-0 after:w-1 after:bg-gradient-to-b after:from-purple-400 after:to-cyan-400 after:rounded-full
">

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div className="text-xl font-semibold text-purple-300">{edu.institution}</div>
                    <div className="flex items-center text-cyan-400 mt-2 md:mt-0">
                      <Calendar className="mr-2" size={16} />
                      <span>{edu.startYear || 'Unknown'} - {edu.endYear || 'Present'}</span>
                    </div>
                  </div>
                  <div className="flex items-center mb-2">
                    <GraduationCap className="text-purple-400 mr-3" size={20} />
                    <p className="text-white font-medium">{edu.degree}</p>
                  </div>
                  <p className="text-gray-400 italic">{edu.fieldOfStudy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
