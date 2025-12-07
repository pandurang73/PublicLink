import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Lock, ArrowRight } from 'lucide-react';
import LocationSelector from '../components/LocationSelector';
import config from '../config';

const Signup = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        state: '',
        district: '',
        taluka: '',
        village: '',
        pincode: '',
        confirmPassword: ''
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
                    username: formData.email.split('@')[0], // Use email prefix as username for now
                    email: formData.email,
                    password: formData.password,
                    phone: formData.phone,
                    state: formData.state,
                    district: formData.district,
                    taluka: formData.taluka,
                    village: formData.village,
                    pincode: formData.pincode
                }),
            });
            const data = await response.json();
            if (response.ok) {
                navigate('/login');
            } else {
                setError(JSON.stringify(data));
            }
        } catch (err) {
            setError('Signup failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen pt-20 pb-12 flex flex-col justify-center sm:px-6 lg:px-8 bg-gray-50">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="sm:mx-auto sm:w-full sm:max-w-md"
            >
                <div className="mx-auto h-12 w-12 bg-secondary rounded-xl flex items-center justify-center shadow-lg">
                    <User className="h-8 w-8 text-white" />
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Create Citizen Account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-primary hover:text-blue-500 transition">
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
                <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-gray-100">
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
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input name="fullName" type="text" required className="focus:ring-secondary focus:border-secondary block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2" placeholder="John Doe" onChange={handleChange} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input name="email" type="email" required className="focus:ring-secondary focus:border-secondary block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2" placeholder="you@example.com" onChange={handleChange} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-gray-400" />
                                </div>
                                <input name="phone" type="tel" required className="focus:ring-secondary focus:border-secondary block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2" placeholder="+91 98765 43210" onChange={handleChange} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input name="password" type="password" required className="focus:ring-secondary focus:border-secondary block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2" placeholder="••••••••" onChange={handleChange} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input name="confirmPassword" type="password" required className="focus:ring-secondary focus:border-secondary block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2" placeholder="••••••••" onChange={handleChange} />
                            </div>
                        </div>

                        <LocationSelector formData={formData} setFormData={setFormData} />

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition transform hover:scale-105"
                            >
                                Sign up <ArrowRight className="ml-2 h-4 w-4" />
                            </button>
                        </div>
                    </form >
                </div >
            </motion.div >
        </div >
    );
};

export default Signup;
