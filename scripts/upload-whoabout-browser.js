// Client-side script to upload initial data for Who I Am About sections
// Copy and paste this into your browser console while on your website with Firebase initialized

// Function to upload data to Firebase
const uploadWhoAboutData = async () => {
  // Check if Firebase is available
  if (typeof window.firebase === 'undefined' && typeof window.db === 'undefined') {
    console.error('❌ Firebase is not available. Make sure you\'re on your website with Firebase initialized.');
    return;
  }

  // Get the database instance (adjust based on your Firebase setup)
  const db = window.db || firebase.firestore();
  
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

  try {
    console.log('🚀 Starting data upload to whoAboutSections collection...');
    
    // Import necessary functions if using v9 SDK
    let addDoc, collection;
    if (window.firebase && window.firebase.firestore) {
      // v8 SDK
      for (const section of whoAboutSections) {
        console.log(`📤 Uploading section: ${section.title}`);
        const docRef = await db.collection('whoAboutSections').add(section);
        console.log(`✅ ${section.title} uploaded with ID: ${docRef.id}`);
      }
    } else {
      // v9 SDK - you'll need to make sure these are available
      console.log('Using Firebase v9 SDK...');
      for (const section of whoAboutSections) {
        console.log(`📤 Uploading section: ${section.title}`);
        // This assumes you have imported { addDoc, collection } and have db available
        const docRef = await addDoc(collection(db, 'whoAboutSections'), section);
        console.log(`✅ ${section.title} uploaded with ID: ${docRef.id}`);
      }
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
    
  } catch (error) {
    console.error('❌ Error uploading data:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure you\'re logged in as an admin');
    console.log('2. Check your Firebase security rules');
    console.log('3. Verify your internet connection');
    console.log('4. Check the browser console for more detailed errors');
  }
};

// Instructions for use
console.log(`
🚀 WHO I AM ABOUT SECTIONS UPLOAD SCRIPT
========================================

To upload the initial data for the Who I Am About sections:

1. Make sure you're on your website with Firebase initialized
2. Open the browser console (F12 → Console tab)
3. Paste this entire script and press Enter
4. Run the upload function by typing: uploadWhoAboutData()

This will create the 'whoAboutSections' collection with initial data.
`);

// Make the function available globally
window.uploadWhoAboutData = uploadWhoAboutData;

// Auto-run the upload function
// uploadWhoAboutData();