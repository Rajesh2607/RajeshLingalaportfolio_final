import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db, storage } from '../../../firebase/config';
import { collection, addDoc, getDocs, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { GraduationCap, Plus, Edit, Save, Calendar, Building, BookOpen, Sparkles, Upload, Image as ImageIcon, X, Crop } from 'lucide-react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../../../utils/cropImage';

const AdminEducationForm = () => {
  const [formData, setFormData] = useState({
    institution: '',
    degree: '',
    fieldOfStudy: '',
    startYear: '',
    endYear: '',
    image: '',
    description: [],
  });
  const [currentPoint, setCurrentPoint] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [educationList, setEducationList] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Crop states
  const [showCropModal, setShowCropModal] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

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
    setUploading(true);

    try {
      let imageUrl = formData.image;

      // Upload image if a new file is selected
      if (imageFile) {
        const imageRef = ref(storage, `education/${Date.now()}_${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
      }

      const educationData = {
        institution: formData.institution,
        degree: formData.degree,
        fieldOfStudy: formData.fieldOfStudy,
        startYear: formData.startYear,
        endYear: formData.endYear,
        image: imageUrl,
        description: formData.description,
        timestamp: new Date(),
      };

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
        image: '',
        description: [],
      });
      setCurrentPoint('');
      setImageFile(null);
      setImagePreview('');
      setEditId(null);
      fetchEducationData();
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving education:', error);
      setMessage('Error saving education details.');
    } finally {
      setUploading(false);
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
      image: education.image || '',
      description: education.description || [],
    });
    setImagePreview(education.image || '');
    setImageFile(null);
    setCurrentPoint('');
    setMessage('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setMessage('Image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageToCrop(reader.result);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropSave = async () => {
    try {
      const croppedImage = await getCroppedImg(
        imageToCrop,
        croppedAreaPixels,
        0
      );
      
      // Convert blob to file
      const file = new File([croppedImage], 'cropped-image.jpg', {
        type: 'image/jpeg',
      });
      
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(croppedImage);
      
      setShowCropModal(false);
      setImageToCrop(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    } catch (error) {
      console.error('Error cropping image:', error);
      setMessage('Error cropping image');
    }
  };

  const handleCropCancel = () => {
    setShowCropModal(false);
    setImageToCrop(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData(prev => ({ ...prev, image: '' }));
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const addDescriptionPoint = () => {
    if (currentPoint.trim()) {
      setFormData(prev => ({
        ...prev,
        description: [...prev.description, currentPoint.trim()]
      }));
      setCurrentPoint('');
    }
  };

  const removeDescriptionPoint = (index) => {
    setFormData(prev => ({
      ...prev,
      description: prev.description.filter((_, i) => i !== index)
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addDescriptionPoint();
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
          {/* Image Upload Section */}
          <div className="bg-slate-900/30 p-6 rounded-xl border border-slate-600/30">
            <label className="flex items-center text-white text-sm font-medium mb-4">
              <ImageIcon size={16} className="mr-2 text-indigo-400" />
              Institution Logo/Image (Optional)
            </label>
            
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-xl border-2 border-indigo-400/50"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-600 rounded-xl cursor-pointer hover:border-indigo-400 transition-colors bg-slate-900/20">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload size={40} className="text-gray-400 mb-3" />
                  <p className="mb-2 text-sm text-gray-400">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG or WEBP (MAX. 5MB)</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="institution" className="flex items-center text-white text-sm font-medium mb-2">
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
              <label htmlFor="degree" className="flex items-center text-white text-sm font-medium mb-2">
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
              <label htmlFor="fieldOfStudy" className="flex items-center text-white text-sm font-medium mb-2">
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
              <label htmlFor="startYear" className="flex items-center text-white text-sm font-medium mb-2">
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
              <label htmlFor="endYear" className="flex items-center text-white text-sm font-medium mb-2">
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

            {/* Description Points Section */}
            <div className="md:col-span-2">
              <label className="flex items-center text-white text-sm font-medium mb-2">
                <Sparkles size={16} className="mr-2 text-yellow-400" />
                Journey Description (Optional)
              </label>
              
              <div className="space-y-4">
                {/* Input for new point */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentPoint}
                    onChange={(e) => setCurrentPoint(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent backdrop-blur-sm"
                    placeholder="Add a point about your journey (press Enter to add)"
                  />
                  <button
                    type="button"
                    onClick={addDescriptionPoint}
                    className="px-4 py-3 bg-yellow-500/20 text-yellow-400 rounded-xl hover:bg-yellow-500/30 transition-colors border border-yellow-500/50"
                  >
                    <Plus size={20} />
                  </button>
                </div>

                {/* List of added points */}
                {formData.description.length > 0 && (
                  <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-600/30 space-y-2">
                    {formData.description.map((point, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 bg-slate-800/40 p-3 rounded-lg group"
                      >
                        <span className="text-yellow-400 mt-1">•</span>
                        <p className="flex-1 text-gray-300 text-sm">{point}</p>
                        <button
                          type="button"
                          onClick={() => removeDescriptionPoint(index)}
                          className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={uploading}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Save className="mr-2" size={20} />
                  {editId ? 'Update Education' : 'Add Education'}
                </>
              )}
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
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Image Preview */}
                    {edu.image && (
                      <div className="flex-shrink-0">
                        <img
                          src={edu.image}
                          alt={edu.institution}
                          className="w-20 h-20 object-cover rounded-xl border-2 border-indigo-400/30"
                        />
                      </div>
                    )}
                    
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

      {/* Image Crop Modal */}
      <AnimatePresence>
        {showCropModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleCropCancel}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 max-w-4xl w-full border border-slate-700 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white flex items-center">
                  <Crop size={24} className="mr-3 text-cyan-400" />
                  Crop Image
                </h3>
                <button
                  onClick={handleCropCancel}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Crop Area */}
              <div className="relative w-full h-96 bg-black/50 rounded-xl overflow-hidden mb-6">
                <Cropper
                  image={imageToCrop}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  showGrid={false}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>

              {/* Zoom Control */}
              <div className="mb-6">
                <label className="text-white text-sm font-medium mb-2 flex items-center">
                  <span className="mr-2">Zoom</span>
                  <span className="text-cyan-400 text-xs ml-auto">{Math.round(zoom * 100)}%</span>
                </label>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #22D3EE 0%, #22D3EE ${((zoom - 1) / 2) * 100}%, #475569 ${((zoom - 1) / 2) * 100}%, #475569 100%)`
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-end">
                <button
                  onClick={handleCropCancel}
                  className="px-6 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCropSave}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
                >
                  <Crop className="mr-2" size={20} />
                  Apply Crop
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminEducationForm;

