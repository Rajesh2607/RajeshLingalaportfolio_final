import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink, Code, Layers, Star, AlertCircle, Loader, Filter } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

import SEOHead from '../components/SEO/SEOHead';
import { projectSchema, breadcrumbSchema } from '../components/SEO/StructuredData';
import { generateBreadcrumbs, generateKeywords } from '../utils/seo';
import ProjectDetailModal from '../components/ProjectDetailModal';

// Error Boundary Component
class ProjectErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Project component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-8">
          <AlertCircle size={32} className="mx-auto mb-4 text-red-400" />
          <p className="text-red-400">Something went wrong loading this project.</p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="mt-2 px-3 py-1 bg-red-500/20 text-red-400 rounded text-sm hover:bg-red-500/30 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [groupedProjects, setGroupedProjects] = useState({});
  const [categories, setCategories] = useState(['All']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal state
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Refs for cleanup
  const timeoutRef = useRef(null);
  
  const location = useLocation();

  // Fetch projects from Firebase
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const querySnapshot = await getDocs(collection(db, 'projects'));
        
        if (querySnapshot.empty) {
          console.log('No projects found in database');
          setProjects([]);
          setGroupedProjects({});
          return;
        }

        const projectData = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          projectData.push({
            id: doc.id,
            title: data.title || 'Untitled Project',
            description: data.description || 'No description available',
            technologies: Array.isArray(data.technologies) ? data.technologies : [],
            github: data.github || '',
            live: data.live || '',
            category: data.category || 'General',
            domain: data.domain || 'Other',
            media: data.media || '',
            mediaType: data.mediaType || 'image',
            dateCreated: data.dateCreated || '2024-01-01'
          });
        });

        setProjects(projectData);

        // Group projects by domain
        const grouped = {};
        projectData.forEach(project => {
          const domain = project.domain;
          if (!grouped[domain]) {
            grouped[domain] = [];
          }
          grouped[domain].push(project);
        });

        setGroupedProjects(grouped);

        // Extract unique categories
        const uniqueCategories = ['All'];
        projectData.forEach(project => {
          if (project.category && !uniqueCategories.includes(project.category)) {
            uniqueCategories.push(project.category);
          }
        });
        
        setCategories(uniqueCategories);

      } catch (err) {
        console.error('Error fetching projects:', err);
        
        let errorMessage = 'Failed to load projects. Please try again later.';
        
        if (err.code === 'permission-denied') {
          errorMessage = 'Access denied. Please check your permissions.';
        } else if (err.code === 'unavailable') {
          errorMessage = 'Service temporarily unavailable. Please try again later.';
        } else if (!navigator.onLine) {
          errorMessage = 'No internet connection. Please check your network.';
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Cleanup effect for body overflow and timeouts
  useEffect(() => {
    return () => {
      // Cleanup on component unmount
      document.body.style.overflow = 'unset';
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Optimized modal functions with better performance
  const openModal = useCallback((project) => {
    // Prevent body scroll when modal opens
    document.body.style.overflow = 'hidden';
    setSelectedProject(project);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    // Restore body scroll when modal closes
    document.body.style.overflow = 'unset';
    setIsModalOpen(false);
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Delay clearing selected project to prevent flash
    timeoutRef.current = setTimeout(() => {
      setSelectedProject(null);
      timeoutRef.current = null;
    }, 150);
  }, []);

  // Memoized filtered projects
  const filteredGroupedProjects = useMemo(() => {
    let filtered = {};

    // Filter by category only
    if (activeCategory === 'All') {
      filtered = { ...groupedProjects };
    } else {
      Object.keys(groupedProjects).forEach(domain => {
        const filteredProjects = groupedProjects[domain].filter(
          project => project.category === activeCategory
        );
        if (filteredProjects.length > 0) {
          filtered[domain] = filteredProjects;
        }
      });
    }

    return filtered;
  }, [groupedProjects, activeCategory]);

  // Generate SEO data
  const breadcrumbs = generateBreadcrumbs(location.pathname);
  const projectKeywords = projects.flatMap(p => p.technologies).slice(0, 10);
  const keywords = generateKeywords('', [
    'Projects',
    'Portfolio',
    'Web Development',
    'React Projects',
    ...projectKeywords
  ]);

  const projectSchemas = projects.slice(0, 5).map(project => projectSchema(project));
  const breadcrumbSchemaData = breadcrumbSchema(breadcrumbs);
  const combinedSchema = [breadcrumbSchemaData, ...projectSchemas];

  // Optimized Project card component with minimal re-renders
  const ProjectCard = React.memo(({ project, index, onProjectClick }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [videoLoaded, setVideoLoaded] = useState(false);

    // URL validation helper
    const isValidUrl = (url) => {
      try {
        const urlObj = new URL(url);
        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
      } catch {
        return false;
      }
    };

    const handleCardClick = useCallback((e) => {
      e.preventDefault();
      onProjectClick(project);
    }, [project, onProjectClick]);

    const handleLinkClick = useCallback((e) => {
      e.stopPropagation();
      // Remove preventDefault to allow navigation
    }, []);

    const handleImageLoad = useCallback(() => {
      setImageLoaded(true);
    }, []);

    const handleImageError = useCallback(() => {
      setImageError(true);
      setImageLoaded(true);
    }, []);

    const handleVideoLoad = useCallback(() => {
      setVideoLoaded(true);
    }, []);

    const handleVideoError = useCallback(() => {
      setImageError(true);
      setVideoLoaded(true);
    }, []);

    // Simplified animation variants for better performance
    const cardVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { 
          duration: 0.3,
          ease: "easeOut"
        }
      }
    };

    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: index * 0.03 }}
        className="group bg-gradient-to-br from-[#112240] to-[#1a2f4a] rounded-2xl overflow-hidden border border-gray-700/50 hover:border-cyan-400/50 transition-all duration-200 hover:shadow-lg cursor-pointer transform-gpu"
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        aria-label={`View details for ${project.title}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCardClick(e);
          }
        }}
        style={{ 
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          perspective: 1000
        }}
        whileHover={{ 
          y: -2,
          transition: { duration: 0.2, ease: "easeOut" }
        }}
      >
        {/* Optimized Media Section */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
          {project.media && !imageError ? (
            <>
              {project.mediaType === 'video' ? (
                <>
                  {!videoLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800 z-10">
                      <div className="w-4 h-4 border-2 border-t-transparent border-cyan-400 rounded-full animate-spin"></div>
                    </div>
                  )}
                  <video
                    src={project.media}
                    className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
                      videoLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    onLoadedData={handleVideoLoad}
                    onError={handleVideoError}
                    style={{ 
                      willChange: 'transform',
                      backfaceVisibility: 'hidden'
                    }}
                  />
                </>
              ) : (
                <>
                  {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                      <div className="w-4 h-4 border-2 border-t-transparent border-cyan-400 rounded-full animate-spin"></div>
                    </div>
                  )}
                  <img
                    src={project.media}
                    alt={`${project.title} - ${project.description.substring(0, 50)}`}
                    loading="lazy"
                    className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
                      imageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    style={{ 
                      willChange: 'transform, opacity',
                      backfaceVisibility: 'hidden'
                    }}
                  />
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
              <div className="text-center text-gray-400">
                <Code size={24} className="mx-auto mb-1 opacity-50" />
                <p className="text-xs">No preview</p>
              </div>
            </div>
          )}

          {/* Simplified overlay with better performance */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <div className="flex space-x-2">
              {project.github && isValidUrl(project.github) && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleLinkClick}
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors duration-150"
                  aria-label={`View ${project.title} source code on GitHub`}
                >
                  <Github size={16} />
                </a>
              )}
              {project.live && isValidUrl(project.live) && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleLinkClick}
                  className="p-2 bg-cyan-500/30 backdrop-blur-sm rounded-full text-cyan-300 hover:bg-cyan-500/50 transition-colors duration-150"
                  aria-label={`View ${project.title} live demo`}
                >
                  <ExternalLink size={16} />
                </a>
              )}
            </div>
          </div>

          {/* Category badge */}
          <div className="absolute top-2 right-2">
            <span className="px-2 py-1 bg-cyan-500/20 backdrop-blur-sm text-cyan-300 text-xs font-medium rounded-full border border-cyan-400/30">
              {project.category}
            </span>
          </div>
        </div>

        {/* Optimized Content Section */}
        <div className="p-4">
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors duration-200 line-clamp-1">
            {project.title}
          </h3>
          
          <p className="text-gray-400 text-sm leading-relaxed mb-3 line-clamp-2">
            {project.description}
          </p>

          {/* Optimized Technologies */}
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {project.technologies.slice(0, 3).map((tech, i) => (
                <span
                  key={`${project.id}-tech-${i}`}
                  className="px-2 py-1 bg-gray-800/50 text-gray-300 rounded text-xs font-medium border border-gray-600/50"
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 3 && (
                <span className="px-2 py-1 bg-gray-700/50 text-gray-400 rounded text-xs font-medium">
                  +{project.technologies.length - 3}
                </span>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-700/50">
            <div className="flex items-center space-x-1 text-gray-400 text-xs">
              <Code size={10} />
              <span>{project.technologies.length} techs</span>
            </div>
            <div className="flex items-center space-x-1 text-yellow-400">
              <Star size={10} fill="currentColor" />
              <span className="text-xs font-medium">Featured</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  });

  // Optimized Domain section component
  const DomainSection = React.memo(({ domain, projects, domainIndex }) => {
    const totalProjects = projects.length;
    const uniqueTechs = [...new Set(projects.flatMap(p => p.technologies))].length;

    return (
      <motion.section
        key={domain}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: domainIndex * 0.05, duration: 0.4 }}
        className="mb-12"
      >
        {/* Domain Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-transparent bg-clip-text">
              {domain}
            </span>
          </h2>
          
          <div className="h-1 w-24 bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-full mx-auto mb-3"></div>
          
          <div className="flex flex-wrap justify-center gap-4 text-gray-400 text-sm">
            <div className="flex items-center space-x-1">
              <Layers size={12} className="text-cyan-400" />
              <span>{totalProjects} Project{totalProjects !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Code size={12} className="text-purple-400" />
              <span>{uniqueTechs} Technologies</span>
            </div>
          </div>
        </div>

        {/* Projects Grid with optimized layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {projects.map((project, index) => (
            <ProjectErrorBoundary key={project.id}>
              <ProjectCard 
                project={project} 
                index={index} 
                onProjectClick={openModal}
              />
            </ProjectErrorBoundary>
          ))}
        </div>
      </motion.section>
    );
  });

  // Loading skeleton with better performance
  const ProjectSkeleton = React.memo(() => (
    <div className="bg-gradient-to-br from-[#112240] to-[#1a2f4a] rounded-2xl overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-700"></div>
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-700 rounded w-2/3"></div>
        <div className="flex gap-1 mt-3">
          <div className="h-5 w-12 bg-gray-700 rounded-full"></div>
          <div className="h-5 w-16 bg-gray-700 rounded-full"></div>
          <div className="h-5 w-14 bg-gray-700 rounded-full"></div>
        </div>
      </div>
    </div>
  ));

  // Error state
  if (error) {
    return (
      <>
        <SEOHead
          title="Error Loading Projects | Rajesh Lingala"
          description="Error loading projects from Rajesh Lingala's portfolio"
          noindex={true}
        />
        <div className="min-h-screen bg-gradient-to-br from-[#0a192f] via-[#0f1419] to-[#0a192f] flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-6">
            <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-3">Something went wrong</h2>
            <p className="text-gray-400 mb-4 text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 text-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  const totalFilteredProjects = Object.values(filteredGroupedProjects).flat().length;

  return (
    <>
      <SEOHead
        title="Projects Portfolio | Rajesh Lingala - Frontend Developer"
        description={`Explore ${projects.length} innovative projects by Rajesh Lingala, showcasing expertise in React, JavaScript, and modern web development. View live demos and source code.`}
        keywords={keywords}
        url="https://rajeshlingala-portfolio.vercel.app/projects"
        structuredData={combinedSchema}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-[#0a192f] via-[#0f1419] to-[#0a192f]">
        {/* Optimized Hero Section */}
        <section className="relative py-12 px-6 md:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-transparent bg-clip-text">
                Project Portfolio
              </span>
            </h1>
            <p className="text-base md:text-lg text-gray-300 mb-6 leading-relaxed">
              Explore my projects organized by domain - click any card to view complete details
            </p>

            {/* Simplified Stats */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="text-center">
                <div className="text-xl font-bold text-cyan-400 mb-1">{projects.length}</div>
                <div className="text-gray-400 text-xs">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-purple-400 mb-1">{Object.keys(groupedProjects).length}</div>
                <div className="text-gray-400 text-xs">Domains</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-blue-400 mb-1">{Math.max(0, categories.length - 1)}</div>
                <div className="text-gray-400 text-xs">Categories</div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Category Filter Only */}
        {categories.length > 1 && (
          <section className="px-6 md:px-8 lg:px-12 mb-8">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-r from-[#112240]/80 to-[#1a2f4a]/80 backdrop-blur-xl rounded-xl border border-gray-700/50 p-4"
              >
                <div className="text-center">
                  <h3 className="text-white font-medium mb-3 flex items-center justify-center text-sm">
                    <Filter size={14} className="mr-2 text-cyan-400" />
                    Filter by Category
                  </h3>
                  <div className="flex flex-wrap justify-center gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 text-xs ${
                          activeCategory === category
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                            : 'bg-gray-800/50 text-gray-300 border border-gray-700/50 hover:border-cyan-400/50 hover:text-cyan-300'
                        }`}
                        aria-label={`Filter projects by ${category} category`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 text-gray-400 text-xs">
                    Showing {totalFilteredProjects} of {projects.length} projects
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Optimized Projects by Domain */}
        <section className="px-6 md:px-8 lg:px-12 pb-16">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="space-y-12">
                {Array(2).fill(null).map((_, i) => (
                  <div key={i} className="space-y-6">
                    <div className="text-center">
                      <div className="h-8 bg-gray-700 rounded w-32 mx-auto mb-3 animate-pulse"></div>
                      <div className="h-1 w-24 bg-gray-700 rounded mx-auto animate-pulse"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                      {Array(3).fill(null).map((_, j) => <ProjectSkeleton key={j} />)}
                    </div>
                  </div>
                ))}
              </div>
            ) : Object.keys(filteredGroupedProjects).length > 0 ? (
              Object.entries(filteredGroupedProjects).map(([domain, domainProjects], domainIndex) => (
                <DomainSection
                  key={domain}
                  domain={domain}
                  projects={domainProjects}
                  domainIndex={domainIndex}
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="max-w-lg mx-auto">
                  <Code size={40} className="mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-bold text-white mb-3">No projects found</h3>
                  <p className="text-gray-400 mb-4 text-sm">
                    {projects.length === 0 
                      ? "No projects available yet."
                      : "No projects match your selected category."
                    }
                  </p>
                  <button
                    onClick={() => setActiveCategory('All')}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 text-sm"
                  >
                    Show All Projects
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* Optimized Project Detail Modal */}
        <AnimatePresence mode="wait">
          {isModalOpen && selectedProject && (
            <ProjectDetailModal
              project={selectedProject}
              isOpen={isModalOpen}
              onClose={closeModal}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Projects;