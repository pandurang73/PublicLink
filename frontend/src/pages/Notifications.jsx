import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, Clock, AlertTriangle, Info } from 'lucide-react';
import config from '../config';
import BackButton from '../components/BackButton';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            const response = await fetch(`${config.API_BASE_URL}/api/issues/notifications/`, {
                headers: { 'Authorization': `Token ${token} ` }
            });
            if (response.ok) {
                const data = await response.json();
                setNotifications(data);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id, issueId) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`${config.API_BASE_URL}/api/issues/notifications/${id}/read/`, {
                method: 'POST',
                headers: { 'Authorization': `Token ${token} ` }
            });
            // Update local state
            setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));

            // Navigate to issue
            if (issueId) {
                const isRep = localStorage.getItem('is_representative') === 'true';
                if (isRep) {
                    navigate('/rep-dashboard'); // Or specific issue view if available for rep
                } else {
                    // For citizen, we can navigate to track issue page and pre-fill search? 
                    // Or better, navigate to My Reports if it's their issue, or Track Issue.
                    // Since we don't have a direct link to "Track Issue" with ID param implemented in TrackIssue.jsx yet (it takes input),
                    // we might need to update TrackIssue to accept query param or just navigate to MyReports if it's their issue.
                    // For now, let's navigate to My Reports as it's likely their issue.
                    navigate('/my-reports');
                }
            }
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`${config.API_BASE_URL}/api/issues/notifications/read/`, {
                method: 'POST',
                headers: { 'Authorization': `Token ${token} ` }
            });
            setNotifications(notifications.map(n => ({ ...n, is_read: true })));
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'COMMENT': return <MessageSquare className="h-5 w-5 text-blue-500" />;
            case 'STATUS': return <Info className="h-5 w-5 text-green-500" />;
            case 'ESCALATION': return <AlertCircle className="h-5 w-5 text-red-500" />;
            case 'NEW_ISSUE': return <Bell className="h-5 w-5 text-yellow-500" />;
            default: return <Bell className="h-5 w-5 text-gray-500" />;
        }
    };

    if (loading) return <div className="pt-24 text-center">Loading notifications...</div>;

    return (
        <div className="min-h-screen pt-20 pb-12 bg-gray-50 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <BackButton />
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                    {notifications.some(n => !n.is_read) && (
                        <button
                            onClick={markAllAsRead}
                            className="text-sm text-primary hover:text-blue-700 font-medium flex items-center"
                        >
                            <Check className="h-4 w-4 mr-1" />
                            Mark all as read
                        </button>
                    )}
                </div>

                {notifications.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <div className="mx-auto h-12 w-12 text-gray-400 mb-4 flex items-center justify-center bg-gray-100 rounded-full">
                            <Bell className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No notifications</h3>
                        <p className="mt-2 text-gray-500">You're all caught up!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                onClick={() => markAsRead(notification.id, notification.issue)}
                                className={`bg - white rounded - lg p - 4 shadow - sm border - l - 4 cursor - pointer transition - all hover: shadow - md ${notification.is_read ? 'border-gray-200 opacity-75' : 'border-primary bg-blue-50'
                                    } `}
                            >
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 mr-4 mt-1">
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="flex-grow">
                                        <p className={`text - sm ${notification.is_read ? 'text-gray-600' : 'text-gray-900 font-semibold'} `}>
                                            {notification.text}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1 flex items-center">
                                            <Clock className="h-3 w-3 mr-1" />
                                            {new Date(notification.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                    {!notification.is_read && (
                                        <div className="h-2 w-2 bg-red-500 rounded-full mt-2"></div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
