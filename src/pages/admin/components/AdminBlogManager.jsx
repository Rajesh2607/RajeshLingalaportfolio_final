import React, { useEffect, useState } from 'react';
import { db, storage } from '../../../firebase/config';
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
  updateDoc,
  getDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { BookOpen, Plus, Edit, Trash2, Save, Upload, Calendar, Tag, Image as ImageIcon, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminBlogManager = () => {
  const [blogs, setBlogs] = useState([]);
  const [mode, setMode] = useState('view');
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const [blogData, setBlogData] = useState({
    title: '',
    date: '',
    readTime: '',
    category: '',
    image: '',
    content: ''
  });

  const fetchBlogs = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'blogs'));
      const blogList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBlogs(blogList);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await deleteDoc(doc(db, 'blogs', id));
        fetchBlogs();
      } catch (error) {
        console.error('Error deleting blog:', error);
      }
    }
  };

  const handleEdit = async (id) => {
    const docRef = doc(db, 'blogs', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setBlogData({
        title: data.title,
        date: data.date,
        readTime: data.readTime,
        category: data.category,
        image: data.image,
        content: data.content
      });
      setEditingId(id);
      setMode('edit');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlogData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = blogData.image;

      if (imageFile) {
        const imageRef = ref(storage, `BLOG_IMAGES/${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
      }

      const avatarRef = ref(storage, 'https://firebasestorage.googleapis.com/v0/b/myprofolio-34d7c.firebasestorage.app/o/profile%2FWhatsApp%20Image%202025-04-20%20at%2018.48.10_4a2d17cb.jpg?alt=media&token=5ac51520-47e7-4799-ab7a-439ef0a4efc2');
      const avatarUrl = await getDownloadURL(avatarRef);

      const newBlogData = {
        ...blogData,
        image: imageUrl,
        author: {
          name: 'LINGALA RAJESH',
          avatar: avatarUrl
        }
      };

      if (mode === 'add') {
        await addDoc(collection(db, 'blogs'), newBlogData);
      } else if (mode === 'edit') {
        await updateDoc(doc(db, 'blogs', editingId), newBlogData);
      }

      setBlogData({
        title: '',
        date: '',
        readTime: '',
        category: '',
        image: '',
        content: ''
      });
      setImageFile(null);
      setMode('view');
      fetchBlogs();
    } catch (error) {
      console.error('Error saving blog:', error);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

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
        className="bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-2xl p-6 border border-red-500/30 backdrop-blur-xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-pink-400 rounded-xl flex items-center justify-center">
              <BookOpen size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Sparkles size={20} className="text-red-400" />
                Blog Management
              </h2>
              <p className="text-gray-300">Create and manage your blog posts</p>
            </div>
          </div>
          
          {mode === 'view' && (
            <button
              className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
              onClick={() => {
                setBlogData({
                  title: '',
                  date: '',
                  readTime: '',
                  category: '',
                  image: '',
                  content: ''
                });
                setMode('add');
              }}
            >
              <Plus size={18} className="mr-2" />
              Add Blog
            </button>
          )}
        </div>
      </motion.div>

      {/* Blog List View */}
      {mode === 'view' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-xl"
        >
          <h3 className="text-xl font-semibold text-white mb-6">Blog Posts</h3>
          
          {blogs.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen size={48} className="mx-auto text-gray-500 mb-4" />
              <p className="text-gray-400">No blog posts available.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="pb-3 text-gray-300 font-medium">Title</th>
                    <th className="pb-3 text-gray-300 font-medium">Date</th>
                    <th className="pb-3 text-gray-300 font-medium">Category</th>
                    <th className="pb-3 text-gray-300 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {blogs.map((blog, index) => (
                      <motion.tr
                        key={blog.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                        className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors"
                      >
                        <td className="py-4 text-white font-medium">{blog.title}</td>
                        <td className="py-4 text-gray-300">{blog.date}</td>
                        <td className="py-4">
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-400/30">
                            {blog.category}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(blog.id)}
                              className="flex items-center px-3 py-1 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 rounded-lg transition-colors"
                            >
                              <Edit size={14} className="mr-1" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(blog.id)}
                              className="flex items-center px-3 py-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                              <Trash2 size={14} className="mr-1" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      )}

      {/* Blog Form */}
      {(mode === 'add' || mode === 'edit') && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-xl"
        >
          <h3 className="text-xl font-semibold text-white mb-6">
            {mode === 'add' ? 'Add New Blog Post' : 'Edit Blog Post'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2 flex items-center">
                  <BookOpen size={16} className="mr-2 text-red-400" />
                  Title
                </label>
                <input
                  name="title"
                  placeholder="Blog post title"
                  value={blogData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent backdrop-blur-sm"
                  required
                />
              </div>
              
              <div>
                <label className="block text-white text-sm font-medium mb-2 flex items-center">
                  <Calendar size={16} className="mr-2 text-blue-400" />
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={blogData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                  required
                />
              </div>
              
              <div>
                <label className="block text-white text-sm font-medium mb-2">Read Time</label>
                <input
                  name="readTime"
                  placeholder="5 min"
                  value={blogData.readTime}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent backdrop-blur-sm"
                  required
                />
              </div>
              
              <div>
                <label className="block text-white text-sm font-medium mb-2 flex items-center">
                  <Tag size={16} className="mr-2 text-purple-400" />
                  Category
                </label>
                <input
                  name="category"
                  placeholder="Technology, Lifestyle, etc."
                  value={blogData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-white text-sm font-medium mb-2 flex items-center">
                <ImageIcon size={16} className="mr-2 text-cyan-400" />
                Featured Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-cyan-500/20 file:text-cyan-300 hover:file:bg-cyan-500/30"
              />
            </div>
            
            <div>
              <label className="block text-white text-sm font-medium mb-2">Content</label>
              <div className="bg-white rounded-xl overflow-hidden">
                <ReactQuill
                  value={blogData.content}
                  onChange={value => setBlogData(prev => ({ ...prev, content: value }))}
                  className="text-black"
                  style={{ minHeight: '300px' }}
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={uploading}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    {mode === 'add' ? 'Adding...' : 'Updating...'}
                  </>
                ) : (
                  <>
                    <Save className="mr-2" size={20} />
                    {mode === 'add' ? 'Add Blog' : 'Update Blog'}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setMode('view')}
                className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default AdminBlogManager;