import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Send, X, Shield, User, FileText, Download, PieChart as PieIcon, BarChart as BarIcon } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import config from '../config';

const RepDashboard = () => {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [activeChatIssueId, setActiveChatIssueId] = useState(null);
    const [comments, setComments] = useState({}); // Map issueId -> comments
    const [newComment, setNewComment] = useState('');
    const navigate = useNavigate();
    const chatEndRef = useRef(null);
    const intervalRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const isRep = localStorage.getItem('is_representative');

        if (!token || isRep !== 'true') {
            navigate('/rep-login');
            return;
        }

        fetchIssues();

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [navigate]);

    useEffect(() => {
        if (activeChatIssueId) {
            // Poll for comments every 5 seconds
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

    const fetchIssues = async () => {
        try {
            const response = await fetch(`${config.API_BASE_URL}/api/issues/`, {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setIssues(Array.isArray(data) ? data : []);
            } else {
                console.error('Failed to fetch issues');
                setIssues([]);
            }
        } catch (error) {
            console.error('Error fetching issues:', error);
            setIssues([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async (issueId) => {
        try {
            const response = await fetch(`${config.API_BASE_URL}/api/issues/${issueId}/comments/`, {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setComments(prev => ({ ...prev, [issueId]: data }));
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const response = await fetch(`${config.API_BASE_URL}/api/issues/${id}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });
            if (response.ok) {
                fetchIssues();
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleEscalate = async (id) => {
        try {
            const response = await fetch(`${config.API_BASE_URL}/api/issues/${id}/escalate/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                fetchIssues(); // Refresh list
            }
        } catch (error) {
            console.error('Error escalating issue:', error);
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

    const generateReport = () => {
        const doc = new jsPDF();
        const taluka = localStorage.getItem('taluka') || 'Unknown';
        const username = localStorage.getItem('username') || 'Representative';

        // Title
        doc.setFontSize(20);
        doc.setTextColor(59, 130, 246);
        doc.text('PublicLink - Taluka Report', 105, 20, { align: 'center' });

        // Subtitle
        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text(`Taluka: ${taluka}`, 105, 30, { align: 'center' });
        doc.text(`Generated by: ${username}`, 105, 37, { align: 'center' });
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 105, 44, { align: 'center' });

        // Summary Statistics
        const totalIssues = issues.length;
        const pendingIssues = issues.filter(i => i.status === 'PENDING').length;
        const inProgressIssues = issues.filter(i => i.status === 'IN_PROGRESS').length;
        const resolvedIssues = issues.filter(i => i.status === 'RESOLVED').length;
        const escalatedIssues = issues.filter(i => i.is_escalated).length;

        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text('Summary Statistics', 14, 60);

        doc.setFontSize(10);
        doc.text(`Total Issues: ${totalIssues}`, 14, 70);
        doc.text(`Pending: ${pendingIssues}`, 14, 77);
        doc.text(`In Progress: ${inProgressIssues}`, 14, 84);
        doc.text(`Resolved: ${resolvedIssues}`, 14, 91);
        doc.text(`Escalated: ${escalatedIssues}`, 14, 98);

        if (totalIssues > 0) {
            const resolutionRate = ((resolvedIssues / totalIssues) * 100).toFixed(1);
            doc.setFontSize(11);
            doc.setTextColor(16, 185, 129);
            doc.text(`Resolution Rate: ${resolutionRate}%`, 14, 108);
        }

        // Issue Details Table
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text('Issue Details', 14, 125);

        const tableData = issues.map(issue => [
            (issue.id || '').toString().substring(0, 8),
            (issue.title || 'No Title').substring(0, 30),
            issue.status || 'UNKNOWN',
            issue.is_escalated ? 'Yes' : 'No',
            issue.created_at ? new Date(issue.created_at).toLocaleDateString() : 'N/A'
        ]);

        doc.autoTable({
            startY: 130,
            head: [['ID', 'Title', 'Status', 'Escalated', 'Date']],
            body: tableData,
            theme: 'striped',
            headStyles: { fillColor: [59, 130, 246] },
            styles: { fontSize: 8, cellPadding: 3 },
            columnStyles: {
                0: { cellWidth: 25 },
                1: { cellWidth: 70 },
                2: { cellWidth: 30 },
                3: { cellWidth: 25 },
                4: { cellWidth: 30 }
            }
        });

        // Footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text(
                `Page ${i} of ${pageCount}`,
                doc.internal.pageSize.getWidth() / 2,
                doc.internal.pageSize.getHeight() - 10,
                { align: 'center' }
            );
        }

        // Save the PDF
        doc.save(`${taluka}_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    const getStatusBadgeClass = (status) => {
        const baseClasses = "px-3 py-1 rounded-full text-xs font-bold";
        switch (status) {
            case 'OPEN': return `${baseClasses} bg-yellow-100 text-yellow-800`;
            case 'IN_PROGRESS': return `${baseClasses} bg-blue-100 text-blue-800`;
            case 'ESCALATED': return `${baseClasses} bg-red-100 text-red-800`;
            case 'RESOLVED': return `${baseClasses} bg-green-100 text-green-800`;
            default: return `${baseClasses} bg-gray-100 text-gray-800`;
        }
    };

    if (loading) return <div className="text-center mt-20 text-gray-600">Loading Dashboard...</div>;

    return (
        <div className="min-h-screen bg-gray-50 font-sans">


            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
                <header className="mb-8 flex flex-col md:flex-row justify-between items-end gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, <span className="text-primary">{localStorage.getItem('username') || 'Representative'}</span>!</h1>
                        <p className="text-gray-600">
                            Overview of reported civic issues in <span className="font-semibold text-primary">{localStorage.getItem('taluka') || 'your area'}</span>.
                        </p>
                    </div>
                    <div className="flex space-x-4">
                        <button
                            onClick={generateReport}
                            className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-colors"
                        >
                            <FileText className="h-5 w-5" />
                            <span className="hidden sm:inline">Generate Report</span>
                            <Download className="h-4 w-4" />
                        </button>
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center min-w-[120px]">
                            <div className="text-2xl font-bold text-red-500">{issues.filter(i => i.status === 'ESCALATED').length}</div>
                            <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Escalated</div>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center min-w-[120px]">
                            <div className="text-2xl font-bold text-yellow-500">{issues.filter(i => i.status === 'OPEN').length}</div>
                            <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Pending</div>
                        </div>
                    </div>
                </header>

                {/* Analytics Section */}
                {!loading && issues.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                        {/* Status Distribution */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-gray-900">Issue Status Distribution</h3>
                                <PieIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={[
                                                { name: 'Open', value: issues.filter(i => i.status === 'OPEN').length, color: '#EAB308' },
                                                { name: 'In Progress', value: issues.filter(i => i.status === 'IN_PROGRESS').length, color: '#3B82F6' },
                                                { name: 'Resolved', value: issues.filter(i => i.status === 'RESOLVED').length, color: '#10B981' },
                                                { name: 'Escalated', value: issues.filter(i => i.status === 'ESCALATED').length, color: '#EF4444' }
                                            ].filter(d => d.value > 0)}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {[
                                                { name: 'Open', value: issues.filter(i => i.status === 'OPEN').length, color: '#EAB308' },
                                                { name: 'In Progress', value: issues.filter(i => i.status === 'IN_PROGRESS').length, color: '#3B82F6' },
                                                { name: 'Resolved', value: issues.filter(i => i.status === 'RESOLVED').length, color: '#10B981' },
                                                { name: 'Escalated', value: issues.filter(i => i.status === 'ESCALATED').length, color: '#EF4444' }
                                            ].filter(d => d.value > 0).map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend verticalAlign="bottom" height={36} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Daily Trends */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-gray-900">Daily Issues Reported</h3>
                                <BarIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={Object.entries(issues.reduce((acc, issue) => {
                                            if (!issue.created_at) return acc;
                                            const dateObj = new Date(issue.created_at);
                                            if (isNaN(dateObj.getTime())) return acc;

                                            const date = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                                            acc[date] = (acc[date] || 0) + 1;
                                            return acc;
                                        }, {})).map(([date, count]) => ({ date, count })).slice(-7)} // Last 7 days
                                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} allowDecimals={false} />
                                        <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                                        <Bar dataKey="count" name="Issues Reported" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={30} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mb-8 flex flex-wrap gap-2">
                    {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'ESCALATED'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-all shadow-sm ${statusFilter === status
                                ? 'bg-primary text-white shadow-md transform scale-105'
                                : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-primary border border-gray-200'
                                }`}
                        >
                            {status === 'ALL' ? 'All Issues' : status.replace('_', ' ')}
                        </button>
                    ))}
                </div>

                <div className="grid gap-6">
                    {issues.filter(issue => statusFilter === 'ALL' || issue.status === statusFilter).length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm">
                            <p className="text-gray-500 text-lg">No issues found with status: {statusFilter.replace('_', ' ')}</p>
                        </div>
                    ) : (
                        issues
                            .filter(issue => statusFilter === 'ALL' || issue.status === statusFilter)
                            .map(issue => (
                                <div key={issue.id} className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-all shadow-sm">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="flex items-center space-x-3 mb-2">
                                                <span className={getStatusBadgeClass(issue.status)}>
                                                    {issue.status.replace('_', ' ')}
                                                </span>
                                                <span className="text-xs text-gray-400">ID: #{issue.id}</span>
                                                <span className="text-xs text-gray-400">• {new Date(issue.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-1">{issue.title}</h3>
                                            <div className="flex items-center text-gray-500 text-sm">
                                                <span className="mr-1">📍</span> {issue.location}
                                                {issue.taluka && <span className="ml-2 bg-gray-100 px-2 py-0.5 rounded text-xs text-gray-600">{issue.taluka}</span>}
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            {issue.status === 'OPEN' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(issue.id, 'IN_PROGRESS')}
                                                    className="bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border border-yellow-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                                >
                                                    Mark In Progress
                                                </button>
                                            )}
                                            {issue.status !== 'RESOLVED' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(issue.id, 'RESOLVED')}
                                                    className="bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                                >
                                                    Mark Resolved
                                                </button>
                                            )}
                                            {issue.status !== 'RESOLVED' && issue.status !== 'ESCALATED' && (
                                                <button
                                                    onClick={() => handleEscalate(issue.id)}
                                                    className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                                                >
                                                    <span>Escalate</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <p className="text-gray-600 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                                        {issue.description}
                                    </p>

                                    {/* Action Section */}
                                    <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                                        <button
                                            onClick={() => navigate(`/issue/${issue.id}`)}
                                            className="text-primary hover:text-blue-700 text-sm font-medium flex items-center"
                                        >
                                            <MessageSquare className="h-4 w-4 mr-1" />
                                            View Discussion & Details
                                        </button>
                                    </div>

                                    <div className="flex justify-between items-center border-t border-gray-100 pt-4 mt-4">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-primary text-xs font-bold">
                                                {issue.reported_by?.username?.[0]?.toUpperCase() || 'U'}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Reported by <span className="text-gray-700 font-medium">{issue.reported_by?.username || 'Unknown'}</span>
                                            </div>
                                        </div>

                                        {issue.escalation_level > 0 && (
                                            <div className="text-red-600 text-sm font-bold flex items-center bg-red-50 px-3 py-1 rounded-full">
                                                <span className="mr-2">⚠️ Escalation Level:</span>
                                                <div className="flex space-x-1">
                                                    {[...Array(issue.escalation_level)].map((_, i) => (
                                                        <div key={i} className="w-2 h-4 bg-red-500 rounded-sm"></div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                    )}
                </div>
            </div >
        </div >
    );
};

export default RepDashboard;
