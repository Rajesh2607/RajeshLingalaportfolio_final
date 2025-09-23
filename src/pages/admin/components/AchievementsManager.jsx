import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase/config';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Trophy, Award, Bookmark, Medal, Plus, Edit, Trash2, Save, Calendar, Building, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AchievementsManager = () => {
  const [achievements, setAchievements] = useState([]);
  const [newAchievement, setNewAchievement] = useState({
    title: '',
    organization: '',
    year: '',
    description: '',
    icon: 'Trophy'
  });
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const iconOptions = [
    { value: 'Trophy', label: 'Trophy', icon: Trophy },
    { value: 'Award', label: 'Award', icon: Award },
    { value: 'Bookmark', label: 'Bookmark', icon: Bookmark },
    { value: 'Medal', label: 'Medal', icon: Medal }
  ];

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'achievements'));
        const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setAchievements(data);
      } catch (error) {
        console.error('Error fetching achievements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAchievement({
      ...newAchievement,
      [name]: value
    });
  };

  const handleAddOrEditAchievement = async (e) => {
    e.preventDefault();
    if (editingId) {
      const updatedAchievement = { ...newAchievement };
      try {
        const achievementRef = doc(db, 'achievements', editingId);
        await updateDoc(achievementRef, updatedAchievement);
        setAchievements(
          achievements.map((ach) => (ach.id === editingId ? { ...ach, ...updatedAchievement } : ach))
        );
        setEditingId(null);
      } catch (error) {
        console.error('Error updating achievement:', error);
      }
    } else {
      try {
        const docRef = await addDoc(collection(db, 'achievements'), newAchievement);
        setAchievements([...achievements, { ...newAchievement, id: docRef.id }]);
      } catch (error) {
        console.error('Error adding achievement:', error);
      }
    }

    setNewAchievement({
      title: '',
      organization: '',
      year: '',
      description: '',
      icon: 'Trophy'
    });
  };

  const handleDeleteAchievement = async (id) => {
    if (window.confirm('Are you sure you want to delete this achievement?')) {
      try {
        const achievementRef = doc(db, 'achievements', id);
        await deleteDoc(achievementRef);
        setAchievements(achievements.filter((ach) => ach.id !== id));
      } catch (error) {
        console.error('Error deleting achievement:', error);
      }
    }
  };

  const handleEditAchievement = (achievement) => {
    setNewAchievement({
      title: achievement.title,
      organization: achievement.organization,
      year: achievement.year,
      description: achievement.description,
      icon: achievement.icon || 'Trophy'
    });
    setEditingId(achievement.id);
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
        className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl p-6 border border-yellow-500/30 backdrop-blur-xl"
      >
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center">
            <Trophy size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles size={20} className="text-yellow-400" />
              Achievements Management
            </h2>
            <p className="text-gray-300">Manage your accomplishments and awards</p>
          </div>
        </div>
      </motion.div>

      {/* Achievement Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-xl"
      >
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Plus size={20} className="mr-2 text-green-400" />
          {editingId ? 'Edit Achievement' : 'Add New Achievement'}
        </h3>

        <form onSubmit={handleAddOrEditAchievement} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white text-sm font-medium mb-2 flex items-center">
                <Trophy size={16} className="mr-2 text-yellow-400" />
                Title
              </label>
              <input
                type="text"
                name="title"
                value={newAchievement.title}
                onChange={handleChange}
                placeholder="Achievement title"
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent backdrop-blur-sm"
                required
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2 flex items-center">
                <Building size={16} className="mr-2 text-blue-400" />
                Organization
              </label>
              <input
                type="text"
                name="organization"
                value={newAchievement.organization}
                onChange={handleChange}
                placeholder="Issuing organization"
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                required
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2 flex items-center">
                <Calendar size={16} className="mr-2 text-green-400" />
                Year
              </label>
              <input
                type="text"
                name="year"
                value={newAchievement.year}
                onChange={handleChange}
                placeholder="Year received"
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent backdrop-blur-sm"
                required
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">Select Icon</label>
              <select
                name="icon"
                value={newAchievement.icon}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm"
              >
                {iconOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-white text-sm font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={newAchievement.description}
              onChange={handleChange}
              placeholder="Achievement description"
              rows="4"
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm resize-none"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
            >
              <Save className="mr-2" size={20} />
              {editingId ? 'Save Changes' : 'Add Achievement'}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Achievements List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Existing Achievements</h3>
        <div className="space-y-4">
          <AnimatePresence>
            {achievements.map((achievement, index) => {
              const IconComponent = iconOptions.find(opt => opt.value === achievement.icon)?.icon || Trophy;
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-xl"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-yellow-500/20 rounded-xl border border-yellow-400/30">
                        <IconComponent size={28} className="text-yellow-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                          <h4 className="text-lg font-bold text-white">{achievement.title}</h4>
                          <span className="text-sm text-cyan-400 mt-1 md:mt-0 flex items-center">
                            <Calendar size={14} className="mr-1" />
                            {achievement.year}
                          </span>
                        </div>
                        <p className="text-gray-300 mb-2 flex items-center">
                          <Building size={14} className="mr-2 text-blue-400" />
                          {achievement.organization}
                        </p>
                        <p className="text-gray-400">{achievement.description}</p>
                      </div>
                    </div>
                    <div className="flex md:flex-col gap-2">
                      <button
                        onClick={() => handleEditAchievement(achievement)}
                        className="flex items-center px-3 py-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 rounded-lg transition-colors"
                      >
                        <Edit size={16} className="mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAchievement(achievement.id)}
                        className="flex items-center px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} className="mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AchievementsManager;