# 🚀 Rajesh Lingala - Portfolio Website

A modern, responsive portfolio website built with React, showcasing professional projects, skills, certifications, and blog posts. Features a comprehensive admin panel for content management and SEO optimization.

## 🌟 Features

### 🎨 **Frontend Features**
- **Modern Design**: Clean, professional UI with smooth animations
- **Responsive Layout**: Optimized for all devices (mobile, tablet, desktop)
- **Dark Theme**: Elegant dark color scheme with gradient accents
- **Interactive Components**: Hover effects, transitions, and micro-interactions
- **SEO Optimized**: Meta tags, structured data, and performance optimization
- **Fast Loading**: Optimized images, lazy loading, and code splitting

### 📱 **Pages & Sections**
- **Home**: Hero section, about, skills, experience, and contact
- **Who I Am**: Personal story, education, achievements, and social links
- **Projects**: Portfolio showcase with filtering and detailed modals
- **Certificates**: Professional certifications organized by domain
- **Blog**: Articles with rich content and reading time estimation
- **Contact**: Interactive contact form with EmailJS integration

### 🔧 **Admin Panel**
- **Dashboard**: Real-time statistics and recent activity tracking
- **Content Management**: CRUD operations for all content types
- **Media Upload**: Firebase Storage integration for images/videos
- **Blog Editor**: Rich text editor with image upload capabilities
- **User Authentication**: Secure admin access with Firebase Auth
- **Real-time Updates**: Live data synchronization

### 🚀 **Technical Features**
- **React 18**: Latest React features with hooks and context
- **Firebase Integration**: Firestore, Authentication, Storage, and Analytics
- **Responsive Design**: Tailwind CSS with custom animations
- **Performance**: Optimized loading, caching, and bundle splitting
- **SEO**: Structured data, meta tags, and sitemap generation
- **Email Service**: Contact form with EmailJS integration

## 🛠️ Tech Stack

### **Frontend**
- **React 18** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icon library

### **Backend & Services**
- **Firebase Firestore** - NoSQL database for content storage
- **Firebase Authentication** - User authentication and authorization
- **Firebase Storage** - File storage for images and media
- **Firebase Analytics** - User behavior tracking
- **EmailJS** - Contact form email service

### **Development Tools**
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing and optimization
- **React Helmet Async** - SEO meta tag management
- **React Quill** - Rich text editor for blog posts

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **Firebase Project** with Firestore, Authentication, and Storage enabled
- **EmailJS Account** for contact form functionality

## 🚀 Quick Start

### 1. **Clone the Repository**
```bash
git clone https://github.com/Rajesh2607/portfolio.git
cd portfolio
```

### 2. **Install Dependencies**
```bash
npm install
# or
yarn install
```

### 3. **Environment Setup**
Create a `.env` file in the root directory:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 4. **Firebase Setup**

#### **Firestore Database**
Create the following collections in Firestore:

```javascript
// Collections Structure
├── content/
│   └── about (document)
├── projects/ (collection)
├── certificates/ (collection)
├── blogs/ (collection)
├── experiences/ (collection)
├── achievements/ (collection)
├── educations/ (collection)
├── skills/ (collection)
├── socialLinks/ (collection)
├── hero/ (collection)
└── admins/ (collection)
```

#### **Authentication Setup**
1. Enable Email/Password authentication in Firebase Console
2. Add admin emails to the `admins` collection:
```javascript
// Document in 'admins' collection
{
  email: "admin@example.com"
}
```

#### **Storage Setup**
1. Enable Firebase Storage
2. Set up security rules for file uploads
3. Create folders: `profile/`, `project_media/`, `BLOG_IMAGES/`, `hero-images/`

### 5. **EmailJS Setup**
1. Create an EmailJS account
2. Set up email service and template
3. Update EmailJS configuration in `src/components/home/Contact.jsx`

### 6. **Run Development Server**
```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:5173` to view the application.

## 📁 Project Structure

```
portfolio/
├── public/
│   ├── images/           # Static images
│   ├── robots.txt        # SEO robots file
│   └── sitemap.xml       # SEO sitemap
├── src/
│   ├── components/       # Reusable components
│   │   ├── home/         # Home page components
│   │   ├── whoIam/       # About page components
│   │   ├── skeleton/     # Loading skeletons
│   │   └── SEO/          # SEO components
│   ├── pages/            # Main pages
│   │   └── admin/        # Admin panel pages
│   ├── firebase/         # Firebase configuration
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   └── styles/           # CSS files
├── scripts/              # Build scripts
└── docs/                 # Documentation
```

## 🔧 Configuration

### **Firebase Security Rules**

