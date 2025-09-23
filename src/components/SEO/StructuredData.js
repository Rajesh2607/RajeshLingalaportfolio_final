// Structured Data Schemas for SEO

export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Rajesh Lingala",
  "url": "https://rajeshlingala-portfolio.vercel.app",
  "image": "https://firebasestorage.googleapis.com/v0/b/myprofolio-34d7c.firebasestorage.app/o/profile%2FWhatsApp%20Image%202025-04-20%20at%2018.48.10_4a2d17cb.jpg?alt=media&token=5ac51520-47e7-4799-ab7a-439ef0a4efc2",
  "jobTitle": "Frontend React Developer",
  "worksFor": {
    "@type": "Organization",
    "name": "Freelancer"
  },
  "alumniOf": {
    "@type": "EducationalOrganization",
    "name": "Vishnu Institute of Technology"
  },
  "knowsAbout": [
    "React.js",
    "JavaScript",
    "Frontend Development",
    "Web Development",
    "UI/UX Design",
    "Node.js",
    "MongoDB",
    "Express.js"
  ],
  "sameAs": [
    "https://github.com/Rajesh2607",
    "https://www.linkedin.com/in/lingala-rajesh-03a336280",
    "https://www.behance.net/lingalarajesh"
  ],
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Gundugolanu",
    "addressRegion": "Andhra Pradesh",
    "addressCountry": "India"
  },
  "email": "rajeshlingala26072005@gmail.com",
  "telephone": "+919398207530"
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Rajesh Lingala Portfolio",
  "url": "https://rajeshlingala-portfolio.vercel.app",
  "description": "Official portfolio of Rajesh Lingala – a skilled Frontend Developer and React Developer from India.",
  "author": {
    "@type": "Person",
    "name": "Rajesh Lingala"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://rajeshlingala-portfolio.vercel.app/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

export const portfolioSchema = {
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": "Rajesh Lingala Portfolio",
  "description": "A comprehensive portfolio showcasing frontend development projects, skills, and professional experience.",
  "author": {
    "@type": "Person",
    "name": "Rajesh Lingala"
  },
  "dateCreated": "2024-01-01",
  "dateModified": new Date().toISOString(),
  "url": "https://rajeshlingala-portfolio.vercel.app",
  "image": "https://firebasestorage.googleapis.com/v0/b/myprofolio-34d7c.firebasestorage.app/o/profile%2FWhatsApp%20Image%202025-04-20%20at%2018.48.10_4a2d17cb.jpg?alt=media&token=5ac51520-47e7-4799-ab7a-439ef0a4efc2",
  "genre": "Portfolio",
  "keywords": "Frontend Development, React, JavaScript, Web Development, Portfolio"
};

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Rajesh Lingala - Frontend Developer",
  "url": "https://rajeshlingala-portfolio.vercel.app",
  "logo": "https://rajeshlingala-portfolio.vercel.app/images/icon1.jpg",
  "description": "Professional frontend development services specializing in React.js and modern web technologies.",
  "founder": {
    "@type": "Person",
    "name": "Rajesh Lingala"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+919398207530",
    "contactType": "customer service",
    "email": "rajeshlingala26072005@gmail.com"
  },
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Gundugolanu",
    "addressRegion": "Andhra Pradesh",
    "addressCountry": "India"
  },
  "sameAs": [
    "https://github.com/Rajesh2607",
    "https://www.linkedin.com/in/lingala-rajesh-03a336280",
    "https://www.behance.net/lingalarajesh"
  ]
};

export const breadcrumbSchema = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

export const projectSchema = (project) => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": project.title,
  "description": project.description,
  "url": project.live || project.github,
  "author": {
    "@type": "Person",
    "name": "Rajesh Lingala"
  },
  "programmingLanguage": project.technologies,
  "codeRepository": project.github,
  "applicationCategory": "WebApplication",
  "operatingSystem": "Web Browser",
  "dateCreated": project.dateCreated || "2024-01-01",
  "image": project.media
});

export const blogPostSchema = (post) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": post.title,
  "description": post.description || post.content?.substring(0, 160),
  "image": post.image,
  "author": {
    "@type": "Person",
    "name": post.author?.name || "Rajesh Lingala",
    "image": post.author?.avatar
  },
  "publisher": {
    "@type": "Organization",
    "name": "Rajesh Lingala Portfolio",
    "logo": {
      "@type": "ImageObject",
      "url": "https://rajeshlingala-portfolio.vercel.app/images/icon1.jpg"
    }
  },
  "datePublished": post.date,
  "dateModified": post.dateModified || post.date,
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": `https://rajeshlingala-portfolio.vercel.app/blog/${post.id}`
  },
  "articleSection": post.category,
  "keywords": post.tags || [post.category],
  "wordCount": post.content ? post.content.replace(/<[^>]*>/g, '').split(' ').length : 0,
  "timeRequired": `PT${post.readTime || 5}M`
});

export const certificateSchema = (certificate) => ({
  "@context": "https://schema.org",
  "@type": "EducationalOccupationalCredential",
  "name": certificate.title,
  "description": `Professional certificate in ${certificate.title}`,
  "credentialCategory": "Certificate",
  "recognizedBy": {
    "@type": "Organization",
    "name": certificate.issuer
  },
  "dateCreated": certificate.date,
  "credentialId": certificate.credentialId,
  "url": certificate.link,
  "image": certificate.image,
  "about": certificate.domain,
  "educationalLevel": "Professional"
});