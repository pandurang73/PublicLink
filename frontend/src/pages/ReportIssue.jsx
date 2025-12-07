import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, MapPin, Tag, FileText, Send, Navigation } from 'lucide-react';
import BackButton from '../components/BackButton';
import EXIF from 'exif-js';
import config from '../config';

const ReportIssue = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Road',
        location: '',
        state: '',
        district: '',
        taluka: '',
        pincode: '',
        image: null
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFormData({ ...formData, image: file });

        // 1. Extract EXIF Data for Location
        EXIF.getData(file, function () {
            const lat = EXIF.getTag(this, "GPSLatitude");
            const lon = EXIF.getTag(this, "GPSLongitude");
            const latRef = EXIF.getTag(this, "GPSLatitudeRef");
            const lonRef = EXIF.getTag(this, "GPSLongitudeRef");

            if (lat && lon && latRef && lonRef) {
                const latitude = convertDMSToDD(lat, latRef);
                const longitude = convertDMSToDD(lon, lonRef);

                // Call reverse geocoding
                fetchAddress(latitude, longitude);
            }
        });

    };

    const convertDMSToDD = (dms, ref) => {
        let dd = dms[0] + dms[1] / 60 + dms[2] / 3600;
        if (ref === "S" || ref === "W") {
            dd = dd * -1;
        }
        return dd;
    };

    const fetchAddress = async (latitude, longitude) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await response.json();
            const address = data.address;

            setFormData(prev => ({
                ...prev,
                location: data.display_name,
                state: address.state || '',
                district: address.state_district || address.county || '',
                taluka: address.county || address.city || '',
                pincode: address.postcode || ''
            }));
        } catch (err) {
            console.error("Error fetching address from EXIF:", err);
        }
    };


    const [loading, setLoading] = useState(false);
    const [detectingLocation, setDetectingLocation] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleDetectLocation = () => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser.');
            return;
        }

        setDetectingLocation(true);
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                const data = await response.json();

                const address = data.address;
                setFormData(prev => ({
                    ...prev,
                    location: data.display_name,
                    state: address.state || '',
                    district: address.state_district || address.county || '',
                    taluka: address.county || address.city || '', // Nominatim mapping varies
                    pincode: address.postcode || ''
                }));
            } catch (err) {
                console.error("Error fetching address:", err);
                setError('Failed to fetch address details.');
            } finally {
                setDetectingLocation(false);
            }
        }, (err) => {
            console.error("Geolocation error:", err);
            setError('Unable to retrieve your location.');
            setDetectingLocation(false);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        const token = localStorage.getItem('token');
        if (!token) {
            setError('You must be logged in to report an issue.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${config.API_BASE_URL}/api/issues/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
                body: JSON.stringify({
                    title: formData.title,
                    description: formData.description,
                    location: formData.location,
                    state: formData.state,
                    district: formData.district,
                    taluka: formData.taluka,
                    pincode: formData.pincode,
                    // category: formData.category, 
                }),
            });

            if (response.ok) {
                setSuccess('Issue reported successfully!');
                setFormData({
                    title: '',
                    description: '',
                    category: 'Road',
                    location: '',
                    state: '',
                    district: '',
                    taluka: '',
                    pincode: '',
                    image: null
                });
            } else {
                const data = await response.json();
                setError(JSON.stringify(data));
            }
        } catch (err) {
            setError('Failed to report issue. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-20 pb-12 bg-gray-50 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <BackButton />
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Report a Civic Issue
                    </h1>
                    <p className="mt-4 text-lg text-gray-600">
                        Help us make the city better by reporting problems in your area.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white shadow-xl rounded-2xl overflow-hidden"
                >
                    <div className="p-8">
                        {error && <div className="bg-red-50 text-red-500 p-3 rounded mb-4 text-sm">{error}</div>}
                        {success && <div className="bg-green-50 text-green-500 p-3 rounded mb-4 text-sm">{success}</div>}
                        <form onSubmit={handleSubmit} className="space-y-6">

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Issue Title</label>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Tag className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        required
                                        className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3"
                                        placeholder="e.g., Large Pothole on Main St"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                                    onChange={handleChange}
                                >
                                    <option>Road</option>
                                    <option>Water</option>
                                    <option>Electricity</option>
                                    <option>Garbage</option>
                                    <option>Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="absolute top-3 left-3 pointer-events-none">
                                        <FileText className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        rows="4"
                                        required
                                        className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3"
                                        placeholder="Describe the issue in detail..."
                                        onChange={handleChange}
                                    ></textarea>
                                </div>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                <h3 className="text-sm font-medium text-blue-900 mb-3">Location Details</h3>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Address / Location</label>
                                    <div className="relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <MapPin className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            required
                                            className="focus:ring-primary focus:border-primary block w-full pl-10 pr-32 sm:text-sm border-gray-300 rounded-md py-3"
                                            placeholder="Enter address or use Detect Location"
                                            onChange={handleChange}
                                        />
                                        <button
                                            type="button"
                                            onClick={handleDetectLocation}
                                            disabled={detectingLocation}
                                            className="absolute inset-y-0 right-0 px-4 flex items-center bg-primary text-white hover:bg-blue-700 font-medium text-sm rounded-r-md transition disabled:opacity-70"
                                        >
                                            {detectingLocation ? (
                                                <span className="flex items-center"><span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>Detecting...</span>
                                            ) : (
                                                <span className="flex items-center"><Navigation className="h-4 w-4 mr-1" /> Detect My Location</span>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            className="focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3"
                                            placeholder="State"
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                                        <input
                                            type="text"
                                            name="district"
                                            value={formData.district}
                                            className="focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3"
                                            placeholder="District"
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Taluka</label>
                                        <input
                                            type="text"
                                            name="taluka"
                                            value={formData.taluka}
                                            className="focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3"
                                            placeholder="Taluka"
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                                        <input
                                            type="text"
                                            name="pincode"
                                            value={formData.pincode}
                                            className="focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3"
                                            placeholder="Pincode"
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Photo</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-primary transition cursor-pointer bg-gray-50 hover:bg-blue-50">
                                    <div className="space-y-1 text-center">
                                        <Camera className="mx-auto h-12 w-12 text-gray-400" />
                                        <div className="flex text-sm text-gray-600">
                                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                                                <span>Upload a file</span>
                                                <input id="file-upload" name="image" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                    </div>
                                </div>
                                <p className="mt-2 text-sm text-yellow-600 bg-yellow-50 p-2 rounded border border-yellow-200">
                                    <strong>Note:</strong> Please upload geotagged photos. This helps us locate and solve the issue faster.
                                </p>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-lg font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition transform hover:scale-105"
                                >
                                    {loading ? 'Submitting...' : 'Submit Report'} <Send className="ml-2 h-5 w-5" />
                                </button>
                            </div>

                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ReportIssue;
