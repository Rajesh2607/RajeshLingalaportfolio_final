import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../../../firebase/config';
import { collection, addDoc, getDocs, doc, updateDoc } from 'firebase/firestore';
import { GraduationCap, Plus, Edit, Save, Calendar, Building, BookOpen, Sparkles } from 'lucide-react';

const AdminEducationForm = () => {
  const [formData, setFormData] = useState({
    institution: '',
    degree: '',
    fieldOfStudy: '',
    startYear: '',
    endYear: '',
  });
  const [message, setMessage] = useState('');
  const [educationList, setEducationList] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchEducationData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'educations'));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEducationList(data);
    } catch (error) {
      console.error('Error fetching education data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducationData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const educationData = {
      institution: formData.institution,
      degree: formData.degree,
      fieldOfStudy: formData.fieldOfStudy,
      startYear: formData.startYear,
      endYear: formData.endYear,
      timestamp: new Date(),
    };

    try {
      if (editId) {
        const educationDoc = doc(db, 'educations', editId);
        await updateDoc(educationDoc, educationData);
        setMessage('Education updated successfully!');
      } else {
        await addDoc(collection(db, 'educations'), educationData);
        setMessage('Education added successfully!');
      }

      setFormData({
        institution: '',
        degree: '',
        fieldOfStudy: '',
        startYear: '',
        endYear: '',
      });
      setEditId(null);
      fetchEducationData();
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving education:', error);
      setMessage('Error saving education details.');
    }
  };

  const handleEdit = (education) => {
    setEditId(education.id);
    setFormData({
      institution: education.institution || '',
      degree: education.degree || '',
      fieldOfStudy: education.fieldOfStudy || '',
      startYear: education.startYear?.toString() || '',
      endYear: education.endYear?.toString() || '',
    });
    setMessage('');
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
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
        className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl p-6 border border-indigo-500/30 backdrop-blur-xl"
      >
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-xl flex items-center justify-center">
            <GraduationCap size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles size={20} className="text-indigo-400" />
              Education Management
            </h2>
            <p className="text-gray-300">Manage your educational background</p>
          </div>
        </div>
      </motion.div>

      {/* Success/Error Message */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`p-4 rounded-xl backdrop-blur-xl border ${
              message.includes('success') 
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' 
                : 'bg-red-500/20 border-red-500/50 text-red-300'
            }`}
          >
            <p className="font-medium text-center">{message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Education Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-xl"
      >
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Plus size={20} className="mr-2 text-green-400" />
          {editId ? 'Edit Education Details' : 'Add Education Details'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="institution" className="block text-white text-sm font-medium mb-2 flex items-center">
                <Building size={16} className="mr-2 text-blue-400" />
                Institution
              </label>
              <input
                type="text"
                id="institution"
                value={formData.institution}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                placeholder="University/College name"
                required
              />
            </div>

            <div>
              <label htmlFor="degree" className="block text-white text-sm font-medium mb-2 flex items-center">
                <GraduationCap size={16} className="mr-2 text-purple-400" />
                Degree
              </label>
              <input
                type="text"
                id="degree"
                value={formData.degree}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm"
                placeholder="Bachelor's, Master's, etc."
                required
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="fieldOfStudy" className="block text-white text-sm font-medium mb-2 flex items-center">
                <BookOpen size={16} className="mr-2 text-green-400" />
                Field of Study
              </label>
              <input
                type="text"
                id="fieldOfStudy"
                value={formData.fieldOfStudy}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent backdrop-blur-sm"
                placeholder="Computer Science, Engineering, etc."
                required
              />
            </div>

            <div>
              <label htmlFor="startYear" className="block text-white text-sm font-medium mb-2 flex items-center">
                <Calendar size={16} className="mr-2 text-cyan-400" />
                Start Year
              </label>
              <input
                type="number"
                id="startYear"
                value={formData.startYear}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                placeholder="2020"
                required
              />
            </div>

            <div>
              <label htmlFor="endYear" className="block text-white text-sm font-medium mb-2 flex items-center">
                <Calendar size={16} className="mr-2 text-orange-400" />
                End Year
              </label>
              <input
                type="number"
                id="endYear"
                value={formData.endYear}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent backdrop-blur-sm"
                placeholder="2024"
                required
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
            >
              <Save className="mr-2" size={20} />
              {editId ? 'Update Education' : 'Add Education'}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Education List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Existing Education</h3>
        {educationList.length === 0 ? (
          <div className="text-center py-12">
            <GraduationCap size={48} className="mx-auto text-gray-500 mb-4" />
            <p className="text-gray-400">No education details available.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {educationList.map((edu, index) => (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-xl"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-white mb-2">
                        {edu.degree} in {edu.fieldOfStudy}
                      </h4>
                      <div className="space-y-1 text-sm text-gray-300">
                        <div className="flex items-center">
                          <Building size={14} className="mr-2 text-blue-400" />
                          {edu.institution}
                        </div>
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-2 text-cyan-400" />
                          {edu.startYear} - {edu.endYear}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleEdit(edu)}
                      className="flex items-center px-4 py-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 rounded-lg transition-colors"
                    >
                      <Edit size={16} className="mr-2" />
                      Edit
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEducationForm;