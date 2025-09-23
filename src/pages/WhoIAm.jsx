import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

import SEOHead from '../components/SEO/SEOHead';
import { personSchema, breadcrumbSchema } from '../components/SEO/StructuredData';
import { generateBreadcrumbs, generateKeywords } from '../utils/seo';
import Hero from '../components/whoIam/Hero';
import Achievements from '../components/whoIam/Achievements';
import Education from '../components/whoIam/Education';
import SocialMedia from '../components/whoIam/SocialMedia';
import About from '../components/whoIam/About';
import WhoIAmIntro from '../components/whoIam/whoiamintro';
import SkeletonLoaderForWhoIAm from '../components/skeleton/SkeletonLoaderForWhoIAm';

const WhoIAm = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading effect (you can skip this if you fetch real data)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Handle hash-based scroll after loading is done
  useEffect(() => {
    if (!loading && location.hash === '#connect') {
      setTimeout(() => {
        const section = document.getElementById('connect');
        section?.scrollIntoView({ behavior: 'smooth' });
      }, 300); // Adjust delay if needed
    }
  }, [loading, location]);

  // Generate SEO data
  const breadcrumbs = generateBreadcrumbs(location.pathname);
  const keywords = generateKeywords('', [
    'About',
    'Personal Story',
    'Professional Journey',
    'Education',
    'Achievements',
    'Social Media',
    'Connect',
    'Background',
    'Experience'
  ]);

  const breadcrumbSchemaData = breadcrumbSchema(breadcrumbs);
  const combinedSchema = [breadcrumbSchemaData, personSchema];

  if (loading) {
    return (
      <>
        <SEOHead
          title="Loading About Page... | Rajesh Lingala"
          description="Loading information about Rajesh Lingala"
          noindex={true}
        />
        <SkeletonLoaderForWhoIAm />
      </>
    );
  }

return (
    <>
      <SEOHead
        title="About Me - Who I Am | Rajesh Lingala - Frontend Developer"
        description="Learn about Rajesh Lingala's journey as a Frontend React Developer from India. Discover his personal story, professional background, education, achievements, and connect with him."
        keywords={keywords}
        url="https://rajeshlingala-portfolio.vercel.app/whoiam"
        structuredData={combinedSchema}
      />
      <WhoIAmIntro />
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-[#0a192f] via-[#08162b] to-[#0a192f] text-white w-full relative overflow-hidden"
      > 
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(300)].map((_, i) => (
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
        <div className="container mx-auto px-6 space-y-20">
          <Hero />
          <Education />
          <About />
          <Achievements />
          <div id="connect">
            <SocialMedia />
          </div>
        </div>
      </section>
    </>
);
};

export default WhoIAm;