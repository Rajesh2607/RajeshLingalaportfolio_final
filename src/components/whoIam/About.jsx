import React, { useEffect, useRef, useState } from 'react';
import { Code, LineChart, Palette } from 'lucide-react';
import { motion } from 'framer-motion';
import { db } from '../../firebase/config';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

const About = () => {
  const sectionRef = useRef(null);
  const [aboutSections, setAboutSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const sectionsRefs = useRef([]);

  useEffect(() => {
    const fetchAboutSections = async () => {
      try {
        const q = query(collection(db, 'whoAboutSections'), orderBy('order', 'asc'));
        const querySnapshot = await getDocs(q);
        const sections = [];
        querySnapshot.forEach((doc) => {
          sections.push({ id: doc.id, ...doc.data() });
        });
        setAboutSections(sections);
      } catch (error) {
        console.error('Error fetching about sections:', error);
        // Fallback to default sections if fetch fails
        setAboutSections([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutSections();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'transform-none');
            entry.target.classList.remove('opacity-0', 'translate-y-10');
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe section refs
    sectionsRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    // Observe main section
    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      sectionsRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, [aboutSections]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-20 bg-midnight text-white transition-all duration-1000 ease-out opacity-0 translate-y-10"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
        <div className="flex flex-col items-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-center">
          <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 text-transparent bg-clip-text">
            What I Do?
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
          style={{ maxWidth: "180px" }}
        >
          <div className="h-1 bg-gradient-to-r from-transparent via-purple-400 through-cyan-400 to-transparent rounded-full"></div>
          <div className="absolute inset-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full blur-sm opacity-60"></div>
        </motion.div>   </div>

        {/* Dynamic Sections */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400"></div>
          </div>
        ) : (
          aboutSections.map((section, index) => {
            const isEven = index % 2 === 0;
            const getIconComponent = (iconName) => {
              switch (iconName) {
                case 'Palette':
                  return <Palette className={`text-${section.color}-400 mr-4`} size={32} />;
                case 'Code':
                  return <Code className={`text-${section.color}-400 mr-4`} size={32} />;
                case 'LineChart':
                  return <LineChart className={`text-${section.color}-400 mr-4`} size={32} />;
                default:
                  return <Code className={`text-${section.color}-400 mr-4`} size={32} />;
              }
            };

            return (
              <div
                key={section.id}
                ref={el => sectionsRefs.current[index] = el}
                className={`mb-20 opacity-0 translate-y-10 transition-all duration-1000 ease-out ${
                  index === aboutSections.length - 1 ? 'mb-0' : ''
                }`}
              >
                <div className="flex items-center mb-8">
                  {getIconComponent(section.icon)}
                  <h3 className="text-3xl font-bold text-white">{section.title}</h3>
                </div>
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center`}>
                  {/* Image - alternates left/right */}
                  <div className={`${isEven ? 'order-1' : 'order-2'}`}>
                    <img
                      src={section.image}
                      alt={section.title}
                      className="rounded-lg shadow-xl w-full"
                    />
                  </div>
                  {/* Content - alternates right/left */}
                  <div className={`${isEven ? 'order-2' : 'order-1'} bg-navy bg-opacity-50 rounded-xl p-6`}>
                    <p className="text-gray-300 mb-6">{section.description}</p>
                    <ul className="space-y-4 mb-6">
                      {section.skills && section.skills.map((skill, skillIndex) => (
                        <li key={skillIndex} className="flex items-center text-gray-200">
                          <span className="text-yellow-500 mr-2">⚡</span>
                          {skill}
                        </li>
                      ))}
                    </ul>
                    {section.technologies && (
                      <div className="flex flex-wrap gap-4">
                        {section.technologies.map((tech, techIndex) => (
                          <img
                            key={techIndex}
                            src={tech.icon}
                            alt={tech.name}
                            className="h-12"
                            title={tech.name}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  </section>
);
};

export default About;
