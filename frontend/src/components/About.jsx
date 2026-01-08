import React from 'react';

const About = () => {
    return (
        <div className="pt-24 pb-16 min-h-screen bg-slate-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-extrabold text-slate-900 mb-8 text-center">About Us</h1>

                <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 mb-8 animate-fade-in-up">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4 border-b pb-2 border-slate-100">Project Details</h2>
                    <p className="text-lg text-slate-600 mb-6">
                        This is a <strong>Final Year Project</strong> dedicated to leveraging advanced artificial intelligence for the early detection of heart disease. Our goal is to make predictive healthcare accessible and accurate.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-800 mb-4 border-b pb-2 border-slate-100">Inspiration</h2>
                    <p className="text-lg text-slate-600 mb-6 italic">
                        "Heart disease remains a leading cause of mortality worldwide. We were inspired to build a tool that bridges the gap between complex medical data and actionable insights, potentially saving lives through early warning and intervention."
                    </p>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Meet the Team</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            'Shatakshi Bhushan',
                            'Jayshree Jain',
                            'Swayam Jain',
                            'Chayonika Aich',
                            'Syed Aakif Sultan'
                        ].map((member, index) => (
                            <div key={index} className="p-4 bg-slate-50 rounded-xl text-center border border-slate-100 hover:border-blue-200 transition">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
                                    👤
                                </div>
                                <p className="font-bold text-slate-800">{member}</p>
                                <p className="text-sm text-slate-500">Developer</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
