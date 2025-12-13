import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusCircle, MapPin, Clock, CheckCircle, List, Search, User } from 'lucide-react';
import config from '../config';

const CitizenHome = () => {
    const username = localStorage.getItem('username') || 'Citizen';
    const [stats, setStats] = useState({ total: 0, solved: 0, pending: 0 });
    const [recentIssues, setRecentIssues] = useState([]);

    useEffect(() => {
        const fetchUserStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${config.API_BASE_URL}/api/issues/`, {
                    headers: { 'Authorization': `Token ${token} ` }
                });
                if (response.ok) {
                    const data = await response.json();
                    // Filter for current user if API returns all
                    const userId = parseInt(localStorage.getItem('user_id'));
                    const myIssues = data.filter(issue => {
                        if (typeof issue.reported_by === 'object' && issue.reported_by !== null) {
                            return issue.reported_by.id === userId || issue.reported_by.username === localStorage.getItem('username');
                        }
                        return issue.reported_by === userId;
                    });

                    setStats({
                        total: myIssues.length,
                        solved: myIssues.filter(i => i.status === 'RESOLVED').length,
                        pending: myIssues.filter(i => i.status !== 'RESOLVED').length
                    });
                    setRecentIssues(myIssues.slice(0, 3));
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };
        fetchUserStats();
    }, []);

    return (
        <div className="min-h-screen pt-20 pb-12 bg-gray-50 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-3xl font-bold text-gray-900">Welcome back, <span className="text-primary">{username}</span>!</h1>
                    <p className="mt-2 text-gray-600">Here is an overview of your civic contributions.</p>
                </motion.div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                        <div className="p-3 bg-blue-100 rounded-full mr-4">
                            <PlusCircle className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Issues Raised</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                        <div className="p-3 bg-green-100 rounded-full mr-4">
                            <List className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Issues Solved</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.solved}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                        <div className="p-3 bg-yellow-100 rounded-full mr-4">
                            <Search className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Pending Resolution</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                        </div>
                    </div>
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {/* Report Issue Card */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-white rounded-xl shadow-md overflow-hidden border-t-4 border-primary"
                    >
                        <div className="p-8">
                            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                                <PlusCircle className="h-8 w-8 text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Report an Issue</h2>
                            <p className="text-gray-600 mb-8">
                                Spotted a pothole, broken streetlight, or garbage dump? Report it instantly.
                            </p>
                            <Link to="/report-issue" className="block w-full bg-primary text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                                Raise New Issue
                            </Link>
                        </div>
                    </motion.div>

                    {/* My Reports Card */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-white rounded-xl shadow-md overflow-hidden border-t-4 border-green-500"
                    >
                        <div className="p-8">
                            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                <List className="h-8 w-8 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">My Reports</h2>
                            <p className="text-gray-600 mb-8">
                                Check the status of issues you have previously reported.
                            </p>
                            <Link to="/my-reports" className="block w-full bg-green-500 text-white text-center py-3 rounded-lg font-semibold hover:bg-green-600 transition">
                                View My Reports
                            </Link>
                        </div>
                    </motion.div>

                    {/* Community Issues Card */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-white rounded-xl shadow-md overflow-hidden border-t-4 border-purple-500"
                    >
                        <div className="p-8">
                            <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                                <User className="h-8 w-8 text-purple-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Community Feed</h2>
                            <p className="text-gray-600 mb-8">
                                See what's happening in your neighborhood. View issues reported by others.
                            </p>
                            <Link to="/community" className="block w-full bg-purple-500 text-white text-center py-3 rounded-lg font-semibold hover:bg-purple-600 transition">
                                View Community Issues
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default CitizenHome;
