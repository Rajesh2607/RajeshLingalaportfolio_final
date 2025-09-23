// Node.js script to upload initial data for Who I Am About sections
// Run with: node scripts/upload-whoabout-data-node.js

const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin SDK
// You'll need to download the service account key and set the path
const serviceAccount = require('../firebase-service-account-key.json'); // You'll need to add this file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: process.env.VITE_FIREBASE_PROJECT_ID
});

const db = admin.firestore();

// Initial data for Who I Am About sections
const whoAboutSections = [
  {
    title: "UX Design",
    description: "Creating user-centered designs with intuitive navigation and interactions that provide meaningful and relevant experiences to users.",
    image: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg",
    icon: "Palette",
    color: "cyan",
    order: 1,
    skills: [
      "Creating user-centered designs with intuitive navigation and interactions",
      "Conducting user research and usability testing to improve experiences",
      "Developing high-fidelity prototypes and design systems"
    ],
    technologies: [
      {
        name: "Figma",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg"
      },
      {
        name: "Adobe XD",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/xd/xd-plain.svg"
      },
      {
        name: "Sketch",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sketch/sketch-original.svg"
      }
    ]
  },
  {
    title: "Full Stack Development",
    description: "Building modern, scalable web applications from frontend to backend using cutting-edge technologies and best practices.",
    image: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg",
    icon: "Code",
    color: "purple",
    order: 2,
    skills: [
      "Building responsive website front end using React-Redux",
      "Developing mobile applications using Flutter, React Native",
      "Creating application backend in Node, Express"
    ],
    technologies: [
      {
        name: "HTML5",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg"
      },
      {
        name: "CSS3",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg"
      },
      {
        name: "JavaScript",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg"
      },
      {
        name: "React",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
      },
      {
        name: "Node.js",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg"
      }
    ]
  },
  {
    title: "Data Analysis",
    description: "Extracting meaningful insights from complex datasets using statistical analysis, machine learning, and data visualization techniques.",
    image: "https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg",
    icon: "LineChart",
    color: "blue",
    order: 3,
    skills: [
      "Analyzing complex datasets to extract meaningful insights",
      "Creating data visualization and interactive dashboards",
      "Implementing machine learning models for predictive analytics"
    ],
    technologies: [
      {
        name: "Python",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg"
      },
      {
        name: "Pandas",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg"
      },
      {
        name: "TensorFlow",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg"
      },
      {
        name: "PostgreSQL",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg"
      }
    ]
  }
];

const uploadData = async () => {
  try {
    console.log('🚀 Starting data upload to whoAboutSections collection...');
    
    for (const section of whoAboutSections) {
      console.log(`📤 Uploading section: ${section.title}`);
      const docRef = await db.collection('whoAboutSections').add(section);
      console.log(`✅ ${section.title} uploaded with ID: ${docRef.id}`);
    }
    
    console.log('\n🎉 All data uploaded successfully!');
    console.log('\n📋 Collection Structure Created:');
    console.log('┌─ Collection: whoAboutSections');
    console.log('├─ Documents: Each section with the following fields:');
    console.log('│  ├─ title: string');
    console.log('│  ├─ description: string');
    console.log('│  ├─ image: string (URL)');
    console.log('│  ├─ icon: string (Palette|Code|LineChart)');
    console.log('│  ├─ color: string (css color name)');
    console.log('│  ├─ order: number (for ordering)');
    console.log('│  ├─ skills: array of strings');
    console.log('│  └─ technologies: array of objects with name and icon fields');
    console.log('\n✨ You can now use the WhoAboutManager in the admin panel to manage these sections!');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error uploading data:', error);
    process.exit(1);
  }
};

// Run the upload
uploadData();