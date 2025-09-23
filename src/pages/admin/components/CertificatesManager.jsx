import React, { useState, useEffect } from 'react';
import { db, storage } from '../../../firebase/config';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { Award, Plus, Trash2, Edit2, Save, ExternalLink, Shield, Calendar, Building, Sparkles, Tag, Upload, Link, ToggleLeft, ToggleRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CertificatesManager = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [useImageUpload, setUseImageUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [customDomain, setCustomDomain] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    date: '',
    credentialId: '',
    image: '',
    link: '',
    domain: ''
  });

  // Predefined CSE domains
  const cseDomains = [
    'Data Analytics',
    'Complete Artificial Intelligence',
    'Python Stack',
    'Software Engineering',
    'Mobile Application Development',
    'Web Development',
    'Cloud Computing',
    'Cybersecurity',
    'Blockchain',
    'IoT (Internet of Things)',
    'Computer Networks',
    'Quality Assurance',
    'Project Management',
    'Agile/Scrum',
    'Version Control',
    'DevOps',
    'quantum computing',
    'UX Design'
  ];

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'certificates'));
      const certificateData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCertificates(certificateData);
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }

      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file) => {
    if (!file) return null;
    
    const timestamp = Date.now();
    const fileName = `certificates/${timestamp}_${file.name}`;
    const storageRef = ref(storage, fileName);
    
    try {
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      issuer: '',
      date: '',
      credentialId: '',
      image: '',
      link: '',
      domain: ''
    });
    setSelectedFile(null);
    setPreviewUrl('');
    setUseImageUpload(false);
    setEditingId(null);
    setSelectedDomains([]);
    setCustomDomain('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = formData.image;

      // If using image upload and a file is selected, upload it
      if (useImageUpload && selectedFile) {
        imageUrl = await uploadImage(selectedFile);
      } else if (useImageUpload && !selectedFile && !editingId) {
        alert('Please select an image file or switch to URL input');
        setUploading(false);
        return;
      }

      // Combine selected domains with custom domain if provided
      let domainsToSave = [...selectedDomains];
      if (customDomain.trim()) {
        const customDomains = customDomain.split(',').map(d => d.trim()).filter(d => d);
        domainsToSave = [...domainsToSave, ...customDomains];
      }

      // Validate that at least one domain is selected
      if (domainsToSave.length === 0) {
        alert('Please select at least one domain or add a custom domain');
        setUploading(false);
        return;
      }

      const dataToSave = {
        ...formData,
        image: imageUrl,
        domain: domainsToSave
      };

      if (editingId) {
        await updateDoc(doc(db, 'certificates', editingId), dataToSave);
      } else {
        await addDoc(collection(db, 'certificates'), dataToSave);
      }

      resetForm();
      fetchCertificates();
    } catch (error) {
      console.error('Error saving certificate:', error);
      alert('Error saving certificate');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this certificate?')) {
      try {
        await deleteDoc(doc(db, 'certificates', id));
        fetchCertificates();
      } catch (error) {
        console.error('Error deleting certificate:', error);
        alert('Error deleting certificate');
      }
    }
  };

  const handleEdit = (certificate) => {
    setFormData({
      ...certificate,
      domain: Array.isArray(certificate.domain) ? certificate.domain.join(', ') : certificate.domain || ''
    });
    
    // Set selected domains for checkboxes
    if (Array.isArray(certificate.domain)) {
      const predefinedDomains = certificate.domain.filter(d => cseDomains.includes(d));
      const customDomains = certificate.domain.filter(d => !cseDomains.includes(d));
      
      setSelectedDomains(predefinedDomains);
      setCustomDomain(customDomains.join(', '));
    } else if (certificate.domain) {
      const domains = certificate.domain.split(',').map(d => d.trim());
      const predefinedDomains = domains.filter(d => cseDomains.includes(d));
      const customDomains = domains.filter(d => !cseDomains.includes(d));
      
      setSelectedDomains(predefinedDomains);
      setCustomDomain(customDomains.join(', '));
    }
    
    setEditingId(certificate.id);
    setUseImageUpload(false); // Default to URL input for editing
    setSelectedFile(null);
    setPreviewUrl('');
  };

  const handleDomainToggle = (domain) => {
    setSelectedDomains(prev => 
      prev.includes(domain) 
        ? prev.filter(d => d !== domain)
        : [...prev, domain]
    );
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
        className="bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-2xl p-6 border border-emerald-500/30 backdrop-blur-xl"
      >
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-blue-400 rounded-xl flex items-center justify-center">
            <Award size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles size={20} className="text-emerald-400" />
              Certificates Management
            </h2>
            <p className="text-gray-300">Manage your professional certifications</p>
          </div>
        </div>
      </motion.div>

      {/* Certificate Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-xl"
      >
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Plus size={20} className="mr-2 text-green-400" />
          {editingId ? 'Edit Certificate' : 'Add New Certificate'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-white text-sm font-medium mb-2 flex items-center">
                <Award size={16} className="mr-2 text-emerald-400" />
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent backdrop-blur-sm"
                placeholder="Certificate title"
                required
              />
            </div>
            <div>
              <label className="text-white text-sm font-medium mb-2 flex items-center">
                <Building size={16} className="mr-2 text-blue-400" />
                Issuer
              </label>
              <input
                type="text"
                value={formData.issuer}
                onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                placeholder="Issuing organization"
                required
              />
            </div>
            <div>
              <label className="text-white text-sm font-medium mb-2 flex items-center">
                <Calendar size={16} className="mr-2 text-purple-400" />
                Date
              </label>
              <input
                type="text"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm"
                placeholder="Issue date"
                required
              />
            </div>
            <div>
              <label className="text-white text-sm font-medium mb-2 flex items-center">
                <Shield size={16} className="mr-2 text-cyan-400" />
                Credential ID
              </label>
              <input
                type="text"
                value={formData.credentialId}
                onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                placeholder="Credential ID"
                required
              />
            </div>
          </div>

          {/* Domain Selection Section */}
          <div className="space-y-4">
            <div>
              <label className="text-white text-sm font-medium mb-3 flex items-center">
                <Tag size={16} className="mr-2 text-orange-400" />
                Certificate Domain(s)
              </label>
              
              <div className="bg-slate-900/50 border border-slate-600/50 rounded-xl p-4 space-y-3">
                <p className="text-gray-300 text-sm mb-3">Select one or more domains that apply to this certificate:</p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                  {cseDomains.map(domain => (
                    <label key={domain} className="flex items-center space-x-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedDomains.includes(domain)}
                        onChange={() => handleDomainToggle(domain)}
                        className="w-4 h-4 text-orange-400 bg-slate-800 border-slate-600 rounded focus:ring-orange-400 focus:ring-2"
                      />
                      <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                        {domain}
                      </span>
                    </label>
                  ))}
                </div>
                
                {selectedDomains.length > 0 && (
                  <div className="mt-3 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                    <p className="text-orange-400 text-sm font-medium mb-1">Selected domains:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedDomains.map(domain => (
                        <span key={domain} className="px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded-full">
                          {domain}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="pt-3 border-t border-slate-600/50">
                  <label className="text-white text-sm font-medium mb-2 block">
                    Additional Custom Domains (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm"
                    placeholder="e.g., Data Analytics, Cloud Architecture"
                  />
                  {customDomain.trim() && (
                    <div className="mt-2 p-2 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                      <p className="text-blue-400 text-sm font-medium mb-1">Custom domains:</p>
                      <div className="flex flex-wrap gap-2">
                        {customDomain.split(',').map((domain, index) => domain.trim() && (
                          <span key={index} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                            {domain.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Image Upload/URL Toggle Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-white text-sm font-medium">Certificate Image</label>
              <div className="flex items-center space-x-3">
                <span className={`text-sm ${!useImageUpload ? 'text-blue-400' : 'text-gray-500'}`}>URL</span>
                <button
                  type="button"
                  onClick={() => {
                    setUseImageUpload(!useImageUpload);
                    if (!useImageUpload) {
                      // Switching to upload mode, clear URL
                      setFormData({ ...formData, image: '' });
                    } else {
                      // Switching to URL mode, clear file selection
                      setSelectedFile(null);
                      setPreviewUrl('');
                    }
                  }}
                  className="focus:outline-none"
                >
                  {useImageUpload ? (
                    <ToggleRight size={24} className="text-emerald-400" />
                  ) : (
                    <ToggleLeft size={24} className="text-gray-400" />
                  )}
                </button>
                <span className={`text-sm ${useImageUpload ? 'text-emerald-400' : 'text-gray-500'}`}>Upload</span>
              </div>
            </div>

            {useImageUpload ? (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-slate-600/50 rounded-xl p-6 bg-slate-900/30">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center space-y-3"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-blue-400 rounded-xl flex items-center justify-center">
                      <Upload size={24} className="text-white" />
                    </div>
                    <div className="text-center">
                      <p className="text-white font-medium">Click to upload image</p>
                      <p className="text-gray-400 text-sm">PNG, JPG, GIF up to 5MB</p>
                    </div>
                  </label>
                </div>

                {selectedFile && (
                  <div className="flex items-center space-x-3 p-3 bg-slate-900/50 rounded-xl border border-slate-600/50">
                    <div className="text-emerald-400">
                      <Upload size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{selectedFile.name}</p>
                      <p className="text-gray-400 text-xs">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                )}

                {previewUrl && (
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-xl border border-slate-600/50"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl('');
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-500/80 text-white rounded-full hover:bg-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link size={16} className="text-blue-400" />
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="flex-1 px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                  placeholder="https://example.com/certificate-image.jpg"
                  required={!useImageUpload}
                />
              </div>
            )}
          </div>

          <div>
            <label className="text-white text-sm font-medium mb-2 flex items-center">
              <ExternalLink size={16} className="mr-2 text-green-400" />
              Certificate Link
            </label>
            <input
              type="url"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent backdrop-blur-sm"
              placeholder="https://www.certificate-link.com"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={uploading}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="mr-2" size={20} />
              )}
              {uploading ? 'Saving...' : (editingId ? 'Update Certificate' : 'Add Certificate')}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Certificates List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Existing Certificates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence>
            {certificates.map((certificate, index) => (
              <motion.div
                key={certificate.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-xl"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-white mb-2">{certificate.title}</h4>
                    <div className="space-y-2 text-sm text-gray-300">
                      <div className="flex items-center">
                        <Building size={14} className="mr-2 text-blue-400" />
                        {certificate.issuer}
                      </div>
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-2 text-purple-400" />
                        {certificate.date}
                      </div>
                      <div className="flex items-center">
                        <Shield size={14} className="mr-2 text-cyan-400" />
                        ID: {certificate.credentialId}
                      </div>
                      <div className="flex items-center">
                        <Tag size={14} className="mr-2 text-orange-400" />
                        {Array.isArray(certificate.domain) ? certificate.domain.join(', ') : certificate.domain}
                      </div>
                    </div>
                    {certificate.link && (
                      <a
                        href={certificate.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center mt-3 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                      >
                        <ExternalLink size={14} className="mr-1" />
                        View Certificate
                      </a>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(certificate)}
                      className="p-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 rounded-lg transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(certificate.id)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                {certificate.image && (
                  <img
                    src={certificate.image}
                    alt={certificate.title}
                    className="w-full h-32 object-cover rounded-xl border border-slate-600/50"
                  />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CertificatesManager;

