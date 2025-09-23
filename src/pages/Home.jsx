import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useLocation } from 'react-router-dom';

import SEOHead from '../components/SEO/SEOHead';
import { personSchema, websiteSchema, portfolioSchema } from '../components/SEO/StructuredData';
import { generateBreadcrumbs } from '../utils/seo';
import HeroSection from '../components/home/HeroSection';
import AboutSection from '../components/home/AboutSection';
import Skills from '../components/home/Skills';
import Experience from '../components/home/Experience';
import ContactSection from '../components/home/Contact';
import Note from '../components/home/Note';
import SkeletonLoaderForhome from '../components/skeleton/SkeletonLoaderForhome';

const Home = () => {
  const [about, setAbout] = useState({
    title: [],
    profilePic: '',
    description: '',
    resume: ''
  });
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    const fetchAboutData = async () => {
      try {
        const docRef = doc(db, 'content', 'about');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && isMounted) {
          setAbout(docSnap.data());
        }
      } catch (error) {
        console.error('Error fetching about data:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAboutData();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="bg-[#0a192f]">
        <SEOHead
          title="Loading... | Rajesh Lingala Portfolio"
          description="Loading Rajesh Lingala's portfolio - Frontend React Developer from India"
        />
        <SkeletonLoaderForhome />
      </div>
    );
  }

  const breadcrumbs = generateBreadcrumbs(location.pathname);
  const combinedSchema = [personSchema, websiteSchema, portfolioSchema];

  return (
    <>
      <SEOHead
        title="Rajesh Lingala | Frontend React Developer Portfolio"
        description="Official portfolio of Rajesh Lingala – a skilled Frontend Developer and React Developer from India. View projects, skills, certificates, and career highlights."
        keywords="Rajesh Lingala, Frontend Developer, React Developer, Portfolio, JavaScript, Web Developer, Developer India, Personal Website, Projects, Skills, UI/UX Design, Node.js, MongoDB"
        image={about.profilePic || "https://firebasestorage.googleapis.com/v0/b/myprofolio-34d7c.firebasestorage.app/o/profile%2FWhatsApp%20Image%202025-04-20%20at%2018.48.10_4a2d17cb.jpg?alt=media&token=5ac51520-47e7-4799-ab7a-439ef0a4efc2"}
        url="https://rajeshlingala-portfolio.vercel.app/"
        structuredData={combinedSchema}
      />
      
      <main className="bg-[#0a192f] overflow-x-hidden">
        <HeroSection about={about} />
        <AboutSection about={about} />
        <Skills />
        <Experience />
        <ContactSection />
        <Note />
      </main>
    </>
  );
};

export default Home;