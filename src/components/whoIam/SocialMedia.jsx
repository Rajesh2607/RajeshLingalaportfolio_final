import React, { useEffect, useState } from 'react';
import { Github, Linkedin, Twitter, Youtube, Instagram, Facebook, FileText, File } from 'lucide-react';
import { db } from '../../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { motion } from 'framer-motion'; 

const SocialMedia = () => {
  const [socialLinks, setSocialLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'socialLinks'));
        const links = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setSocialLinks(links);
      } catch (error) {
        console.error('Error fetching social media accounts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSocialLinks();
  }, []);

  const getIcon = (name) => {
    switch (name.toLowerCase()) {
      case 'github':
        return <Github className="w-8 h-8 text-white" />;
      case 'linkedin':
        return <Linkedin className="w-8 h-8 text-white" />;
      case 'twitter':
        return <Twitter className="w-8 h-8 text-white" />;
      case 'youtube':
        return <Youtube className="w-8 h-8 text-white" />;
      case 'instagram':
        return <Instagram className="w-8 h-8 text-white" />;
      case 'facebook':
        return <Facebook className="w-8 h-8 text-white" />;
      case 'adobe':
        return <FileText className="w-8 h-8 text-white" />;
      case 'behance':
        return <File className="w-8 h-8 text-white" />;
      default:
        return <FileText className="w-8 h-8 text-white" />;
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-midnight text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col items-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-center">
                <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 text-transparent bg-clip-text">
                  Connect With Me
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
          style={{ maxWidth: "460px" }}
        >
          <div className="h-1 bg-gradient-to-r from-transparent via-purple-400 through-cyan-400 to-transparent rounded-full"></div>
          <div className="absolute inset-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full blur-sm opacity-60"></div>
        </motion.div>
         </div>


            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse bg-navy bg-opacity-50 rounded-xl p-6 min-h-[160px]"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-800 rounded-lg" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-700 rounded w-3/4" />
                      <div className="h-3 bg-gray-800 rounded w-1/2" />
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
    <section id="social" className="py-20 bg-midnight text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-center">
              <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 text-transparent bg-clip-text">
                Connect With Me
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
          style={{ maxWidth: "260px" }}
        >
          <div className="h-1 bg-gradient-to-r from-transparent via-purple-400 through-cyan-400 to-transparent rounded-full"></div>
          <div className="absolute inset-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full blur-sm opacity-60"></div>
        </motion.div></div>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-navy bg-opacity-50 rounded-xl p-6 transition-all duration-300 hover:bg-opacity-70 hover:transform hover:scale-105 flex flex-col justify-center min-h-[160px]"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gray-800 rounded-lg group-hover:bg-gray-700">
                    {getIcon(link.name)}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{link.name}</h3>
                    <p className="text-gray-400 text-sm">Follow me on {link.name}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialMedia;
