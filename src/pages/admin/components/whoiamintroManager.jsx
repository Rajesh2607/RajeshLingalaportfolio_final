import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';

const WhoIAmIntroManager = () => {
    const [myself, setMyself] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const docRef = doc(db, "wholam", "1");
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                setMyself(docSnap.data().myself || '');
            } else {
                setMyself('');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setMessage('Error fetching data');
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!myself.trim()) {
            setMessage('Please enter some content');
            setMessageType('error');
            return;
        }

        try {
            setSaving(true);
            setMessage('');
            
            const docRef = doc(db, "wholam", "1");
            await setDoc(docRef, {
                myself: myself.trim()
            });
            
            setMessage('Introduction updated successfully!');
            setMessageType('success');
        } catch (error) {
            console.error('Error saving data:', error);
            setMessage('Error saving data. Please try again.');
            setMessageType('error');
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        fetchData();
        setMessage('');
    };

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage('');
                setMessageType('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-gray-900/80 to-black/90 rounded-2xl p-6 border border-gray-800/70 backdrop-blur-xl shadow-md"
        >
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-100">Who I Am - Introduction Manager</h2>
                <button
                    onClick={handleReset}
                    className="px-4 py-2 text-sm bg-gray-800 text-gray-100 rounded-md hover:bg-black transition-colors"
                    disabled={saving}
                >
                    Reset
                </button>
            </div>

            {message && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mb-4 p-3 rounded-md ${
                        messageType === 'success' 
                            ? 'bg-green-900/80 text-green-200 border border-green-700' 
                            : 'bg-red-900/80 text-red-200 border border-red-700'
                    }`}
                >
                    {message}
                </motion.div>
            )}

            <div className="space-y-4">
                <div>
                    <label htmlFor="myself" className="block text-sm font-medium text-gray-200 mb-2">
                        Introduction Text
                    </label>
                    <textarea
                        id="myself"
                        value={myself}
                        onChange={(e) => setMyself(e.target.value)}
                        placeholder="Enter your introduction text here..."
                        className="w-full px-3 py-2 border border-gray-700 bg-gray-950 text-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black resize-vertical"
                        rows="8"
                        disabled={saving}
                    />
                    <p className="mt-1 text-sm text-gray-400">
                        Characters: {myself.length}
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={handleSave}
                        disabled={saving || !myself.trim()}
                        className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
                            saving || !myself.trim()
                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                : 'bg-black text-white hover:bg-gray-900'
                        }`}
                    >
                        {saving ? (
                            <span className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Saving...
                            </span>
                        ) : (
                            'Save Changes'
                        )}
                    </button>
                </div>
            </div>

            <div className="mt-6 p-4 bg-gray-900/80 rounded-md">
                <h3 className="text-sm font-medium text-gray-200 mb-2">Preview:</h3>
                <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {myself || 'No content to preview...'}
                </div>
            </div>
        </motion.div>
    );
};

export default WhoIAmIntroManager;

