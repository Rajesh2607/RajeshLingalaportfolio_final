import React, { useState, useEffect } from 'react';
import { db, storage, auth } from '../../../firebase/config';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { onAuthStateChanged } from 'firebase/auth';
import { User, Upload, Save, X, Plus, AlertCircle, CheckCircle, Image as ImageIcon, Sparkles, FileText, Link as LinkIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AboutManager = () => {
  const [about, setAbout] = useState({
    title: [],
    description: '',
    profilePic: '',
    resume: '',
  });
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // Check authentication state
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      if (currentUser) {
        fetchAboutData();
      } else {
        setLoading(false);
        showNotification('error', 'Please log in to access this feature');
      }
    });

    
    return () => unsubscribe();
  }, []);

  const fetchAboutData = async () => {
    try {
      const docRef = doc(db, 'content', 'about');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setAbout({
          title: Array.isArray(data.title) ? data.title : (data.title ? [data.title] : []),
          description: data.description || '',
          profilePic: data.profilePic || '',
          resume: data.resume || '',
        });
        setPreviewUrl(data.profilePic || '');
      } else {
        // Initialize with empty data if document doesn't exist
        console.log('Document does not exist, initializing with empty data');
        setAbout({
          title: [],
          description: '',
          profilePic: '',
          resume: '',
        });
        setPreviewUrl('');
      }
    } catch (error) {
      console.error('Error fetching about data:', error);
      showNotification('error', `Failed to load data: ${error.message}`);
      
      // Initialize with empty data on error
      setAbout({
        title: [],
        description: '',
        profilePic: '',
        resume: '',
      });
      setPreviewUrl('');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: '', message: '' }), 5000);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        showNotification('error', 'Please select a valid image file');
        return;
      }
      
      if (selectedFile.size > 5 * 1024 * 1024) {
        showNotification('error', 'File size must be less than 5MB');
        return;
      }

      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSave = async () => {
    // Check if user is authenticated
    if (!user) {
      showNotification('error', 'You must be logged in to save changes');
      return;
    }

    setSaving(true);
    setUploadProgress(0);
    
    try {
      let profilePicUrl = about.profilePic;

      // Upload image if there's a new file
      if (file) {
        setUploadProgress(25);
        const storageRef = ref(storage, `profile/${user.uid}-${Date.now()}-${file.name}`);
        await uploadBytes(storageRef, file);
        setUploadProgress(75);
        profilePicUrl = await getDownloadURL(storageRef);
        setUploadProgress(100);
      }

      const docRef = doc(db, 'content', 'about');
      
      // Prepare the data to save
      const dataToSave = {
        title: about.title,
        description: about.description || '',
        profilePic: profilePicUrl || '',
        resume: about.resume || '',
        updatedAt: new Date().toISOString(),
        updatedBy: user.uid
      };

      console.log('Current user:', user.email);
      console.log('Saving data:', dataToSave);
      
      // Try updateDoc first
      try {
        await updateDoc(docRef, dataToSave);
        showNotification('success', 'About section updated successfully!');
      } catch (updateError) {
        if (updateError.code === 'not-found') {
          // Document doesn't exist, create it
          console.log('Document not found, creating new one...');
          await setDoc(docRef, dataToSave);
          showNotification('success', 'About section created successfully!');
        } else {
          throw updateError;
        }
      }

      setFile(null);
      
      // Refresh data to ensure consistency
      await fetchAboutData();
      
    } catch (error) {
      console.error('Error updating about section:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      // More specific error messages
      if (error.code === 'permission-denied') {
        showNotification('error', 'Permission denied. Please check if you have admin access or contact the administrator.');
      } else if (error.code === 'unauthenticated') {
        showNotification('error', 'Authentication required. Please log in again.');
      } else if (error.code === 'unavailable') {
        showNotification('error', 'Service temporarily unavailable. Please try again later.');
      } else {
        showNotification('error', `Failed to update: ${error.message}`);
      }
    } finally {
      setSaving(false);
      setUploadProgress(0);
    }
  };

  const handleAddTitle = () => {
    if (newTitle.trim() !== '') {
      setAbout({ ...about, title: [...about.title, newTitle.trim()] });
      setNewTitle('');
    }
  };

  const handleRemoveTitle = (index) => {
    const updatedTitles = about.title.filter((_, i) => i !== index);
    setAbout({ ...about, title: updatedTitles });
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Authentication Required</h3>
          <p className="text-gray-400">Please log in to access the About Manager</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Notification */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-2xl flex items-center space-x-3 backdrop-blur-xl border ${
              notification.type === 'success' 
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' 
                : 'bg-red-500/20 border-red-500/50 text-red-300'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <span className="font-medium">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-2xl p-6 border border-purple-500/30 backdrop-blur-xl"
      >
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-cyan-400 rounded-xl flex items-center justify-center">
            <User size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles size={20} className="text-purple-400" />
              About Section Management
            </h2>
            <p className="text-gray-300">Manage your personal information and profile</p>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Picture Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-xl"
        >
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
            <ImageIcon size={20} className="mr-2 text-cyan-400" />
            Profile Picture
          </h3>
          
          <div className="space-y-6">
            {/* Image Preview */}
            <div className="flex justify-center">
              <div className="relative w-48 h-48 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800 border-2 border-dashed border-gray-600 group">
                {previewUrl ? (
                  <img 
                    src={previewUrl} 
                    alt="Profile Preview" 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <User size={48} className="text-gray-400" />
                  </div>
                )}
                
                {/* Upload Overlay */}
                <label className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center">
                  <div className="text-center text-white">
                    <Upload size={24} className="mx-auto mb-2" />
                    <span className="text-sm font-medium">Change Photo</span>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>

            {/* Upload Progress */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-400 to-cyan-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* File Info */}
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-2">
                Recommended: Square image, at least 400x400px
              </p>
              <p className="text-xs text-gray-500">
                Supported formats: JPG, PNG, GIF (Max 5MB)
              </p>
            </div>
          </div>
        </motion.div>

        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Titles Section */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Sparkles size={18} className="mr-2 text-purple-400" />
              Professional Titles
            </h3>
            
            {/* Add New Title */}
            <div className="flex space-x-2 mb-4">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTitle()}
                className="flex-1 px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm"
                placeholder="Add new title (e.g., Full Stack Developer)"
              />
              <button
                type="button"
                onClick={handleAddTitle}
                disabled={!newTitle.trim()}
                className="px-4 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <Plus size={18} />
              </button>
            </div>

            {/* Title List */}
            <div className="space-y-2 max-h-40 overflow-y-auto">
              <AnimatePresence>
                {about.title.map((title, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center justify-between bg-slate-900/50 p-3 rounded-xl border border-slate-600/50 backdrop-blur-sm"
                  >
                    <span className="text-white flex-1">{title}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTitle(index)}
                      className="text-red-400 hover:text-red-300 p-1 hover:bg-red-500/10 rounded transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Description */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <FileText size={18} className="mr-2 text-cyan-400" />
              Description
            </h3>
            <textarea
              value={about.description}
              onChange={(e) => setAbout({ ...about, description: e.target.value })}
              rows={6}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent resize-none backdrop-blur-sm"
              placeholder="Write a compelling description about yourself..."
            />
            <div className="mt-2 text-right">
              <span className="text-xs text-gray-400">
                {about.description.length} characters
              </span>
            </div>
          </div>

          {/* Resume URL */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <LinkIcon size={18} className="mr-2 text-emerald-400" />
              Resume URL
            </h3>
            <input
              type="url"
              value={about.resume}
              onChange={(e) => setAbout({ ...about, resume: e.target.value })}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent backdrop-blur-sm"
              placeholder="https://yourdomain.com/your-resume.pdf"
            />
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-gray-400">
                Enter a valid URL to your resume (PDF, Google Drive, etc.)
              </span>
              {about.resume && (
                <a
                  href={about.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-emerald-400 hover:text-emerald-300 underline"
                >
                  Test Link
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center"
      >
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-2xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
              Saving Changes...
            </>
          ) : (
            <>
              <Save className="mr-2" size={20} />
              Save Changes
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
};

export default AboutManager;