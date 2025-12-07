import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, AlertTriangle, CheckCircle, ArrowRight, Shield, Users, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="pt-16">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="md:w-1/2 text-center md:text-left mb-10 md:mb-0"
                    >
                        <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                            <span className="block xl:inline">Welcome to</span>{' '}
                            <span className="block text-primary xl:inline">PublicLink</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg mx-auto md:mx-0">
                            CivicConnect bridges the gap between citizens and authorities. Report issues instantly and track their resolution.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
                            <Link to="/report-issue" className="bg-primary text-white px-8 py-3 rounded-full font-semibold text-lg shadow-lg hover:bg-blue-700 transition transform hover:scale-105 flex items-center justify-center">
                                Report an Issue <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                            <Link to="/rep-login" className="bg-white text-primary border-2 border-primary px-8 py-3 rounded-full font-semibold text-lg hover:bg-blue-50 transition transform hover:scale-105">
                                Representative Login
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="md:w-1/2 relative"
                    >
                        {/* Abstract Illustration Placeholder */}
                        <div className="relative w-full h-64 md:h-96 bg-blue-200 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20"></div>
                            <div className="text-center p-6">
                                <MapPin className="h-16 w-16 text-primary mx-auto mb-4 animate-bounce" />
                                <div className="bg-white p-4 rounded-lg shadow-lg max-w-xs mx-auto transform rotate-3 hover:rotate-0 transition">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <AlertTriangle className="h-5 w-5 text-red-500" />
                                        <span className="font-bold text-gray-800">Pothole Reported</span>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded full w-full mb-2">
                                        <div className="h-2 bg-yellow-400 rounded-full w-2/3"></div>
                                    </div>
                                    <p className="text-xs text-gray-500">Processing...</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Trusted Government Section */}
            <section className="bg-slate-900 py-24 relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 right-0 w-64 h-64 bg-yellow-500 rounded-full blur-3xl"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-yellow-500 font-semibold tracking-wider uppercase text-sm"
                        >
                            Official Government Portal
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-3xl md:text-5xl font-bold text-white mt-2 mb-6"
                        >
                            Trusted. Secure. Transparent.
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-slate-400 max-w-2xl mx-auto text-lg"
                        >
                            Built on government-grade infrastructure to ensure your data is safe while providing real-time transparency in civic administration.
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Shield className="h-8 w-8 text-yellow-500" />,
                                title: "Secure Infrastructure",
                                desc: "End-to-end encryption and government-compliant data protection standards.",
                                border: "border-yellow-500/20"
                            },
                            {
                                icon: <Users className="h-8 w-8 text-blue-400" />,
                                title: "Citizen-Centric",
                                desc: "Designed for accessibility and ease of use for every citizen in the community.",
                                border: "border-blue-400/20"
                            },
                            {
                                icon: <Activity className="h-8 w-8 text-green-400" />,
                                title: "Real-Time Tracking",
                                desc: "Watch your complaints move through the system with live status updates.",
                                border: "border-green-400/20"
                            }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 + 0.3 }}
                                className={`bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border ${item.border} hover:bg-slate-800 transition-colors duration-300 group`}
                            >
                                <div className="bg-slate-900 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-slate-700">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                                <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">Simple steps to make your city better.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: <AlertTriangle className="h-10 w-10 text-white" />, title: "1. Report Issue", desc: "Take a photo, add location, and describe the problem.", color: "bg-red-500" },
                            { icon: <MapPin className="h-10 w-10 text-white" />, title: "2. Auto-Routing", desc: "System identifies the area and notifies the correct representative.", color: "bg-blue-500" },
                            { icon: <CheckCircle className="h-10 w-10 text-white" />, title: "3. Resolution", desc: "Authority resolves the issue and you get notified.", color: "bg-green-500" }
                        ].map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                className="bg-gray-50 rounded-xl p-8 text-center hover:shadow-xl transition duration-300 border border-gray-100"
                            >
                                <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 shadow-lg ${step.color}`}>
                                    {step.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                                <p className="text-gray-600">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section >
        </div >
    );
};

export default LandingPage;
