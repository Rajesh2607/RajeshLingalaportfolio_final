import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase/config';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { Briefcase, Plus, Trash2, Edit2, Save, X, MapPin, Calendar, Building, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ExperienceManager = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    period: '',
    description: [],
    order: 0,
  });

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const q = query(collection(db, 'experiences'), orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      const experienceData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setExperiences(experienceData);
    } catch (error) {
      console.error('Error fetching experiences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'experiences', editingId), formData);
      } else {
        await addDoc(collection(db, 'experiences'), formData);
      }
      setFormData({
        title: '',
        company: '',
        location: '',
        period: '',
        description: [],
        order: 0,
      });
      setEditingId(null);
      fetchExperiences();
    } catch (error) {
      console.error('Error saving experience:', error);
      alert('Error saving experience');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      try {
        await deleteDoc(doc(db, 'experiences', id));
        fetchExperiences();
      } catch (error) {
        console.error('Error deleting experience:', error);
        alert('Error deleting experience');
      }
    }
  };

  const handleEdit = (experience) => {
    setFormData({
      ...experience,
      description: Array.isArray(experience.description)
        ? experience.description
        : experience.description
        ? [experience.description]
        : [],
    });
    setEditingId(experience.id);
  };

  const addDescriptionPoint = () => {
    setFormData({
      ...formData,
      description: [...formData.description, ''],
    });
  };

  const updateDescriptionPoint = (index, value) => {
    const newDescription = [...formData.description];
    newDescription[index] = value;
    setFormData({
      ...formData,
      description: newDescription,
    });
  };

  const removeDescriptionPoint = (index) => {
    setFormData({
      ...formData,
      description: formData.description.filter((_, i) => i !== index),
    });
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
        className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-6 border border-blue-500/30 backdrop-blur-xl"
      >
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-xl flex items-center justify-center">
            <Briefcase size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles size={20} className="text-blue-400" />
              Experience Management
            </h2>
            <p className="text-gray-300">Manage your professional experience</p>
          </div>
        </div>
      </motion.div>

      {/* Experience Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-xl"
      >
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Plus size={20} className="mr-2 text-green-400" />
          {editingId ? 'Edit Experience' : 'Add New Experience'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white text-sm font-medium mb-2 flex items-center">
                <Briefcase size={16} className="mr-2 text-blue-400" />
                Job Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                placeholder="e.g., Senior DevOps Engineer"
                required
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2 flex items-center">
                <Building size={16} className="mr-2 text-purple-400" />
                Company
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm"
                placeholder="e.g., Tech Solutions Inc."
                required
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2 flex items-center">
                <MapPin size={16} className="mr-2 text-green-400" />
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent backdrop-blur-sm"
                placeholder="e.g., Remote"
                required
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2 flex items-center">
                <Calendar size={16} className="mr-2 text-cyan-400" />
                Period
              </label>
              <input
                type="text"
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                placeholder="e.g., 2022 - Present"
                required
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">Order</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent backdrop-blur-sm"
                placeholder="e.g., 1"
                required
              />
            </div>
          </div>

          {/* Description Points */}
          <div>
            <label className="block text-white text-sm font-medium mb-4">Description Points</label>
            <div className="space-y-3">
              <AnimatePresence>
                {formData.description.map((point, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="text"
                      value={point}
                      onChange={(e) => updateDescriptionPoint(index, e.target.value)}
                      className="flex-1 px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                      placeholder="Add description point"
                    />
                    <button
                      type="button"
                      onClick={() => removeDescriptionPoint(index)}
                      className="p-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              <button
                type="button"
                onClick={addDescriptionPoint}
                className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
              >
                <Plus size={20} className="mr-1" />
                Add Description Point
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
            >
              <Save className="mr-2" size={20} />
              {editingId ? 'Update Experience' : 'Add Experience'}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Experience List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Existing Experiences</h3>
        <AnimatePresence>
          {experiences.map((experience, index) => (
            <motion.div
              key={experience.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-xl"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-white mb-2">{experience.title}</h4>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-300 mb-3">
                    <div className="flex items-center">
                      <Building size={14} className="mr-1 text-purple-400" />
                      {experience.company}
                    </div>
                    <div className="flex items-center">
                      <MapPin size={14} className="mr-1 text-green-400" />
                      {experience.location}
                    </div>
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1 text-cyan-400" />
                      {experience.period}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(experience)}
                    className="p-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 rounded-lg transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(experience.id)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                {(Array.isArray(experience.description)
                  ? experience.description
                  : [experience.description]
                ).map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ExperienceManager;