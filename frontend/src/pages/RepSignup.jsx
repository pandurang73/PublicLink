import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Mail, Phone, Lock, FileText, ArrowRight } from 'lucide-react';
import config from '../config';
import LocationSelector from '../components/LocationSelector';

const RepSignup = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        state: '',
        district: '',
        taluka: '',
        village: '',
        pincode: '',
        govId: '',
        password: '',
        confirmPassword: '',
        representativeLevel: 'TALUKA'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        try {
            const response = await fetch(`${config.API_BASE_URL}/api/users/register/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: formData.email.split('@')[0],
                    email: formData.email,
                    password: formData.password,
                    is_representative: true,
                    state: formData.state,
                    district: formData.district,
                    taluka: formData.taluka,
                    village: formData.village,
                    pincode: formData.pincode,
                    gov_id: formData.govId,
                    representative_level: formData.representativeLevel
                }),
            });
            const data = await response.json();
            if (response.ok) {
                navigate('/rep-login');
            } else {
                setError(JSON.stringify(data));
            }
        } catch (err) {
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen pt-20 pb-12 flex flex-col justify-center sm:px-6 lg:px-8 bg-blue-50">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="sm:mx-auto sm:w-full sm:max-w-md"
            >
                <div className="mx-auto h-12 w-12 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                    <Shield className="h-8 w-8 text-white" />
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Representative Registration
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login-rep" className="font-medium text-primary hover:text-blue-500 transition">
                        Sign in
                    </Link>
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
            >
                <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border-t-4 border-primary">
                    {error && (
                        <div className="bg-red-50 text-red-500 p-3 rounded mb-4 text-sm">
                            {error}
                        </div>
                    )}
                    <form className="space-y-6" onSubmit={handleSubmit}>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Shield className="h-5 w-5 text-gray-400" />
                                </div>
                                <input name="fullName" type="text" required className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2" placeholder="Official Name" onChange={handleChange} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Official Email</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input name="email" type="email" required className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2" placeholder="name@gov.in" onChange={handleChange} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-gray-400" />
                                </div>
                                <input name="phone" type="tel" required className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2" placeholder="+1 (555) 987-6543" onChange={handleChange} />
                            </div>
                        </div>

                        <LocationSelector formData={formData} setFormData={setFormData} isRep={true} />

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Jurisdiction Level</label>
                            <select
                                name="representativeLevel"
                                value={formData.representativeLevel}
                                onChange={handleChange}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                            >
                                <option value="VILLAGE">Village Level</option>
                                <option value="TALUKA">Taluka Level</option>
                                <option value="DISTRICT">District Level</option>
                                <option value="STATE">State Level</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Government ID Number</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FileText className="h-5 w-5 text-gray-400" />
                                </div>
                                <input name="govId" type="text" required className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2" placeholder="GOV-123456" onChange={handleChange} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input name="password" type="password" required className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2" placeholder="••••••••" onChange={handleChange} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input name="confirmPassword" type="password" required className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2" placeholder="••••••••" onChange={handleChange} />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition transform hover:scale-105"
                            >
                                Submit for Approval <ArrowRight className="ml-2 h-4 w-4" />
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default RepSignup;
