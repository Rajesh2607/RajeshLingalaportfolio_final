import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase/config';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import {
  Github,
  Linkedin,
  Twitter,
  Youtube,
  Instagram,
  Facebook,
  FileText,
  Plus,
  Edit,
  Trash2,
  Save,
  Link as LinkIcon,
  Sparkles,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SocialMediaManager = () => {
  const [socialLinks, setSocialLinks] = useState([]);
  const [newAccount, setNewAccount] = useState({ name: '', url: '' });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  const iconMap = {
    github: Github,
    linkedin: Linkedin,
    twitter: Twitter,
    youtube: Youtube,
    instagram: Instagram,
    facebook: Facebook,
    default: FileText
  };

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'socialLinks'));
        const links = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setSocialLinks(links);
      } catch (error) {
        console.error('Error fetching social media accounts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSocialLinks();
  }, []);

  const handleAddAccount = async () => {
    if (newAccount.name && newAccount.url) {
      try {
        const docRef = await addDoc(collection(db, 'socialLinks'), {
          name: newAccount.name,
          url: newAccount.url,
        });
        setSocialLinks([...socialLinks, { ...newAccount, id: docRef.id }]);
        setNewAccount({ name: '', url: '' });
      } catch (error) {
        console.error('Error adding social media account:', error);
      }
    }
  };

  const handleEditAccount = async () => {
    if (editing) {
      try {
        const docRef = doc(db, 'socialLinks', editing.id);
        await updateDoc(docRef, {
          name: editing.name,
          url: editing.url,
        });
        setSocialLinks(
          socialLinks.map((link) =>
            link.id === editing.id ? editing : link
          )
        );
        setEditing(null);
      } catch (error) {
        console.error('Error updating social media account:', error);
      }
    }
  };

  const handleDeleteAccount = async (id) => {
    if (window.confirm('Are you sure you want to delete this social media account?')) {
      try {
        await deleteDoc(doc(db, 'socialLinks', id));
        setSocialLinks(socialLinks.filter((link) => link.id !== id));
      } catch (error) {
        console.error('Error deleting social media account:', error);
      }
    }
  };

  const getIcon = (name) => {
    const key = name.toLowerCase();
    const IconComponent = iconMap[key] || iconMap.default;
    return <IconComponent className="w-8 h-8 text-purple-400" />;
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
        className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-500/30 backdrop-blur-xl"
      >
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center">
            <Globe size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles size={20} className="text-purple-400" />
              Social Media Management
            </h2>
            <p className="text-gray-300">Manage your social media presence</p>
          </div>
        </div>
      </motion.div>

      {/* Add New Account */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-xl"
      >
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Plus size={20} className="mr-2 text-green-400" />
          Add New Account
        </h3>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddAccount();
          }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white text-sm font-medium mb-2">Account Name</label>
              <input
                type="text"
                placeholder="Account Name (e.g., GitHub)"
                value={newAccount.name}
                onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm"
                required
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2 flex items-center">
                <LinkIcon size={16} className="mr-2 text-blue-400" />
                Account URL
              </label>
              <input
                type="url"
                placeholder="Account URL"
                value={newAccount.url}
                onChange={(e) => setNewAccount({ ...newAccount, url: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
            >
              <Save className="mr-2" size={20} />
              Add Account
            </button>
          </div>
        </form>
      </motion.div>

      {/* Display Accounts */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Existing Accounts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence>
            {socialLinks.map((link, index) => (
              <motion.div
                key={link.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-xl"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-purple-500/20 rounded-xl border border-purple-400/30">
                      {getIcon(link.name)}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">{link.name}</h4>
                      <p className="text-gray-400 text-sm break-all">{link.url}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditing(link)}
                    className="flex items-center px-3 py-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 rounded-lg transition-colors"
                  >
                    <Edit size={16} className="mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteAccount(link.id)}
                    className="flex items-center px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} className="mr-1" />
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Edit Account Form */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-xl"
          >
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Edit size={20} className="mr-2 text-yellow-400" />
              Edit Account
            </h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Account Name</label>
                  <input
                    type="text"
                    value={editing.name}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent backdrop-blur-sm"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2 flex items-center">
                    <LinkIcon size={16} className="mr-2 text-blue-400" />
                    Account URL
                  </label>
                  <input
                    type="url"
                    value={editing.url}
                    onChange={(e) => setEditing({ ...editing, url: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                  />
                </div>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={handleEditAccount}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
                >
                  <Save className="mr-2" size={20} />
                  Save Changes
                </button>
                <button
                  onClick={() => setEditing(null)}
                  className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SocialMediaManager;