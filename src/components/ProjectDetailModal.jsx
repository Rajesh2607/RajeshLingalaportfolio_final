import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, ExternalLink, Code, Tag, Star, Layers, Loader, AlertCircle } from 'lucide-react';

const ProjectDetailModal = ({ project, isOpen, onClose }) => {
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const [mediaError, setMediaError] = useState(false);

  // Memoize project data to prevent unnecessary re-renders
  const projectData = useMemo(() => {
    if (!project) return null;
    
    return {
      id: project.id,
      title: project.title || 'Untitled Project',
      description: project.description || 'No description available',
      technologies: Array.isArray(project.technologies) ? project.technologies : [],
      github: project.github || '',
      live: project.live || '',
      category: project.category || 'General',
      domain: project.domain || 'Other',
      media: project.media || '',
      mediaType: project.mediaType || 'image'
    };
  }, [project]);

  // Reset states when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setMediaLoaded(false);
      setMediaError(false);
    }
  }, [isOpen]);

  // Optimized close handler
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Optimized backdrop click handler
  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }, [handleClose]);

  // Prevent event bubbling for links
  const handleLinkClick = useCallback((e) => {
    e.stopPropagation();
  }, []);

  // Media load handlers
  const handleMediaLoad = useCallback(() => {
    setMediaLoaded(true);
  }, []);

  const handleMediaError = useCallback(() => {
    setMediaError(true);
    setMediaLoaded(true);
  }, []);

  // Escape key handler
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, handleClose]);

  if (!projectData) return null;

  // Optimized animation variants for better performance
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.95,
      y: 20
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        duration: 0.15,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      y: 20,
      transition: {
        duration: 0.1,
        ease: "easeIn"
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
          style={{ willChange: 'opacity' }}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-gradient-to-br from-[#112240] to-[#1a2f4a] rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-700/50 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{ willChange: 'transform, opacity' }}
          >
            {/* Optimized Header */}
            <div className="relative p-4 border-b border-gray-700/50 bg-[#112240]/80">
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors duration-150"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
              
              <div className="pr-12">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="p-1.5 bg-cyan-500/20 rounded-lg">
                    <Code size={16} className="text-cyan-400" />
                  </div>
                  <span className="px-2 py-1 bg-cyan-500/20 text-cyan-300 text-xs font-medium rounded-full border border-cyan-400/30">
                    {projectData.category}
                  </span>
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs font-medium rounded-full border border-purple-400/30">
                    {projectData.domain}
                  </span>
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-2">{projectData.title}</h2>
                
                <div className="flex items-center space-x-3 text-gray-400 text-sm">
                  <div className="flex items-center space-x-1">
                    <Layers size={14} className="text-cyan-400" />
                    <span>{projectData.technologies.length} Technologies</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star size={14} className="text-yellow-400" fill="currentColor" />
                    <span>Featured</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Optimized Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-100px)] scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
              <div className="p-4 space-y-6">
                {/* Project Media */}
                {projectData.media && (
                  <div className="relative rounded-lg overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                    {!mediaLoaded && !mediaError && (
                      <div className="absolute inset-0 flex items-center justify-center z-10 bg-gray-800">
                        <div className="text-center">
                          <div className="w-6 h-6 border-2 border-t-transparent border-cyan-400 rounded-full animate-spin mx-auto mb-2"></div>
                          <p className="text-gray-400 text-sm">Loading media...</p>
                        </div>
                      </div>
                    )}

                    {mediaError ? (
                      <div className="w-full h-48 md:h-64 flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
                        <div className="text-center text-gray-400">
                          <AlertCircle size={32} className="mx-auto mb-3 opacity-50" />
                          <p className="text-sm">Media failed to load</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        {projectData.mediaType === 'video' ? (
                          <video
                            src={projectData.media}
                            className={`w-full h-48 md:h-64 object-cover transition-opacity duration-200 ${
                              mediaLoaded ? 'opacity-100' : 'opacity-0'
                            }`}
                            controls
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="metadata"
                            onLoadedData={handleMediaLoad}
                            onError={handleMediaError}
                          />
                        ) : (
                          <img
                            src={projectData.media}
                            alt={projectData.title}
                            className={`w-full h-48 md:h-64 object-cover transition-opacity duration-200 ${
                              mediaLoaded ? 'opacity-100' : 'opacity-0'
                            }`}
                            loading="lazy"
                            onLoad={handleMediaLoad}
                            onError={handleMediaError}
                          />
                        )}
                      </>
                    )}
                    
                    {/* Overlay */}
                    {mediaLoaded && !mediaError && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-end justify-center pb-4">
                        <div className="flex space-x-3">
                          {projectData.github && (
                            <a
                              href={projectData.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={handleLinkClick}
                              className="flex items-center space-x-1 px-3 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors duration-150 text-sm"
                            >
                              <Github size={16} />
                              <span>Code</span>
                            </a>
                          )}
                          {projectData.live && (
                            <a
                              href={projectData.live}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={handleLinkClick}
                              className="flex items-center space-x-1 px-3 py-2 bg-cyan-500/30 backdrop-blur-sm rounded-full text-cyan-300 hover:bg-cyan-500/50 transition-colors duration-150 text-sm"
                            >
                              <ExternalLink size={16} />
                              <span>Demo</span>
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Project Description */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <Tag size={18} className="mr-2 text-cyan-400" />
                    Description
                  </h3>
                  <div className="bg-[#0a192f]/50 rounded-lg p-4 border border-gray-700/30">
                    <p className="text-gray-300 leading-relaxed">
                      {projectData.description}
                    </p>
                  </div>
                </div>

                {/* Technologies Grid */}
                {projectData.technologies.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                      <Code size={18} className="mr-2 text-purple-400" />
                      Technologies ({projectData.technologies.length})
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {projectData.technologies.map((tech, index) => (
                        <div
                          key={`${tech}-${index}`}
                          className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-lg p-2 text-center border border-gray-600/30 hover:border-cyan-400/50 hover:bg-cyan-500/10 transition-colors duration-150"
                        >
                          <span className="text-gray-300 font-medium text-sm">{tech}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Project Links */}
                {(projectData.github || projectData.live) && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                      <ExternalLink size={18} className="mr-2 text-blue-400" />
                      Links
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {projectData.github && (
                        <a
                          href={projectData.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={handleLinkClick}
                          className="flex items-center space-x-2 p-3 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-lg border border-gray-600/30 hover:border-gray-500/50 hover:bg-gray-700/30 transition-colors duration-150 group"
                        >
                          <div className="p-2 bg-gray-700/50 rounded-lg group-hover:bg-gray-600/50 transition-colors duration-150">
                            <Github size={18} className="text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="text-white font-medium text-sm">Source Code</div>
                            <div className="text-gray-400 text-xs">View on GitHub</div>
                          </div>
                          <ExternalLink size={14} className="text-gray-400 group-hover:text-white transition-colors duration-150" />
                        </a>
                      )}
                      
                      {projectData.live && (
                        <a
                          href={projectData.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={handleLinkClick}
                          className="flex items-center space-x-2 p-3 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-lg border border-cyan-400/30 hover:border-cyan-400/50 hover:bg-cyan-500/30 transition-colors duration-150 group"
                        >
                          <div className="p-2 bg-cyan-500/30 rounded-lg group-hover:bg-cyan-500/50 transition-colors duration-150">
                            <ExternalLink size={18} className="text-cyan-300" />
                          </div>
                          <div className="flex-1">
                            <div className="text-white font-medium text-sm">Live Demo</div>
                            <div className="text-cyan-300 text-xs">View live project</div>
                          </div>
                          <ExternalLink size={14} className="text-cyan-400 group-hover:text-cyan-300 transition-colors duration-150" />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Project Stats */}
                <div className="bg-gradient-to-r from-[#0a192f]/50 to-[#112240]/50 rounded-lg p-4 border border-gray-700/30">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-xl font-bold text-cyan-400 mb-1">{projectData.technologies.length}</div>
                      <div className="text-gray-400 text-xs">Technologies</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-purple-400 mb-1 truncate">{projectData.category}</div>
                      <div className="text-gray-400 text-xs">Category</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-blue-400 mb-1 truncate">{projectData.domain}</div>
                      <div className="text-gray-400 text-xs">Domain</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default React.memo(ProjectDetailModal);