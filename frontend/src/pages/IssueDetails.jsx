import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, User, MessageSquare, Send, Shield, ArrowLeft, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import config from '../config';
import BackButton from '../components/BackButton';

const IssueDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [issue, setIssue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const chatEndRef = useRef(null);
    const isRep = localStorage.getItem('is_representative') === 'true';

    useEffect(() => {
        fetchIssueDetails();
        fetchComments();
    }, [id]);

    const fetchIssueDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = token ? { 'Authorization': `Token ${token} ` } : {};
            const response = await fetch(`${config.API_BASE_URL}/api/issues/${id}/`, { headers });
            if (response.ok) {
                const data = await response.json();
                setIssue(data);
            } else {
                console.error('Failed to fetch issue details');
            }
        } catch (error) {
            console.error('Error fetching issue details:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = token ? { 'Authorization': `Token ${token}` } : {};
            const response = await fetch(`${config.API_BASE_URL}/api/issues/${id}/comments/`, { headers });
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
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch(`${config.API_BASE_URL}/api/issues/${id}/comments/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: newComment })
            });

            if (response.ok) {
                setNewComment('');
                fetchComments();
            }
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${config.API_BASE_URL}/api/issues/${id}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });
            if (response.ok) {
                fetchIssueDetails();
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleEscalate = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${config.API_BASE_URL}/api/issues/${id}/escalate/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                fetchIssueDetails();
            }
        } catch (error) {
            console.error('Error escalating issue:', error);
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

    if (loading) return <div className="pt-24 text-center">Loading details...</div>;
    if (!issue) return <div className="pt-24 text-center">Issue not found.</div>;

    return (
        <div className="min-h-screen pt-20 pb-12 bg-gray-50 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-primary mb-6 transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </button>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 sm:p-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                            <div>
                                <div className="flex items-center space-x-3 mb-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(issue.status)}`}>
                                        {issue.status.replace('_', ' ')}
                                    </span>
                                    <span className="text-sm text-gray-500">ID: #{issue.id}</span>
                                </div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{issue.title}</h1>
                                <div className="flex items-center text-gray-500 text-sm">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    {issue.location}
                                    {issue.taluka && <span className="ml-2 bg-gray-100 px-2 py-0.5 rounded text-xs text-gray-600">{issue.taluka}</span>}
                                </div>
                            </div>

                            {isRep && (
                                <div className="flex flex-col gap-2 w-full sm:w-auto">
                                    {issue.status === 'OPEN' && (
                                        <button onClick={() => handleStatusUpdate('IN_PROGRESS')} className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition text-sm font-medium">
                                            Mark In Progress
                                        </button>
                                    )}
                                    {issue.status !== 'RESOLVED' && (
                                        <button onClick={() => handleStatusUpdate('RESOLVED')} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm font-medium">
                                            Mark Resolved
                                        </button>
                                    )}
                                    {issue.status !== 'RESOLVED' && issue.status !== 'ESCALATED' && (
                                        <button onClick={handleEscalate} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition text-sm font-medium">
                                            Escalate Issue
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="prose max-w-none text-gray-700 mb-8 bg-gray-50 p-6 rounded-lg border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                            <p>{issue.description}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="flex items-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                                <User className="h-10 w-10 text-blue-500 mr-4" />
                                <div>
                                    <p className="text-sm text-gray-500">Reported By</p>
                                    <p className="font-semibold text-gray-900">{issue.reported_by?.username || 'Anonymous'}</p>
                                </div>
                            </div>
                            <div className="flex items-center p-4 bg-purple-50 rounded-lg border border-purple-100">
                                <Calendar className="h-10 w-10 text-purple-500 mr-4" />
                                <div>
                                    <p className="text-sm text-gray-500">Date Reported</p>
                                    <p className="font-semibold text-gray-900">{new Date(issue.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                            {issue.escalation_level > 0 && (
                                <div className="flex items-center p-4 bg-red-50 rounded-lg border border-red-100 md:col-span-2">
                                    <AlertTriangle className="h-10 w-10 text-red-500 mr-4" />
                                    <div>
                                        <p className="text-sm text-gray-500">Escalation Status</p>
                                        <p className="font-semibold text-red-700">Level {issue.escalation_level}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Discussion Section */}
                        <div className="border-t border-gray-200 pt-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                <MessageSquare className="h-5 w-5 mr-2" />
                                Discussion & Updates
                            </h3>

                            <div className="space-y-6 mb-8 max-h-[500px] overflow-y-auto pr-2">
                                {comments.length === 0 ? (
                                    <p className="text-center text-gray-500 py-8 italic">No comments yet. Start the discussion.</p>
                                ) : (
                                    comments.map((comment) => (
                                        <div key={comment.id} className={`flex ${comment.is_rep ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`flex max-w-[80%] ${comment.is_rep ? 'flex-row-reverse' : 'flex-row'}`}>
                                                <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mt-1 ${comment.is_rep ? 'bg-blue-100 text-blue-600 ml-3' : 'bg-gray-200 text-gray-600 mr-3'}`}>
                                                    {comment.is_rep ? <Shield className="h-4 w-4" /> : <User className="h-4 w-4" />}
                                                </div>
                                                <div className={`p-4 rounded-2xl ${comment.is_rep ? 'bg-blue-50 text-blue-900 rounded-tr-none' : 'bg-gray-100 text-gray-900 rounded-tl-none'}`}>
                                                    <div className={`flex items-center space-x-2 mb-1 ${comment.is_rep ? 'justify-end' : 'justify-start'}`}>
                                                        <span className="text-xs font-bold">{comment.author_name}</span>
                                                        <span className="text-xs opacity-60">{new Date(comment.created_at).toLocaleString()}</span>
                                                    </div>
                                                    <p className="text-sm whitespace-pre-wrap">{comment.text}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            <form onSubmit={handleCommentSubmit} className="relative">
                                <input
                                    type="text"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Type a message..."
                                    className="w-full border border-gray-300 rounded-full pl-6 pr-14 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none shadow-sm"
                                />
                                <button
                                    type="submit"
                                    disabled={!newComment.trim()}
                                    className="absolute right-2 top-2 bg-primary text-white p-2 rounded-full hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className="h-4 w-4" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IssueDetails;
