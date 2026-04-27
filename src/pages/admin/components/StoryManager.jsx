import React, { useEffect, useState } from 'react';
import { db, storage } from '../../../firebase/config';
import { doc, getDoc, updateDoc, collection, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FileText, Upload, Save, Image as ImageIcon, Sparkles, Plus, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StoryManager = () => {
  const [sections, setSections] = useState([]);
  const [currentSection, setCurrentSection] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');
  const [newSectionTitle, setNewSectionTitle] = useState('');

  const fetchSections = async () => {
    try {
      setLoading(true);
      const heroCollection = collection(db, 'hero');
      const heroSnapshot = await getDocs(heroCollection);
      
      const fetchedSections = heroSnapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title || doc.id
      }));
      setSections(fetchedSections);
      if (fetchedSections.length > 0 && !currentSection) {
        setCurrentSection(fetchedSections[0].id);
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchData = async () => {
    if (!currentSection) return;
    try {
      setLoading(true);
      const docRef = doc(db, 'hero', currentSection);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setTitle(data.title || currentSection);
        setDescription(data.description || '');
        setImageUrl(data.imageUrl || '');
        setPreview(null);
        setNewImage(null);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentSection]);

  const handleAddSection = async () => {
    if (!newSectionName.trim() || !newSectionTitle.trim()) {
      alert('Please fill in all fields');
      return;
    }

    try {
      console.log('Adding new section:', newSectionName);
      const docRef = doc(db, 'hero', newSectionName);
      await setDoc(docRef, {
        title: newSectionTitle,
        description: '',
        imageUrl: ''
      });
      console.log('Section added successfully');
      
      alert('Section added successfully!');
      setShowAddModal(false);
      setNewSectionName('');
      setNewSectionTitle('');
      fetchSections();
    } catch (error) {
      console.error('Failed to add section:', error);
      alert('Failed to add section: ' + error.message);
    }
  };

  const handleDeleteSection = async (sectionId) => {
    if (!window.confirm(`Are you sure you want to delete "${sectionId}"?`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'hero', sectionId));
      alert('Section deleted successfully!');
      if (currentSection === sectionId) {
        setCurrentSection(null);
      }
      fetchSections();
    } catch (error) {
      alert('Failed to delete section: ' + error.message);
    }
  };

  const colors = ['from-blue-400 to-cyan-400', 'from-purple-400 to-pink-400', 'from-green-400 to-emerald-400', 'from-orange-400 to-red-400', 'from-indigo-400 to-blue-400', 'from-rose-400 to-pink-400'];

  const getColorByIndex = (index) => colors[index % colors.length];

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
    
    // Validation
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }
    if (!description.trim()) {
      alert('Please enter a description');
      return;
    }
    if (!currentSection) {
      alert('No story selected');
      return;
    }
    
    try {
      setUploading(true);
      console.log('Starting update for story:', currentSection);
      let finalImageUrl = imageUrl;

      // Upload image if there's a new file
      if (newImage) {
        try {
          console.log('Uploading image:', newImage.name);
          const timestamp = Date.now();
          const safeName = newImage.name.replace(/[^a-zA-Z0-9._-]/g, '_');
          const fileName = `${timestamp}-${safeName}`;
          const storageRef = ref(storage, `hero-images/${currentSection}/${fileName}`);
          
          const uploadSnapshot = await uploadBytes(storageRef, newImage);
          console.log('Upload complete:', uploadSnapshot);
          
          finalImageUrl = await getDownloadURL(storageRef);
          console.log('Got download URL:', finalImageUrl);
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          throw new Error(`Image upload failed: ${uploadError.message}`);
        }
      }

      // Update the document
      const docRef = doc(db, 'hero', currentSection);
      const updateData = {
        title: title.trim(),
        description: description.trim(),
        imageUrl: finalImageUrl
      };
      
      console.log('Saving to database:', currentSection, updateData);
      await updateDoc(docRef, updateData);
      console.log('Document saved successfully');

      // Reset form and refresh
      setNewImage(null);
      setPreview(null);
      alert('Story updated successfully!');
      
      // Refresh the data
      await fetchData();
      await fetchSections();
    } catch (error) {
      console.error('Failed to save story:', error);
      console.error('Error details:', error.code, error.message);
      alert(`Failed to save: ${error.message}`);
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
              Story Section Management
            </h2>
            <p className="text-gray-300">Create and manage your story sections dynamically</p>
          </div>
        </div>
      </motion.div>

      {/* Section Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-8 border border-slate-700/50 backdrop-blur-xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-lg flex items-center justify-center">
              <Sparkles size={18} className="text-white" />
            </div>
            My Stories
          </h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium"
          >
            <Plus size={18} />
            Add New Story
          </motion.button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-400"></div>
          </div>
        ) : sections.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">No stories yet. Create your first story!</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium"
            >
              Create Story
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sections.map((section, index) => (
              <motion.button
                key={section.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentSection(section.id)}
                className={`group relative p-6 rounded-xl transition-all duration-300 border-2 ${
                  currentSection === section.id
                    ? `bg-gradient-to-r ${getColorByIndex(index)} border-transparent shadow-lg`
                    : 'bg-slate-700/30 border-slate-600/50 hover:border-slate-500/50 hover:bg-slate-700/50'
                }`}
              >
                <div className="flex flex-col items-start">
                  <h4 className={`font-bold text-lg ${currentSection === section.id ? 'text-white' : 'text-gray-200'} group-hover:text-white transition-colors`}>
                    {section.title}
                  </h4>
                  <p className={`text-xs mt-1 ${currentSection === section.id ? 'text-white/70' : 'text-gray-400'}`}>
                    ID: {section.id}
                  </p>
                </div>
                
                {currentSection === section.id && (
                  <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full shadow-lg"></div>
                )}

                {sections.length > 1 && (
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSection(section.id);
                    }}
                    className={`absolute top-2 right-2 p-1.5 rounded-lg transition-all duration-300 cursor-pointer ${
                      currentSection === section.id 
                        ? 'bg-red-500/20 text-red-300 hover:bg-red-500/40' 
                        : 'bg-slate-600/20 text-gray-300 hover:bg-red-500/40 hover:text-red-300 opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    <Trash2 size={16} />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        )}
      </motion.div>

      {/* Add New Section Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700/50 backdrop-blur-xl max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Plus size={24} className="text-green-400" />
                  Add New Story
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 hover:bg-slate-700/50 rounded-lg transition-all duration-300"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Story ID (e.g., Personal, Professional, Travel)
                  </label>
                  <input
                    type="text"
                    value={newSectionName}
                    onChange={(e) => setNewSectionName(e.target.value)}
                    placeholder="Enter unique story ID"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Story Title (Display name)
                  </label>
                  <input
                    type="text"
                    value={newSectionTitle}
                    onChange={(e) => setNewSectionTitle(e.target.value)}
                    placeholder="e.g., My Personal Journey"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent backdrop-blur-sm"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-3 bg-slate-700/50 text-white rounded-xl hover:bg-slate-600/50 transition-all duration-300 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddSection}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
                  >
                    Create Story
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content Form */}
      <AnimatePresence mode="wait">
        {currentSection ? (
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
                  Edit: <span className="text-cyan-400">{title}</span>
                </h3>

              {/* Title */}
              <div>
                <label className="flex items-center text-white text-sm font-medium mb-2">
                  <Sparkles size={16} className="mr-2 text-yellow-400" />
                  Story Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent backdrop-blur-sm"
                  placeholder="e.g., My Personal Story, My Professional Journey..."
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="flex items-center text-white text-sm font-medium mb-2">
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
                <label className="flex items-center text-white text-sm font-medium mb-2">
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
              <div className="flex justify-end gap-3">
                {sections.length > 1 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete "${title || currentSection}"?`)) {
                        handleDeleteSection(currentSection);
                      }
                    }}
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
                  >
                    <Trash2 className="mr-2" size={20} />
                    Delete Story
                  </motion.button>
                )}
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
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-12 border border-slate-700/50 backdrop-blur-xl text-center"
          >
            <p className="text-gray-300 text-lg">Select a story from the list above to start editing</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StoryManager;

