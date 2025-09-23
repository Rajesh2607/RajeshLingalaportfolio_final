// Script to upload initial data for Who I Am About sections
// Run this script once to populate the database with initial data

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

// Firebase configuration (you'll need to set these environment variables)
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
    console.log('Starting data upload...');
    
    for (const section of whoAboutSections) {
      console.log(`Uploading section: ${section.title}`);
      const docRef = await addDoc(collection(db, 'whoAboutSections'), section);
      console.log(`✅ ${section.title} uploaded with ID: ${docRef.id}`);
    }
    
    console.log('🎉 All data uploaded successfully!');
    console.log('\nCollection Structure:');
    console.log('- Collection: whoAboutSections');
    console.log('- Documents: Each section with the following fields:');
    console.log('  * title: string');
    console.log('  * description: string');
    console.log('  * image: string (URL)');
    console.log('  * icon: string (Palette|Code|LineChart)');
    console.log('  * color: string (css color name)');
    console.log('  * order: number (for ordering)');
    console.log('  * skills: array of strings');
    console.log('  * technologies: array of objects with name and icon fields');
    
  } catch (error) {
    console.error('❌ Error uploading data:', error);
  }
};

// Run the upload
uploadData();

export { whoAboutSections };