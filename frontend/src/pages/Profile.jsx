import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Shield, MapPin, Phone, Edit2, Save, X, Building } from 'lucide-react';
import config from '../config';
import { motion } from 'framer-motion';
import BackButton from '../components/BackButton';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProfile();
    }, [navigate]);

    const fetchProfile = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(`${config.API_BASE_URL}/api/users/profile/`, {
                headers: { 'Authorization': `Token ${token} ` }
            });
            if (response.ok) {
                const data = await response.json();
                setUser(data);
                setFormData(data);
            } else {
                localStorage.clear();
                navigate('/login');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${config.API_BASE_URL}/api/users/profile/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token} `
                },
                body: JSON.stringify({
                    phone: formData.phone,
                    state: formData.state,
                    district: formData.district,
                    taluka: formData.taluka,
                    village: formData.village,
                    pincode: formData.pincode
                })
            });

            if (response.ok) {
                const updatedUser = await response.json();
                setUser(updatedUser);
                setIsEditing(false);
            } else {
                alert('Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('An error occurred');
        }
    };

    if (loading) return <div className="min-h-screen pt-20 flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

    return (
        <div className="min-h-screen pt-20 pb-12 bg-gray-50 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <BackButton />
                {/* Header Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6"
                >
                    <div className="bg-gradient-to-r from-primary to-blue-600 px-8 py-10 text-white relative">
                        <div className="flex flex-col sm:flex-row items-center sm:items-end space-y-4 sm:space-y-0 sm:space-x-6 relative z-10">
                            <div className="h-24 w-24 bg-white rounded-full p-1 shadow-lg">
                                <div className="h-full w-full bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                                    <User className="h-12 w-12 text-gray-400" />
                                </div>
                            </div>
                            <div className="text-center sm:text-left flex-1">
                                <h1 className="text-3xl font-bold">{user.username}</h1>
                                <p className="text-blue-100 flex items-center justify-center sm:justify-start mt-1">
                                    <Shield className="w-4 h-4 mr-1" />
                                    {user.is_representative ? 'Government Representative' : 'Citizen'}
                                </p>
                            </div>
                            <div>
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition flex items-center"
                                    >
                                        <Edit2 className="w-4 h-4 mr-2" />
                                        Edit Profile
                                    </button>
                                ) : (
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => {
                                                setIsEditing(false);
                                                setFormData(user); // Reset changes
                                            }}
                                            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition flex items-center"
                                        >
                                            <X className="w-4 h-4 mr-2" />
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            className="bg-white text-primary hover:bg-gray-100 px-4 py-2 rounded-lg shadow-md transition flex items-center font-medium"
                                        >
                                            <Save className="w-4 h-4 mr-2" />
                                            Save Changes
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Decorative background pattern */}
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl"></div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="md:col-span-1 space-y-6"
                    >
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Contact Info</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</label>
                                    <div className="flex items-center mt-1 text-gray-900">
                                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                        <span className="truncate">{user.email}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</label>
                                    <div className="flex items-center mt-1">
                                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="phone"
                                                value={formData.phone || ''}
                                                onChange={handleChange}
                                                className="border-b border-gray-300 focus:border-primary focus:outline-none w-full py-1"
                                                placeholder="Add phone number"
                                            />
                                        ) : (
                                            <span className="text-gray-900">{user.phone || 'Not provided'}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                localStorage.clear();
                                navigate('/login');
                            }}
                            className="w-full bg-white border border-red-200 text-red-600 py-3 rounded-xl font-medium hover:bg-red-50 transition shadow-sm"
                        >
                            Log Out
                        </button>
                    </motion.div>

                    {/* Address Details */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="md:col-span-2"
                    >
                        <div className="bg-white rounded-xl shadow-sm p-6 h-full">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b pb-2 flex items-center">
                                <MapPin className="w-5 h-5 mr-2 text-primary" />
                                Address Details
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">State</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state || ''}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                                        />
                                    ) : (
                                        <div className="text-gray-900 font-medium">{user.state || '-'}</div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">District</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="district"
                                            value={formData.district || ''}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                                        />
                                    ) : (
                                        <div className="text-gray-900 font-medium">{user.district || '-'}</div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Taluka</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="taluka"
                                            value={formData.taluka || ''}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                                        />
                                    ) : (
                                        <div className="text-gray-900 font-medium">{user.taluka || '-'}</div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Village</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="village"
                                            value={formData.village || ''}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                                        />
                                    ) : (
                                        <div className="text-gray-900 font-medium">{user.village || '-'}</div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Pincode</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="pincode"
                                            value={formData.pincode || ''}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                                        />
                                    ) : (
                                        <div className="text-gray-900 font-medium">{user.pincode || '-'}</div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                                <div className="flex">
                                    <Building className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                                    <div>
                                        <h4 className="text-sm font-medium text-blue-900">Why is this info important?</h4>
                                        <p className="text-sm text-blue-700 mt-1">
                                            Your location details help us connect your reported issues to the correct local authorities and representatives in your area.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
