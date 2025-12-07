import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, AlertTriangle, MapPin, Calendar, ArrowRight, MessageSquare } from 'lucide-react';
import config from '../config';
import BackButton from '../components/BackButton';

const TrackIssue = () => {
    const [searchId, setSearchId] = useState('');
    const [issue, setIssue] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (issue && issue.id) {
            scrollToBottom();
            // Poll for comments
            intervalRef.current = setInterval(() => {
                fetchComments(issue.id);
            }, 5000);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [issue, comments]);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setIssue(null);
        setComments([]);
        try {
            // Remove 'ISS-' prefix and any '#' characters, then trim
            const id = searchId.replace(/^(ISS-|#)/i, '').trim();
            if (!id) {
                setError('Please enter a valid Issue ID.');
                setLoading(false);
                return;
            }
            const response = await fetch(`${config.API_BASE_URL}/api/issues/${id}/`);
            if (response.ok) {
                const data = await response.json();
                setIssue(data);
                fetchComments(id);
            } else {
                setError('Issue not found. Please check the ID.');
            }
        } catch (err) {
            setError('Error fetching issue. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async (id) => {
        try {
            const headers = {};
            const token = localStorage.getItem('token');
            if (token) {
                headers['Authorization'] = `Token ${token}`;
            }

            const response = await fetch(`${config.API_BASE_URL}/api/issues/${id}/comments/`, {
                headers: headers
            });
            if (response.ok) {
                const data = await response.json();
                setComments(data);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const response = await fetch(`${config.API_BASE_URL}/api/issues/${issue.id}/comments/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: newComment })
            });

            if (response.ok) {
                setNewComment('');
                fetchComments(issue.id);
            }
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    };

    return (
        <div className="min-h-screen pt-20 pb-12 bg-gray-50 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <BackButton />
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Track Issue Status
                    </h1>
                    <p className="mt-4 text-lg text-gray-600">
                        Enter your Issue ID to check the current status and chat with officials.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white p-6 rounded-xl shadow-md mb-10"
                >
                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-grow relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3"
                                placeholder="Enter Issue ID (e.g., ISS-12345)"
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition shadow-md"
                        >
                            Track Status
                        </button>
                    </form>
                </motion.div>

                <div className="space-y-6">
                    {loading && <div className="text-center text-gray-500">Searching...</div>}
                    {error && <div className="text-center text-red-500">{error}</div>}

                    {issue && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-lg shadow hover:shadow-lg transition p-6"
                        >
                            <div className="flex flex-col sm:flex-row justify-between items-start mb-6">
                                <div className="flex items-start space-x-4 mb-4 sm:mb-0">
                                    <div className="p-3 bg-gray-100 rounded-full">
                                        <MapPin className="h-6 w-6 text-gray-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{issue.title}</h3>
                                        <p className="text-sm text-gray-500">{issue.location}</p>
                                        <p className="text-xs text-gray-400 mt-1">ID: ISS-{issue.id}</p>
                                        <p className="text-gray-600 mt-2">{issue.description}</p>
                                    </div>
                                </div>
                                <span className={`px-4 py-2 rounded-full text-sm font-medium 
                                    ${issue?.status === 'OPEN' ? 'text-yellow-600 bg-yellow-100' :
                                        issue?.status === 'RESOLVED' ? 'text-green-600 bg-green-100' :
                                            issue?.status === 'ESCALATED' ? 'text-red-600 bg-red-100' :
                                                issue?.status === 'IN_PROGRESS' ? 'text-blue-600 bg-blue-100' : 'text-gray-600 bg-gray-100'}`}>
                                    {issue?.status ? issue.status.replace('_', ' ') : 'Unknown'}
                                </span>
                            </div>

                            {/* Chat Section */}
                            <div className="border-t border-gray-100 pt-6">
                                <h4 className="text-lg font-bold text-gray-900 mb-4">Discussion</h4>
                                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                                    {comments.length === 0 ? (
                                        <p className="text-gray-500 text-sm italic">No comments yet. Start a conversation.</p>
                                    ) : (
                                        comments.map((comment) => (
                                            <div key={comment.id} className={`flex ${comment.is_rep ? 'justify-start' : 'justify-end'}`}>
                                                <div className={`max-w-[80%] rounded-lg p-3 ${comment.is_rep ? 'bg-blue-50 text-blue-900' : 'bg-gray-100 text-gray-900'}`}>
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        {comment.is_rep ? <Shield className="h-3 w-3" /> : <User className="h-3 w-3" />}
                                                        <span className="text-xs font-bold">{comment.author_name}</span>
                                                        <span className="text-xs opacity-70">{new Date(comment.created_at).toLocaleString()}</span>
                                                    </div>
                                                    <p className="text-sm">{comment.text}</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                    <div ref={chatEndRef} />
                                </div>

                                {localStorage.getItem('token') ? (
                                    <form onSubmit={handleCommentSubmit} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            placeholder="Type a message..."
                                            className="flex-grow border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                        />
                                        <button
                                            type="submit"
                                            className="bg-primary text-white p-2 rounded-lg hover:bg-blue-700 transition"
                                        >
                                            <Send className="h-5 w-5" />
                                        </button>
                                    </form>
                                ) : (
                                    <p className="text-sm text-gray-500 text-center bg-gray-50 p-2 rounded">
                                        Please login to participate in the discussion.
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrackIssue;
