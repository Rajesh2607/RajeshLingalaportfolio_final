import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  Tag, 
  Share2, 
  BookOpen,
  Eye,
  ChevronUp
} from 'lucide-react';

import SEOHead from '../components/SEO/SEOHead';
import { blogPostSchema, breadcrumbSchema } from '../components/SEO/StructuredData';
import { generateBreadcrumbs, generateMetaDescription, calculateReadingTime, extractTextFromHTML } from '../utils/seo';

const BlogDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const [post, setPost] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [readingProgress, setReadingProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [estimatedReadTime, setEstimatedReadTime] = useState(0);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const docRef = doc(db, 'blogs', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const blogData = docSnap.data();
          setPost({
            id,
            ...blogData,
            dateModified: blogData.dateModified || blogData.date
          });
          
          // Calculate estimated read time based on content
          if (blogData.content) {
            const readTime = calculateReadingTime(blogData.content);
            setEstimatedReadTime(readTime);
          }
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlog();
  }, [id]);

  // Reading progress and scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      
      setReadingProgress(Math.min(progress, 100));
      setShowScrollTop(scrollTop > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const shareArticle = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: `Check out this article: ${post.title}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  // Generate SEO data
  const breadcrumbs = generateBreadcrumbs(location.pathname);
  const metaDescription = post ? generateMetaDescription(post.content) : '';
  const keywords = post ? `${post.title}, ${post.category || ''}, Blog, Article, Rajesh Lingala` : '';
  
  const blogSchema = post ? blogPostSchema(post) : null;
  const breadcrumbSchemaData = breadcrumbSchema(breadcrumbs);
  const combinedSchema = blogSchema ? [breadcrumbSchemaData, blogSchema] : [breadcrumbSchemaData];

  if (loading) {
    return (
      <>
        <SEOHead
          title="Loading Article... | Rajesh Lingala Blog"
          description="Loading blog article from Rajesh Lingala's blog"
          noindex={true}
        />
        <BlogDetailSkeleton />
      </>
    );
  }

  if (!post) {
    return (
      <>
        <SEOHead
          title="Article Not Found | Rajesh Lingala Blog"
          description="The requested blog article could not be found"
          noindex={true}
        />
        <BlogNotFound />
      </>
    );
  }

  const publishedTime = post.date ? new Date(post.date).toISOString() : undefined;
  const modifiedTime = post.dateModified ? new Date(post.dateModified).toISOString() : undefined;

  return (
    <>
      <SEOHead
        title={`${post.title} | Rajesh Lingala Blog`}
        description={metaDescription}
        keywords={keywords}
        image={post.image}
        url={`https://rajeshlingala-portfolio.vercel.app/blog/${id}`}
        type="article"
        publishedTime={publishedTime}
        modifiedTime={modifiedTime}
        section={post.category}
        tags={post.tags || [post.category].filter(Boolean)}
        structuredData={combinedSchema}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-[#0a192f] via-[#0f1419] to-[#0a192f]">
        {/* Reading Progress Bar */}
        <div className="fixed top-0 left-0 w-full h-1 bg-gray-800 z-50">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
            style={{ width: `${readingProgress}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${readingProgress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>

        {/* Scroll to Top Button */}
        <motion.button
          onClick={scrollToTop}
          className={`fixed bottom-8 right-8 p-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full shadow-xl z-40 transition-all duration-300 ${
            showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Scroll to top"
        >
          <ChevronUp size={24} />
        </motion.button>

        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link
              to="/blog"
              className="inline-flex items-center text-cyan-400 hover:text-white transition-colors duration-300 group"
              aria-label="Back to blog"
            >
              <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="font-medium">Back to Blog</span>
            </Link>
          </motion.div>

          {/* Article Header */}
          <motion.header
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            {/* Category Badge */}
            {post.category && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
              >
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-400 border border-cyan-400/30">
                  <Tag size={14} className="mr-2" />
                  {post.category}
                </span>
              </motion.div>
            )}

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight"
            >
              {post.title}
            </motion.h1>

            {/* Meta Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center gap-6 text-gray-400 mb-8"
            >
              {post.date && (
                <div className="flex items-center space-x-2">
                  <Calendar size={18} className="text-cyan-400" />
                  <span className="font-medium">{post.date}</span>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <Clock size={18} className="text-cyan-400" />
                <span className="font-medium">
                  {post.readTime || estimatedReadTime} min read
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <BookOpen size={18} className="text-cyan-400" />
                <span className="font-medium">Article</span>
              </div>
            </motion.div>

            {/* Author & Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 p-6 bg-gradient-to-r from-[#112240]/80 to-[#1a2f4a]/80 backdrop-blur-sm rounded-2xl border border-gray-700/50"
            >
              {/* Author Info */}
              {post.author && (
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-cyan-400/30">
                    <img
                      src={post.author.avatar}
                      alt={`${post.author.name} - Author`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <User size={16} className="text-cyan-400" />
                      <span className="text-white font-semibold">{post.author.name}</span>
                    </div>
                    <p className="text-gray-400 text-sm">Author</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center space-x-4">
                <motion.button
                  onClick={shareArticle}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-400 rounded-xl border border-cyan-400/30 hover:bg-cyan-500/30 transition-all duration-300"
                  aria-label="Share this article"
                >
                  <Share2 size={18} />
                  <span className="font-medium">Share</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.header>

          {/* Featured Image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-12"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800 animate-pulse z-10">
                  <div className="w-12 h-12 border-4 border-t-transparent border-cyan-400 rounded-full animate-spin"></div>
                </div>
              )}
              
              <motion.img
                src={post.image}
                alt={`${post.title} - Featured image`}
                loading="lazy"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ 
                  opacity: imageLoaded ? 1 : 0, 
                  scale: imageLoaded ? 1 : 1.1 
                }}
                transition={{ duration: 0.8 }}
                onLoad={() => setImageLoaded(true)}
                className="w-full max-h-[500px] object-cover"
              />
              
              {/* Image Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </div>
          </motion.div>

          {/* Article Content */}
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="prose prose-lg prose-invert max-w-none"
          >
            <div
              dangerouslySetInnerHTML={{ __html: post.content }}
              className="text-gray-300 leading-relaxed space-y-6 [&>h1]:text-white [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:mb-6 [&>h1]:mt-8 [&>h2]:text-white [&>h2]:text-2xl [&>h2]:font-semibold [&>h2]:mb-4 [&>h2]:mt-6 [&>h3]:text-white [&>h3]:text-xl [&>h3]:font-medium [&>h3]:mb-3 [&>h3]:mt-4 [&>p]:mb-4 [&>p]:text-gray-300 [&>p]:leading-relaxed [&>ul]:space-y-2 [&>ol]:space-y-2 [&>li]:text-gray-300 [&>blockquote]:border-l-4 [&>blockquote]:border-cyan-400 [&>blockquote]:pl-6 [&>blockquote]:italic [&>blockquote]:text-gray-400 [&>code]:bg-gray-800 [&>code]:px-2 [&>code]:py-1 [&>code]:rounded [&>code]:text-cyan-400 [&>pre]:bg-gray-900 [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:overflow-x-auto [&>a]:text-cyan-400 [&>a]:hover:text-cyan-300 [&>a]:underline"
            />
          </motion.article>

          {/* Article Footer */}
          <motion.footer
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-16 pt-8 border-t border-gray-700/50"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-6">
              <div className="flex items-center justify-center space-x-2 text-gray-400">
                <Eye size={18} />
                <span>Reading time: {post.readTime || estimatedReadTime} minutes</span>
              </div>
            </div>
          </motion.footer>

          {/* Related Articles Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-20"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Continue Reading</h2>
              <p className="text-gray-400 mb-8">Explore more articles and insights</p>
              <Link
                to="/blog"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl hover:shadow-xl transition-all duration-300 font-semibold"
                aria-label="View all blog articles"
              >
                <BookOpen size={20} className="mr-2" />
                View All Articles
              </Link>
            </div>
          </motion.section>
        </div>
      </div>
    </>
  );
};

// Skeleton Component
const BlogDetailSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-[#0a192f] via-[#0f1419] to-[#0a192f]">
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="animate-pulse">
        {/* Back button skeleton */}
        <div className="h-6 w-32 bg-gray-700 rounded mb-8"></div>
        
        {/* Header skeleton */}
        <div className="mb-12">
          <div className="h-4 w-24 bg-gray-700 rounded mb-6"></div>
          <div className="h-12 w-3/4 bg-gray-700 rounded mb-8"></div>
          <div className="flex space-x-6 mb-8">
            <div className="h-4 w-24 bg-gray-700 rounded"></div>
            <div className="h-4 w-20 bg-gray-700 rounded"></div>
            <div className="h-4 w-16 bg-gray-700 rounded"></div>
          </div>
          <div className="h-20 bg-gray-700 rounded-2xl"></div>
        </div>
        
        {/* Image skeleton */}
        <div className="h-80 bg-gray-700 rounded-2xl mb-12"></div>
        
        {/* Content skeleton */}
        <div className="space-y-4">
          {Array(8).fill(null).map((_, i) => (
            <div key={i} className="h-4 bg-gray-700 rounded w-full"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Not Found Component
const BlogNotFound = () => (
  <div className="min-h-screen bg-gradient-to-br from-[#0a192f] via-[#0f1419] to-[#0a192f] flex items-center justify-center">
    <div className="text-center">
      <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center">
        <BookOpen size={32} className="text-gray-400" />
      </div>
      <h1 className="text-4xl font-bold text-white mb-4">Article Not Found</h1>
      <p className="text-gray-400 mb-8 text-lg">The article you're looking for doesn't exist.</p>
      <Link
        to="/blog"
        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl hover:shadow-xl transition-all duration-300 font-semibold"
        aria-label="Back to blog"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Blog
      </Link>
    </div>
  </div>
);

export default BlogDetail;