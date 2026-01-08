import React from 'react';

const LearnMore = () => {
    return (
        <div className="pt-24 pb-16 min-h-screen bg-slate-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-extrabold text-slate-900 mb-8 text-center">Heart Health Awareness</h1>

                <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 mb-8 animate-fade-in-up">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Why Early Detection Matters?</h2>
                    <p className="text-lg text-slate-600 mb-4">
                        Cardiovascular diseases (CVDs) are the number one cause of death globally. Early detection through regular screening and AI-powered assessments can identify risks before they become critical events.
                    </p>
                    <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                        <p className="text-red-800 font-bold">Did you know?</p>
                        <p className="text-red-600">According to the WHO, approximately 17.9 million people die each year from CVDs, representing 32% of all global deaths.</p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Key Risk Factors</h2>
                    <ul className="grid sm:grid-cols-2 gap-4">
                        {[
                            { title: 'High Blood Pressure', desc: 'Increases workload on the heart.' },
                            { title: 'High Cholesterol', desc: 'Can build up plaque in arteries.' },
                            { title: 'Smoking', desc: 'Damages blood vessels and reduces oxygen.' },
                            { title: 'Diabetes', desc: 'High blood sugar damages nerves and vessels.' },
                            { title: 'Physical Inactivity', desc: 'Increases risk of obesity and hypertension.' },
                            { title: 'Unhealthy Diet', desc: 'High salt/fat intake contributes to risks.' },
                        ].map((risk, i) => (
                            <li key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                                <span className="text-blue-500 mt-1">●</span>
                                <div>
                                    <span className="font-bold text-slate-800 block">{risk.title}</span>
                                    <span className="text-sm text-slate-500">{risk.desc}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 rounded-3xl shadow-lg text-white animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                    <h2 className="text-2xl font-bold mb-4">How AI Helps?</h2>
                    <p className="text-blue-100 text-lg leading-relaxed">
                        Artificial Intelligence analyzes complex patterns in health data that might be missed by traditional methods. Our model considers over 13 unique clinical parameters to provide a personalized risk profile with high accuracy.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LearnMore;
