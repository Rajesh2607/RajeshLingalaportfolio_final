// Simple script to upload data using Firebase Client SDK
// This script uses your existing Firebase config and runs in a Node.js environment

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Firebase configuration (using your existing env variables)
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
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

async function uploadData() {
  try {
    console.log('🚀 Starting data upload to whoAboutSections collection...');
    
    // Check if collection already has data
    const existingData = await getDocs(collection(db, 'whoAboutSections'));
    
    if (!existingData.empty) {
      console.log(`⚠️  Collection already has ${existingData.size} documents.`);
      console.log('Skipping upload to avoid duplicates.');
      console.log('💡 Use the admin panel to manage existing data or manually clear the collection first.');
      return;
    }
    
    let successCount = 0;
    
    for (const section of whoAboutSections) {
      console.log(`📤 Uploading section: ${section.title}`);
      
      try {
        const docRef = await addDoc(collection(db, 'whoAboutSections'), {
          ...section,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        
        console.log(`✅ ${section.title} uploaded with ID: ${docRef.id}`);
        successCount++;
      } catch (error) {
        console.error(`❌ Failed to upload ${section.title}:`, error.message);
      }
    }
    
    console.log(`\n🎉 ${successCount}/${whoAboutSections.length} sections uploaded successfully!`);
    
    console.log('\n📋 Collection Structure Created:');
    console.log('Collection: whoAboutSections');
    console.log('Documents with fields: title, description, image, icon, color, order, skills[], technologies[]');
    console.log('\n✨ You can now use the WhoAboutManager in the admin panel!');
    
  } catch (error) {
    console.error('❌ Error uploading data:', error);
    
    if (error.code === 'permission-denied') {
      console.log('\n🔒 Permission denied. You may need to be authenticated.');
      console.log('Try using the browser console method instead.');
    } else {
      console.log('\n🔧 Error details:', error.message);
    }
  }
}

// Run the upload
uploadData()
  .then(() => {
    console.log('\n🏁 Script completed.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });