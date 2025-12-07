import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Zap, Globe, Heart, Award } from 'lucide-react';

const About = () => {
    return (
        <div className="pt-16 min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 to-blue-900 overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
                </div>

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight"
                    >
                        Empowering Citizens. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                            Transforming Cities.
                        </span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed"
                    >
                        PublicLink is more than just a platform; it's a movement towards transparent, efficient, and collaborative governance. We bridge the gap between the people and the administration.
                    </motion.p>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Mission</h2>
                            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                                To provide a seamless, digital interface for citizens to report civic issues and for authorities to resolve them efficiently. We believe that every voice matters and every problem deserves a solution.
                            </p>
                            <div className="flex items-center space-x-4 text-slate-700 font-medium">
                                <div className="flex items-center">
                                    <Shield className="w-5 h-5 text-blue-600 mr-2" />
                                    Trust
                                </div>
                                <div className="flex items-center">
                                    <Zap className="w-5 h-5 text-yellow-500 mr-2" />
                                    Speed
                                </div>
                                <div className="flex items-center">
                                    <Globe className="w-5 h-5 text-green-500 mr-2" />
                                    Impact
                                </div>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl transform rotate-3 opacity-10"></div>
                            <img
                                src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                alt="Community Collaboration"
                                className="rounded-2xl shadow-2xl relative z-10 w-full object-cover h-80"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl font-bold text-slate-900"
                        >
                            About PublicLink
                        </motion.h2>
                        <p className="mt-4 text-lg text-slate-600">The principles that guide every feature we build.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Users className="w-8 h-8 text-blue-500" />,
                                title: "Community First",
                                desc: "We build for the people. Every feature is designed to make civic participation easier and more effective."
                            },
                            {
                                icon: <Heart className="w-8 h-8 text-red-500" />,
                                title: "Empathy & Care",
                                desc: "We understand the frustration of unresolved issues. We strive to make the resolution process as painless as possible."
                            },
                            {
                                icon: <Award className="w-8 h-8 text-yellow-500" />,
                                title: "Excellence",
                                desc: "We are committed to high standards of reliability, security, and performance in our technology."
                            }
                        ].map((value, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="p-8 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors duration-300 border border-slate-100"
                            >
                                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm mb-6">
                                    {value.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{value.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{value.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-blue-600">
                <div className="max-w-4xl mx-auto text-center px-4">
                    <motion.h2
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-bold text-white mb-6"
                    >
                        Ready to make a difference?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-blue-100 text-lg mb-8"
                    >
                        Join thousands of citizens who are actively shaping their cities.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                    >
                        <a href="/signup" className="inline-block bg-white text-blue-600 font-bold py-4 px-10 rounded-full shadow-lg hover:bg-blue-50 transition transform hover:scale-105">
                            Join PublicLink Today
                        </a>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default About;
