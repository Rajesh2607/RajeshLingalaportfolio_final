import React, { useState, useEffect } from 'react';
import { db, storage } from '../../../firebase/config';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Code, LineChart, Palette, Plus, Trash2, Edit2, Save, X, Upload, Image as ImageIcon, Sparkles, Tag, Move } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WhoAboutManager = () => {
  const [aboutSections, setAboutSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    icon: 'Code',
    color: 'purple',
    skills: [],
    technologies: [],
    order: 0,
  });
  const [newSkill, setNewSkill] = useState('');
  const [newTech, setNewTech] = useState({ name: '', icon: '' });
  const [imageFile, setImageFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const iconOptions = ['Code', 'Palette', 'LineChart'];
  const colorOptions = ['purple', 'cyan', 'blue', 'green', 'red', 'yellow', 'pink', 'indigo'];

  useEffect(() => {
    fetchAboutSections();
  }, []);

  const fetchAboutSections = async () => {
    try {
      const q = query(collection(db, 'whoAboutSections'), orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      const sectionsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAboutSections(sectionsData);
    } catch (error) {
      console.error('Error fetching about sections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return null;
    
    setUploadingImage(true);
    try {
      const storageRef = ref(storage, `whoAbout/${Date.now()}-${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = formData.image;
      
      // Upload new image if selected
      if (imageFile) {
        imageUrl = await handleImageUpload(imageFile);
        if (!imageUrl) return;
      }

      const dataToSave = {
        ...formData,
        image: imageUrl,
        skills: formData.skills.filter(skill => skill.trim() !== ''),
        technologies: formData.technologies.filter(tech => tech.name.trim() !== ''),
      };

      if (editingId) {
        await updateDoc(doc(db, 'whoAboutSections', editingId), dataToSave);
      } else {
        await addDoc(collection(db, 'whoAboutSections'), dataToSave);
      }
      
      resetForm();
      fetchAboutSections();
    } catch (error) {
      console.error('Error saving about section:', error);
      alert('Error saving about section');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image: '',
      icon: 'Code',
      color: 'purple',
      skills: [],
      technologies: [],
      order: 0,
    });
    setEditingId(null);
    setImageFile(null);
    setNewSkill('');
    setNewTech({ name: '', icon: '' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this section?')) {
      try {
        await deleteDoc(doc(db, 'whoAboutSections', id));
        fetchAboutSections();
      } catch (error) {
        console.error('Error deleting section:', error);
        alert('Error deleting section');
      }
    }
  };

  const handleEdit = (section) => {
    setFormData({
      ...section,
      skills: Array.isArray(section.skills) ? section.skills : [],
      technologies: Array.isArray(section.technologies) ? section.technologies : [],
    });
    setEditingId(section.id);
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()],
      });
      setNewSkill('');
    }
  };

  const removeSkill = (index) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((_, i) => i !== index),
    });
  };

  const addTechnology = () => {
    if (newTech.name.trim() && newTech.icon.trim()) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, { ...newTech }],
      });
      setNewTech({ name: '', icon: '' });
    }
  };

  const removeTechnology = (index) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter((_, i) => i !== index),
    });
  };

  const getIconComponent = (iconName) => {
    switch (iconName) {
      case 'Palette':
        return <Palette size={20} />;
      case 'LineChart':
        return <LineChart size={20} />;
      default:
        return <Code size={20} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl p-6 border border-purple-500/30 backdrop-blur-xl"
      >
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-400 rounded-xl flex items-center justify-center">
            <Code size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles size={20} className="text-purple-400" />
              Who I Am - About Sections Management
            </h2>
            <p className="text-gray-300">Manage the "What I Do?" sections on the Who I Am page</p>
          </div>
        </div>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-xl"
      >
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Plus size={20} className="mr-2 text-green-400" />
          {editingId ? 'Edit Section' : 'Add New Section'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Section Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., UX Design"
                required
              />
            </div>

            {/* Order */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Display Order
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="0"
                required
              />
            </div>

            {/* Icon */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Icon
              </label>
              <select
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {iconOptions.map(icon => (
                  <option key={icon} value={icon} className="bg-slate-700">
                    {icon}
                  </option>
                ))}
              </select>
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Color Theme
              </label>
              <select
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {colorOptions.map(color => (
                  <option key={color} value={color} className="bg-slate-700">
                    {color.charAt(0).toUpperCase() + color.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Describe what you do in this area..."
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Section Image
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg cursor-pointer flex items-center gap-2 transition-colors"
              >
                <Upload size={16} />
                Choose Image
              </label>
              {(formData.image || imageFile) && (
                <div className="flex items-center gap-2">
                  <ImageIcon size={16} className="text-green-400" />
                  <span className="text-sm text-gray-300">
                    {imageFile ? imageFile.name : 'Current image'}
                  </span>
                </div>
              )}
            </div>
            {formData.image && !imageFile && (
              <img
                src={formData.image}
                alt="Current"
                className="mt-2 w-32 h-20 object-cover rounded-lg"
              />
            )}
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Skills/Features
            </label>
            <div className="space-y-3">
              {formData.skills.map((skill, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-yellow-500">⚡</span>
                  <span className="flex-1 text-gray-300">{skill}</span>
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="p-1 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill/feature..."
                  className="flex-1 px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Technologies */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Technologies
            </label>
            <div className="space-y-3">
              {formData.technologies.map((tech, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-slate-700/30 rounded-lg">
                  <img src={tech.icon} alt={tech.name} className="w-8 h-8" />
                  <span className="flex-1 text-gray-300">{tech.name}</span>
                  <button
                    type="button"
                    onClick={() => removeTechnology(index)}
                    className="p-1 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <input
                  type="text"
                  value={newTech.name}
                  onChange={(e) => setNewTech({ ...newTech, name: e.target.value })}
                  placeholder="Technology name..."
                  className="px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="url"
                  value={newTech.icon}
                  onChange={(e) => setNewTech({ ...newTech, icon: e.target.value })}
                  placeholder="Icon URL..."
                  className="px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="button"
                  onClick={addTechnology}
                  className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={uploadingImage}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save size={16} />
              {uploadingImage ? 'Uploading...' : editingId ? 'Update Section' : 'Add Section'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2"
              >
                <X size={16} />
                Cancel
              </button>
            )}
          </div>
        </form>
      </motion.div>

      {/* Existing Sections */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-xl"
      >
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Move size={20} className="mr-2 text-blue-400" />
          Existing Sections
        </h3>

        <div className="space-y-4">
          <AnimatePresence>
            {aboutSections.map((section) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`text-${section.color}-400`}>
                        {getIconComponent(section.icon)}
                      </div>
                      <h4 className="text-lg font-semibold text-white">{section.title}</h4>
                      <span className="px-2 py-1 bg-slate-600 text-xs text-gray-300 rounded">
                        Order: {section.order}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm mb-3">{section.description}</p>
                    {section.skills && section.skills.length > 0 && (
                      <div className="mb-3">
                        <span className="text-xs text-gray-400 font-medium">Skills:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {section.skills.map((skill, index) => (
                            <span key={index} className="px-2 py-1 bg-yellow-600/20 text-yellow-300 text-xs rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {section.technologies && section.technologies.length > 0 && (
                      <div>
                        <span className="text-xs text-gray-400 font-medium">Technologies:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {section.technologies.map((tech, index) => (
                            <div key={index} className="flex items-center gap-1">
                              <img src={tech.icon} alt={tech.name} className="w-4 h-4" />
                              <span className="text-xs text-gray-300">{tech.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(section)}
                      className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(section.id)}
                      className="p-2 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {aboutSections.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Code size={48} className="mx-auto mb-4 opacity-50" />
            <p>No sections created yet. Add your first section above!</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default WhoAboutManager;

