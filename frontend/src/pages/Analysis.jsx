import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { Activity, CheckCircle, AlertCircle, TrendingUp, Map, Filter } from 'lucide-react';

// Mock Data
const STATE_DATA = [
    { name: 'Maharashtra', issues: 1200, solved: 980 },
    { name: 'Gujarat', issues: 850, solved: 720 },
    { name: 'Karnataka', issues: 900, solved: 600 },
    { name: 'Tamil Nadu', issues: 750, solved: 690 },
    { name: 'UP', issues: 1500, solved: 800 },
];

const CATEGORY_DATA = [
    { name: 'Roads', value: 400, color: '#3B82F6' },
    { name: 'Water', value: 300, color: '#10B981' },
    { name: 'Electricity', value: 300, color: '#F59E0B' },
    { name: 'Sanitation', value: 200, color: '#EF4444' },
    { name: 'Others', value: 100, color: '#8B5CF6' },
];

const TREND_DATA = [
    { month: 'Jan', reported: 65, solved: 40 },
    { month: 'Feb', reported: 59, solved: 45 },
    { month: 'Mar', reported: 80, solved: 55 },
    { month: 'Apr', reported: 81, solved: 60 },
    { month: 'May', reported: 56, solved: 50 },
    { month: 'Jun', reported: 95, solved: 75 },
    { month: 'Jul', reported: 110, solved: 85 },
];

const DISTRICT_DATA = {
    'Maharashtra': [
        { name: 'Pune', issues: 300, solved: 250 },
        { name: 'Mumbai', issues: 450, solved: 400 },
        { name: 'Nagpur', issues: 200, solved: 150 },
        { name: 'Nashik', issues: 150, solved: 100 },
    ],
    'Gujarat': [
        { name: 'Ahmedabad', issues: 300, solved: 280 },
        { name: 'Surat', issues: 250, solved: 200 },
    ]
    // Add more as needed
};

const Analysis = () => {
    const [selectedState, setSelectedState] = useState('Maharashtra');

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="min-h-screen pt-20 pb-12 bg-gray-50 px-4 sm:px-6 lg:px-8">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-7xl mx-auto"
            >
                {/* Header */}
                <motion.div variants={itemVariants} className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                        Civic Impact <span className="text-primary">Analytics</span>
                    </h1>
                    <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
                        Real-time insights into governance performance, issue resolution, and community engagement across India.
                    </p>
                </motion.div>

                {/* Key Metrics Cards */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                        <div className="p-4 bg-blue-50 rounded-full mr-4">
                            <AlertCircle className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Total Issues Reported</p>
                            <h3 className="text-3xl font-bold text-gray-900">12,450</h3>
                            <p className="text-xs text-green-600 flex items-center mt-1">
                                <TrendingUp className="h-3 w-3 mr-1" /> +12% this month
                            </p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                        <div className="p-4 bg-green-50 rounded-full mr-4">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Issues Resolved</p>
                            <h3 className="text-3xl font-bold text-gray-900">8,920</h3>
                            <p className="text-xs text-green-600 flex items-center mt-1">
                                <TrendingUp className="h-3 w-3 mr-1" /> 71.6% Resolution Rate
                            </p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                        <div className="p-4 bg-purple-50 rounded-full mr-4">
                            <Activity className="h-8 w-8 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Active Engagement</p>
                            <h3 className="text-3xl font-bold text-gray-900">45k+</h3>
                            <p className="text-xs text-gray-500 mt-1">Citizens & Representatives</p>
                        </div>
                    </div>
                </motion.div>

                {/* Main Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* State Performance */}
                    <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-900">State-wise Performance</h3>
                            <div className="p-2 bg-gray-50 rounded-lg">
                                <Map className="h-5 w-5 text-gray-500" />
                            </div>
                        </div>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={STATE_DATA} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    />
                                    <Legend />
                                    <Bar dataKey="issues" name="Reported" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="solved" name="Solved" fill="#10B981" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Category Distribution */}
                    <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Issue Categories</h3>
                            <div className="p-2 bg-gray-50 rounded-lg">
                                <Filter className="h-5 w-5 text-gray-500" />
                            </div>
                        </div>
                        <div className="h-80 flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={CATEGORY_DATA}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {CATEGORY_DATA.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend layout="vertical" verticalAlign="middle" align="right" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                </div>

                {/* Trend Analysis */}
                <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-12">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-900">Resolution Trend (2025)</h3>
                        <p className="text-sm text-gray-500">Monthly comparison of reported vs solved issues</p>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={TREND_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorReported" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorSolved" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                                <Area type="monotone" dataKey="reported" stroke="#3B82F6" fillOpacity={1} fill="url(#colorReported)" strokeWidth={3} />
                                <Area type="monotone" dataKey="solved" stroke="#10B981" fillOpacity={1} fill="url(#colorSolved)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* District Drill-down */}
                <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">District-wise Breakdown</h3>
                            <p className="text-sm text-gray-500">Deep dive into specific regions</p>
                        </div>
                        <select
                            value={selectedState}
                            onChange={(e) => setSelectedState(e.target.value)}
                            className="mt-4 sm:mt-0 block w-full sm:w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                        >
                            {Object.keys(DISTRICT_DATA).map(state => (
                                <option key={state} value={state}>{state}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {DISTRICT_DATA[selectedState] ? (
                            DISTRICT_DATA[selectedState].map((district, index) => (
                                <motion.div
                                    key={district.name}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow bg-gray-50"
                                >
                                    <h4 className="font-bold text-gray-900 mb-2">{district.name}</h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Reported</span>
                                            <span className="font-medium">{district.issues}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                                            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '100%' }}></div>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Solved</span>
                                            <span className="font-medium text-green-600">{district.solved}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                                            <div
                                                className="bg-green-500 h-1.5 rounded-full"
                                                style={{ width: `${(district.solved / district.issues) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-8 text-gray-500">
                                No detailed data available for this region yet.
                            </div>
                        )}
                    </div>
                </motion.div>

            </motion.div>
        </div>
    );
};

export default Analysis;
