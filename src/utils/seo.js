// SEO Utility Functions

export const generateMetaDescription = (content, maxLength = 160) => {
  if (!content) return '';
  
  // Remove HTML tags and extra whitespace
  const cleanContent = content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  
  if (cleanContent.length <= maxLength) {
    return cleanContent;
  }
  
  // Truncate at word boundary
  const truncated = cleanContent.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
};

export const generateKeywords = (content, additionalKeywords = []) => {
  const baseKeywords = [
    'Rajesh Lingala',
    'Frontend Developer',
    'React Developer',
    'JavaScript',
    'Web Developer',
    'Portfolio',
    'India'
  ];
  
  return [...baseKeywords, ...additionalKeywords].join(', ');
};

export const generateCanonicalUrl = (path = '') => {
  const baseUrl = 'https://rajeshlingala-portfolio.vercel.app';
  return `${baseUrl}${path}`;
};

export const generateImageUrl = (imagePath) => {
  if (!imagePath) return 'https://rajeshlingala-portfolio.vercel.app/images/icon1.jpg';
  
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  return `https://rajeshlingala-portfolio.vercel.app${imagePath}`;
};

export const formatDateForSEO = (date) => {
  if (!date) return new Date().toISOString();
  
  if (typeof date === 'string') {
    return new Date(date).toISOString();
  }
  
  return date.toISOString();
};

export const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
};

export const extractTextFromHTML = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
};

export const calculateReadingTime = (content) => {
  if (!content) return 1;
  
  const wordsPerMinute = 200;
  const words = extractTextFromHTML(content).split(' ').length;
  const readingTime = Math.ceil(words / wordsPerMinute);
  
  return Math.max(1, readingTime);
};

export const generateBreadcrumbs = (pathname) => {
  const paths = pathname.split('/').filter(Boolean);
  const breadcrumbs = [
    { name: 'Home', url: 'https://rajeshlingala-portfolio.vercel.app/' }
  ];
  
  let currentPath = '';
  paths.forEach((path, index) => {
    currentPath += `/${path}`;
    const name = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
    breadcrumbs.push({
      name,
      url: `https://rajeshlingala-portfolio.vercel.app${currentPath}`
    });
  });
  
  return breadcrumbs;
};

// Performance optimization utilities
export const preloadCriticalResources = () => {
  // Preload critical fonts
  const fontLink = document.createElement('link');
  fontLink.rel = 'preload';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap';
  fontLink.as = 'style';
  document.head.appendChild(fontLink);
  
  // Preload critical images
  const criticalImages = [
    '/images/icon1.jpg',
    '/images/Profile.jpg'
  ];
  
  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = src;
    link.as = 'image';
    document.head.appendChild(link);
  });
};

export const addStructuredData = (data) => {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
};

export const removeStructuredData = () => {
  const scripts = document.querySelectorAll('script[type="application/ld+json"]');
  scripts.forEach(script => script.remove());
};