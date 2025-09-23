import React, { useEffect, useState } from 'react';
import { db, storage } from '../../../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FileText, Upload, Save, Image as ImageIcon, Sparkles, User, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HeroManager = () => {
  const [currentSection, setCurrentSection] = useState('Personal');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const sections = [
    { id: 'Personal', label: 'Personal Story', icon: User, color: 'from-blue-400 to-cyan-400' },
    { id: 'Professional', label: 'Professional Story', icon: Briefcase, color: 'from-purple-400 to-pink-400' }
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, 'hero', currentSection);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setDescription(data.description || '');
        setImageUrl(data.imageUrl || '');
        setPreview(null);
        setNewImage(null);
      }
    } catch (error) {
      console.error('Error fetching document:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentSection]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      setNewImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);
      let finalImageUrl = imageUrl;

      if (newImage) {
        const storageRef = ref(storage, `hero-images/${Date.now()}-${newImage.name}`);
        await uploadBytes(storageRef, newImage);
        finalImageUrl = await getDownloadURL(storageRef);
      }

      const docRef = doc(db, 'hero', currentSection);
      await updateDoc(docRef, {
        description,
        imageUrl: finalImageUrl
      });

      alert(`${currentSection} section updated successfully.`);
      fetchData();
    } catch (error) {
      console.error('Error updating document:', error);
      alert('Failed to update document.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl p-6 border border-indigo-500/30 backdrop-blur-xl"
      >
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-xl flex items-center justify-center">
            <FileText size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles size={20} className="text-indigo-400" />
              Hero Section Management
            </h2>
            <p className="text-gray-300">Manage your personal and professional stories</p>
          </div>
        </div>
      </motion.div>

      {/* Section Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-xl"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Select Section</h3>
        <div className="flex gap-4">
          {sections.map((section) => {
            const IconComponent = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setCurrentSection(section.id)}
                className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  currentSection === section.id
                    ? `bg-gradient-to-r ${section.color} text-white shadow-lg`
                    : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50'
                }`}
              >
                <IconComponent size={18} className="mr-2" />
                {section.label}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Content Form */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-xl"
        >
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-6">
                Edit {currentSection} Story
              </h3>

              {/* Description */}
              <div>
                <label className="block text-white text-sm font-medium mb-2 flex items-center">
                  <FileText size={16} className="mr-2 text-cyan-400" />
                  Description
                </label>
                <textarea
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={8}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm resize-none"
                  placeholder={`Write your ${currentSection.toLowerCase()} story...`}
                  required
                />
                <div className="mt-2 text-right">
                  <span className="text-xs text-gray-400">
                    {description.length} characters
                  </span>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-white text-sm font-medium mb-2 flex items-center">
                  <ImageIcon size={16} className="mr-2 text-purple-400" />
                  Change Image (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-500/20 file:text-purple-300 hover:file:bg-purple-500/30"
                />
                
                {/* Image Preview */}
                {(preview || imageUrl) && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-400 mb-2">Preview:</p>
                    <div className="relative w-full max-w-md">
                      <img
                        src={preview || imageUrl}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-xl border border-slate-600/50"
                      />
                      {preview && (
                        <div className="absolute top-2 right-2 px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-lg border border-green-400/30">
                          New Image
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <p className="text-xs text-gray-500 mt-2">
                  Recommended: High-quality image, max 5MB
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2" size={20} />
                      Update {currentSection}
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default HeroManager;