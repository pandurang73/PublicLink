import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, MessageSquare, ThumbsUp, Filter } from 'lucide-react';
import config from '../config';
import BackButton from '../components/BackButton';

const CommunityIssues = () => {
    const navigate = useNavigate();
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchIssues = async () => {
            try {
                // Fetch all issues. In a real app, this might be paginated or filtered by location.
                // We'll use the public endpoint if available, or the authenticated one.
                // Assuming /api/issues/ is accessible to authenticated users and returns all issues.
                const token = localStorage.getItem('token');
                const headers = token ? { 'Authorization': `Token ${token} ` } : {};

                const response = await fetch(`${config.API_BASE_URL}/api/issues/`, { headers });
                if (response.ok) {
                    const data = await response.json();
                    setIssues(data);
                }
            } catch (error) {
                console.error('Error fetching community issues:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchIssues();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'OPEN': return 'bg-green-100 text-green-800';
            case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800';
            case 'ESCALATED': return 'bg-red-100 text-red-800';
            case 'RESOLVED': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) return <div className="pt-24 text-center text-gray-600">Loading community feed...</div>;

    return (
        <div className="min-h-screen pt-20 pb-12 bg-gray-50 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <BackButton />
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Community Issues Feed</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Stay informed about what's happening in your city. See issues reported by your neighbors and their resolution status.
                    </p>
                </div>

                <div className="grid gap-6">
                    {issues.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                            <p className="text-gray-500">No issues reported in the community yet.</p>
                        </div>
                    ) : (
                        issues.map((issue) => (
                            <div
                                key={issue.id}
                                onClick={() => navigate(`/issue/${issue.id}`)}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer"
                            >
                                <div className="flex flex-col md:flex-row gap-6">
                                    {issue.image && (
                                        <div className="w-full md:w-48 h-48 flex-shrink-0">
                                            <img src={issue.image} alt="Issue" className="w-full h-full object-cover rounded-lg" />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(issue.status)}`}>
                                                {issue.status.replace('_', ' ')}
                                            </span>
                                            <span className="text-xs text-gray-500">#{issue.id}</span>
                                            <span className="text-xs text-gray-500">• {new Date(issue.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{issue.title}</h3>
                                        <div className="flex items-center text-gray-500 text-sm mb-4">
                                            <MapPin className="h-4 w-4 mr-1" />
                                            {issue.location}
                                        </div>
                                        <p className="text-gray-600 mb-4 line-clamp-3">{issue.description}</p>

                                        <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-bold">
                                                    {issue.reported_by?.username?.[0]?.toUpperCase() || 'U'}
                                                </div>
                                                <span className="text-sm text-gray-500">Reported by {issue.reported_by?.username || 'Anonymous'}</span>
                                            </div>
                                            <div className="text-primary text-sm font-medium flex items-center">
                                                View Details <MessageSquare className="h-4 w-4 ml-1" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommunityIssues;