#### **Firestore Rules**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read access for portfolio content
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/admins/$(request.auth.token.email));
    }
  }
}
```

#### **Storage Rules**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### **Environment Variables**
All environment variables should be prefixed with `VITE_` for Vite to recognize them:

| Variable | Description |
|----------|-------------|
| `VITE_FIREBASE_API_KEY` | Firebase API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |
| `VITE_FIREBASE_MEASUREMENT_ID` | Firebase analytics measurement ID |

## 🚀 Deployment

### **Vercel Deployment** (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### **Manual Deployment**
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### **Other Platforms**
- **Netlify**: Drag and drop `dist` folder
- **Firebase Hosting**: Use Firebase CLI
- **GitHub Pages**: Use GitHub Actions

## 📊 SEO Features

### **Implemented SEO Optimizations**
- ✅ **Meta Tags**: Dynamic title, description, and keywords
- ✅ **Open Graph**: Social media sharing optimization
- ✅ **Twitter Cards**: Twitter-specific meta tags
- ✅ **Structured Data**: JSON-LD schema markup
- ✅ **Sitemap**: Auto-generated XML sitemap
- ✅ **Robots.txt**: Search engine crawling instructions
- ✅ **Canonical URLs**: Prevent duplicate content issues
- ✅ **Performance**: Optimized loading and Core Web Vitals

### **SEO Components**
- `SEOHead`: Dynamic meta tag management
- `StructuredData`: Schema.org markup
- `generateSitemap`: Automatic sitemap generation

## 🔐 Admin Panel

### **Access Admin Panel**
1. Navigate to `/admin/login`
2. Sign in with admin credentials
3. Access dashboard at `/admin`

### **Admin Features**
- **Dashboard**: Statistics and recent activity
- **Content Management**: Add/edit/delete content
- **Media Upload**: Image and video management
- **Blog Editor**: Rich text editing with media
- **User Management**: Admin access control

### **Admin Routes**
- `/admin/login` - Admin login page
- `/admin` - Main dashboard
- `/admin/*` - Protected admin routes

## 🎨 Customization

### **Colors & Themes**
Update colors in `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: '#17c0f8',
      secondary: '#0a192f',
      accent: '#112240'
    }
  }
}
```

### **Fonts**
Fonts are loaded from Google Fonts in `index.html`:
- **Inter**: Main content font
- **Almere Script**: Decorative font

### **Animations**
Custom animations are defined in Tailwind config and Framer Motion components.

## 📱 Performance

### **Optimization Techniques**
- **Code Splitting**: Dynamic imports for routes
- **Lazy Loading**: Images and components
- **Caching**: Browser and CDN caching
- **Compression**: Gzip and Brotli compression
- **Minification**: CSS and JavaScript minification

### **Performance Metrics**
- **Lighthouse Score**: 95+ across all categories
- **Core Web Vitals**: Optimized LCP, FID, and CLS
- **Bundle Size**: Optimized with tree shaking

## 🧪 Testing

### **Run Tests**
```bash
# Run unit tests
npm test

# Run with coverage
npm run test:coverage

# Run e2e tests
npm run test:e2e
```

### **Testing Stack**
- **Vitest**: Unit testing framework
- **React Testing Library**: Component testing
- **Cypress**: End-to-end testing

## 🤝 Contributing

### **Development Workflow**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### **Code Standards**
- Follow ESLint configuration
- Use Prettier for code formatting
- Write meaningful commit messages
- Add tests for new features

### **Pull Request Guidelines**
- Describe changes clearly
- Include screenshots for UI changes
- Ensure all tests pass
- Update documentation if needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Rajesh Lingala**
- Portfolio: [https://rajeshlingala-portfolio.vercel.app](https://rajeshlingala-portfolio.vercel.app)
- GitHub: [@Rajesh2607](https://github.com/Rajesh2607)
- LinkedIn: [Lingala Rajesh](https://www.linkedin.com/in/lingala-rajesh-03a336280)
- Email: rajeshlingala26072005@gmail.com

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Firebase** for backend services
- **Tailwind CSS** for the utility-first CSS framework
- **Framer Motion** for smooth animations
- **Vercel** for hosting and deployment
- **Open Source Community** for inspiration and resources

## 📞 Support

If you have any questions or need help with setup:

1. **Check Documentation**: Review this README and inline comments
2. **Search Issues**: Look for existing GitHub issues
3. **Create Issue**: Open a new issue with detailed description
4. **Contact**: Reach out via email or LinkedIn

## 🔄 Changelog

### **Version 2.0.0** (Latest)
- ✨ Enhanced admin panel with real-time dashboard
- 🚀 Improved SEO optimization
- 📱 Better mobile responsiveness
- 🎨 Updated UI/UX design
- 🔧 Performance optimizations

### **Version 1.0.0**
- 🎉 Initial release
- 📝 Basic portfolio functionality
- 🔐 Admin panel implementation
- 📊 Firebase integration

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/Rajesh2607">Rajesh Lingala</a></p>
  <p>⭐ Star this repo if you found it helpful!</p>
</div>