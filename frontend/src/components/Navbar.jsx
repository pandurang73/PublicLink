import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Users, FileText, User, LogOut, LayoutDashboard, Bell } from 'lucide-react';
import config from '../config';

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();
    const intervalRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);

        if (token) {
            fetchUnreadCount();
            intervalRef.current = setInterval(fetchUnreadCount, 10000); // Poll every 10s
        } else {
            setUnreadCount(0);
            if (intervalRef.current) clearInterval(intervalRef.current);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [location]);

    const fetchUnreadCount = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch(`${config.API_BASE_URL} /api/issues / notifications / `, {
                headers: { 'Authorization': `Token ${token} ` }
            });
            if (response.ok) {
                const data = await response.json();
                const unread = data.filter(n => !n.is_read).length;
                setUnreadCount(unread);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
        setUnreadCount(0);
        if (intervalRef.current) clearInterval(intervalRef.current);
        navigate('/login');
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white shadow-md fixed w-full z-50 top-0"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex-shrink-0 flex items-center space-x-3">
                        <Link to="/" className="text-2xl font-bold text-primary">PublicLink</Link>
                        {localStorage.getItem('is_representative') === 'true' && (
                            <div className="text-xs bg-blue-50 px-2 py-1 rounded-full border border-blue-100 text-blue-600 font-medium hidden sm:block">
                                Government Portal
                            </div>
                        )}
                    </div>
                    <div className="hidden md:flex space-x-8 items-center">
                        {!isLoggedIn && (
                            <>
                                <Link to="/" className="text-gray-700 hover:text-primary transition">Home</Link>
                                <Link to="/about" className="text-gray-700 hover:text-primary transition">About</Link>
                                <Link to="/community" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">Community</Link>
                                <Link to="/analysis" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">Analysis</Link>
                                <Link to="/track" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">Track Issue</Link>
                            </>
                        )}
                    </div>
                    <div className="flex space-x-4 items-center">
                        {isLoggedIn ? (
                            <>
                                {localStorage.getItem('is_representative') !== 'true' && (
                                    <Link to="/" className="text-gray-700 hover:text-primary transition px-3 py-2 flex items-center space-x-1">
                                        <Home className="w-4 h-4" />
                                        <span className="hidden md:inline">Home</span>
                                    </Link>
                                )}
                                {localStorage.getItem('is_representative') === 'true' ? (
                                    <Link to="/dashboard" className="text-gray-700 hover:text-primary transition px-3 py-2 flex items-center space-x-1">
                                        <LayoutDashboard className="w-4 h-4" />
                                        <span className="hidden md:inline">Dashboard</span>
                                    </Link>
                                ) : (
                                    <>
                                        <Link to="/community" className="text-gray-700 hover:text-primary transition px-3 py-2 flex items-center space-x-1">
                                            <Users className="w-4 h-4" />
                                            <span className="hidden md:inline">Community</span>
                                        </Link>
                                        <Link to="/my-reports" className="text-gray-700 hover:text-primary transition px-3 py-2 flex items-center space-x-1">
                                            <FileText className="w-4 h-4" />
                                            <span className="hidden md:inline">My Reports</span>
                                        </Link>
                                    </>
                                )}

                                <Link to="/notifications" className="text-gray-700 hover:text-primary transition px-3 py-2 flex items-center space-x-1 relative">
                                    <Bell className="w-5 h-5" />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-1 right-2 block h-2.5 w-2.5 rounded-full ring-2 ring-white bg-red-500"></span>
                                    )}
                                </Link>

                                <Link to="/profile" className="text-gray-700 hover:text-primary transition px-3 py-2 flex items-center space-x-1">
                                    <User className="w-4 h-4" />
                                    <span className="hidden md:inline">Profile</span>
                                </Link>
                                <button onClick={handleLogout} className="text-red-500 font-medium hover:text-red-700 px-3 py-2 flex items-center space-x-1">
                                    <LogOut className="w-4 h-4" />
                                    <span className="hidden md:inline">Logout</span>
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="text-primary font-medium hover:text-blue-700 px-3 py-2">Login</Link>
                        )}
                        {(!isLoggedIn || localStorage.getItem('is_representative') !== 'true') && (
                            <Link to="/report-issue" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hidden sm:block">
                                Raise an Issue
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
