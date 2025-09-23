import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEOHead = ({
  title = "Rajesh Lingala | Frontend React Developer Portfolio",
  description = "Official portfolio of Rajesh Lingala – a skilled Frontend Developer and React Developer from India. View projects, skills, certificates, and career highlights.",
  keywords = "Rajesh Lingala, Frontend Developer, React Developer, Portfolio, JavaScript, Web Developer, Developer India, Personal Website, Projects, Skills",
  image = "https://firebasestorage.googleapis.com/v0/b/myprofolio-34d7c.firebasestorage.app/o/profile%2FWhatsApp%20Image%202025-04-20%20at%2018.48.10_4a2d17cb.jpg?alt=media&token=5ac51520-47e7-4799-ab7a-439ef0a4efc2",
  url = "https://rajeshlingala-portfolio.vercel.app",
  type = "website",
  author = "Rajesh Lingala",
  publishedTime,
  modifiedTime,
  section,
  tags = [],
  canonical,
  noindex = false,
  nofollow = false,
  structuredData
}) => {
  const fullTitle = title.includes('Rajesh Lingala') ? title : `${title} | Rajesh Lingala`;
  const canonicalUrl = canonical || url;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="English" />
      <meta name="robots" content={`${noindex ? 'noindex' : 'index'}, ${nofollow ? 'nofollow' : 'follow'}`} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="Rajesh Lingala Portfolio" />
      <meta property="og:locale" content="en_US" />
      
      {/* Article specific Open Graph tags */}
      {type === 'article' && (
        <>
          <meta property="article:author" content={author} />
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {section && <meta property="article:section" content={section} />}
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:creator" content="@rajeshlingala" />
      <meta name="twitter:site" content="@rajeshlingala" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#17c0f8" />
      <meta name="msapplication-TileColor" content="#17c0f8" />
      <meta name="application-name" content="Rajesh Lingala Portfolio" />
      <meta name="apple-mobile-web-app-title" content="Rajesh Lingala" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;