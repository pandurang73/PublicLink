import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, MessageSquare, Clock, CheckCircle, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import config from '../config';
import BackButton from '../components/BackButton';

const MyReports = () => {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeChatIssueId, setActiveChatIssueId] = useState(null);
    const [comments, setComments] = useState({});
    const [newComment, setNewComment] = useState('');
    const navigate = useNavigate();
    const chatEndRef = useRef(null);
    const intervalRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchMyIssues = async () => {
            try {
                const response = await fetch(`${config.API_BASE_URL}/api/issues/`, {
                    headers: {
                        'Authorization': `Token ${token} `
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    const userId = parseInt(localStorage.getItem('user_id'));

                    const myIssues = data.filter(issue => {
                        if (typeof issue.reported_by === 'object' && issue.reported_by !== null) {
                            return issue.reported_by.id === userId || issue.reported_by.username === localStorage.getItem('username');
                        }
                        return issue.reported_by === userId;
                    });
                    setIssues(myIssues);
                }
            } catch (error) {
                console.error('Error fetching my issues:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMyIssues();

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [navigate]);

    useEffect(() => {
        if (activeChatIssueId) {
            fetchComments(activeChatIssueId);
            intervalRef.current = setInterval(() => {
                fetchComments(activeChatIssueId);
            }, 5000);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [activeChatIssueId]);

    useEffect(() => {
        scrollToBottom();
    }, [comments, activeChatIssueId]);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchComments = async (issueId) => {
        try {
            const token = localStorage.getItem('token');
            const headers = token ? { 'Authorization': `Token ${token} ` } : {};

            const response = await fetch(`${config.API_BASE_URL}/api/issues/${issueId}/comments/`, {
                headers: headers
            });
            if (response.ok) {
                const data = await response.json();
                setComments(prev => ({ ...prev, [issueId]: data }));
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const toggleChat = (issueId) => {
        if (activeChatIssueId === issueId) {
            setActiveChatIssueId(null);
        } else {
            setActiveChatIssueId(issueId);
        }
    };

    const handleCommentSubmit = async (issueId) => {
        if (!newComment.trim()) return;

        try {
            const response = await fetch(`${config.API_BASE_URL}/api/issues/${issueId}/comments/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: newComment })
            });

            if (response.ok) {
                setNewComment('');
                fetchComments(issueId);
            }
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'OPEN': return 'bg-green-100 text-green-800';
            case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800';
            case 'ESCALATED': return 'bg-red-100 text-red-800';
            case 'RESOLVED': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) return <div className="pt-24 text-center">Loading your reports...</div>;

    return (
        <div className="min-h-screen pt-20 pb-12 bg-gray-50 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <BackButton />
                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Reported Issues</h1>

                {issues.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                            <AlertCircle className="h-12 w-12" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No issues reported yet</h3>
                        <p className="mt-2 text-gray-500">You haven't reported any issues yet.</p>
                        <div className="mt-6">
                            <button
                                onClick={() => navigate('/report-issue')}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700"
                            >
                                Report an Issue
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {issues.map((issue) => (
                            <div key={issue.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                                <div className="flex justify-between items-start">
                                    <div className="flex-grow">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(issue.status)}`}>
                                                {issue.status.replace('_', ' ')}
                                            </span>
                                            <span className="text-xs text-gray-500">#{issue.id}</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{issue.title}</h3>
                                        <div className="flex items-center text-gray-500 text-sm mb-2">
                                            <MapPin className="h-4 w-4 mr-1" />
                                            {issue.location}
                                        </div>
                                        <div className="flex items-center text-gray-500 text-sm">
                                            <Calendar className="h-4 w-4 mr-1" />
                                            {new Date(issue.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                    {issue.image && (
                                        <img src={issue.image} alt="Issue" className="h-24 w-24 object-cover rounded-lg ml-4" />
                                    )}
                                </div>
                                <p className="mt-4 text-gray-600">{issue.description}</p>

                                {/* Chat Section */}
                                <div className="border-t border-gray-100 pt-4 mt-4">
                                    <button
                                        onClick={() => toggleChat(issue.id)}
                                        className="text-primary hover:text-blue-700 text-sm font-medium flex items-center mb-4"
                                    >
                                        <MessageSquare className="h-4 w-4 mr-1" />
                                        {activeChatIssueId === issue.id ? 'Hide Discussion' : 'View Discussion'}
                                    </button>

                                    {activeChatIssueId === issue.id && (
                                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                            <div className="space-y-4 mb-4 max-h-60 overflow-y-auto">
                                                {comments[issue.id]?.length > 0 ? (
                                                    comments[issue.id].map((comment) => (
                                                        <div key={comment.id} className={`flex ${comment.is_rep ? 'justify-start' : 'justify-end'}`}>
                                                            <div className={`max-w-[80%] rounded-lg p-3 ${comment.is_rep ? 'bg-blue-100 text-blue-900' : 'bg-white border border-gray-200 text-gray-900'}`}>
                                                                <div className="flex items-center space-x-2 mb-1">
                                                                    {comment.is_rep ? <Shield className="h-3 w-3" /> : <User className="h-3 w-3" />}
                                                                    <span className="text-xs font-bold">{comment.author_name}</span>
                                                                    <span className="text-xs opacity-70">{new Date(comment.created_at).toLocaleString()}</span>
                                                                </div>
                                                                <p className="text-sm">{comment.text}</p>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-gray-500 text-sm italic text-center">No comments yet.</p>
                                                )}
                                                <div ref={chatEndRef} />
                                            </div>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={newComment}
                                                    onChange={(e) => setNewComment(e.target.value)}
                                                    placeholder="Type a response..."
                                                    className="flex-grow border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
                                                />
                                                <button
                                                    onClick={() => handleCommentSubmit(issue.id)}
                                                    className="bg-primary text-white p-2 rounded-lg hover:bg-blue-700 transition"
                                                >
                                                    <Send className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
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

export default MyReports;
