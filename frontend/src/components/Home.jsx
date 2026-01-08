import React, { useState } from 'react';
import PredictionForm from './PredictionForm';
import ResultDisplay from './ResultDisplay';
import heartHero from '../assets/heart_hero.png';

const Home = () => {
    const [result, setResult] = useState(null);

    const scrollToPredict = () => {
        setResult(null);
        setTimeout(() => {
            const element = document.getElementById('prediction-section');
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    return (
        <>
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8 animate-fade-in-up">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-100 text-blue-700 text-sm font-semibold">
                                <span>✨</span> <span>Advanced AI Diagnostics</span>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-slate-900">
                                Protect Your Heart with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">AI</span>
                            </h1>
                            <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
                                Detect heart disease risks early with our advanced machine learning algorithm. Fast, accurate, and easy to use.
                            </p>
                            <div className="flex items-center gap-4">
                                <button onClick={scrollToPredict} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition shadow-xl shadow-blue-500/25 flex items-center gap-2 transform hover:-translate-y-1">
                                    Start Analysis <span>→</span>
                                </button>
                            </div>
                            <div className="flex items-center gap-8 pt-4">
                                <div>
                                    <p className="text-3xl font-bold text-slate-900">88.33%</p>
                                    <p className="text-slate-500 text-sm">Accuracy Rate</p>
                                </div>
                                <div className="h-12 w-px bg-slate-200"></div>
                                <div>
                                    <p className="text-3xl font-bold text-slate-900">24/7</p>
                                    <p className="text-slate-500 text-sm">Availability</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative animate-float pointer-events-none">
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 blur-3xl rounded-full transform scale-110"></div>
                            <img src={heartHero} alt="3D Heart Illustration" className="relative z-10 w-full drop-shadow-2xl" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features / Statistics Section */}
            <section className="py-20 bg-white border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: '⚡', title: 'Instant Results', desc: 'Get immediate analysis of your heart health indicators.' },
                            { icon: '🛡️', title: 'Private & Secure', desc: 'Your data is processed locally and never stored permanently.' },
                            { icon: '🩺', title: 'Medical Grade', desc: 'Built with parameters used by top cardiologists worldwide.' }
                        ].map((feature, i) => (
                            <div key={i} className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-100 hover:shadow-lg transition group">
                                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-3xl shadow-sm mb-6 group-hover:scale-110 transition">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Prediction Section */}
            <section id="prediction-section" className="py-24 bg-slate-50 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 items-center flex flex-col">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Start Your Assessment</h2>
                        <p className="text-lg text-slate-600">Enter your clinical details below. Our AI model will analyze your data against thousands of verified cases.</p>
                    </div>

                    {!result ? (
                        <PredictionForm onResult={setResult} />
                    ) : (
                        <ResultDisplay result={result} onReset={() => setResult(null)} />
                    )}
                </div>
            </section>
        </>
    );
};

export default Home;
