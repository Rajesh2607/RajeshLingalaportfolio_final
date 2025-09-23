import React, { useEffect, useState } from 'react';
import { db } from '../../../firebase/config';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';
import { Wrench, Plus, Trash2, Edit, Save, X, Sparkles, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SkillManager = () => {
  const [skillsData, setSkillsData] = useState({});
  const [newCategory, setNewCategory] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchSkills = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'skills'));
      const data = {};
      querySnapshot.forEach((docSnap) => {
        data[docSnap.id] = docSnap.data().items || [];
      });
      setSkillsData(data);
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      await setDoc(doc(db, 'skills', newCategory), { items: [] });
      setNewCategory('');
      fetchSkills();
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleAddSkill = async () => {
    if (!selectedCategory || !newSkill.trim()) return;
    try {
      const updatedSkills = [...(skillsData[selectedCategory] || []), newSkill];
      await updateDoc(doc(db, 'skills', selectedCategory), {
        items: updatedSkills,
      });
      setNewSkill('');
      fetchSkills();
    } catch (error) {
      console.error('Error adding skill:', error);
    }
  };

  const handleDeleteSkill = async (category, skill) => {
    try {
      const updatedSkills = skillsData[category].filter((s) => s !== skill);
      await updateDoc(doc(db, 'skills', category), {
        items: updatedSkills,
      });
      fetchSkills();
    } catch (error) {
      console.error('Error deleting skill:', error);
    }
  };

  const handleDeleteCategory = async (category) => {
    if (window.confirm(`Are you sure you want to delete the "${category}" category?`)) {
      try {
        await deleteDoc(doc(db, 'skills', category));
        fetchSkills();
      } catch (error) {
        console.error('Error deleting category:', error);
      }
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
        className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl p-6 border border-orange-500/30 backdrop-blur-xl"
      >
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-400 rounded-xl flex items-center justify-center">
            <Wrench size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles size={20} className="text-orange-400" />
              Skills Management
            </h2>
            <p className="text-gray-300">Organize your technical skills by categories</p>
          </div>
        </div>
      </motion.div>

      {/* Add Forms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Add Category */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-xl"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Plus size={18} className="mr-2 text-green-400" />
            Add New Category
          </h3>
          <div className="space-y-4">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="e.g., Web Development"
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent backdrop-blur-sm"
            />
            <button
              onClick={handleAddCategory}
              className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
            >
              <Plus size={18} className="mr-2" />
              Add Category
            </button>
          </div>
        </motion.div>

        {/* Add Skill */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-xl"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Tag size={18} className="mr-2 text-blue-400" />
            Add Skill to Category
          </h3>
          <div className="space-y-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
            >
              <option value="">Select Category</option>
              {Object.keys(skillsData).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="e.g., Python"
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
            />
            <button
              onClick={handleAddSkill}
              className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
            >
              <Save size={18} className="mr-2" />
              Add Skill
            </button>
          </div>
        </motion.div>
      </div>

      {/* Skills Categories */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-white">Skills by Category</h3>
        <AnimatePresence>
          {Object.entries(skillsData).map(([category, skills], index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-xl font-bold text-white flex items-center">
                  <Wrench size={18} className="mr-2 text-orange-400" />
                  {category}
                  <span className="ml-2 px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded-full">
                    {skills.length} skills
                  </span>
                </h4>
                <button
                  onClick={() => handleDeleteCategory(category)}
                  className="flex items-center px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 size={16} className="mr-1" />
                  Delete Category
                </button>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                <AnimatePresence>
                  {skills.map((skill, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex justify-between items-center bg-slate-900/50 px-3 py-2 rounded-xl border border-slate-600/50 group hover:border-slate-500/50 transition-colors"
                    >
                      <span className="text-white text-sm font-medium truncate">{skill}</span>
                      <button
                        onClick={() => handleDeleteSkill(category, skill)}
                        className="ml-2 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SkillManager;