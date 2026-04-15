import React, { useState } from 'react';
import PredictionForm from './PredictionForm';
import ResultDisplay from './ResultDisplay';
import heartHero from '../assets/heart_hero.png';

const Home = () => {
    const [result, setResult] = useState(null);
    const [checklistState, setChecklistState] = useState({
        exercise: false,
        noSmoking: false,
        lowSalt: false,
        sleep: false,
        hydration: false
    });

    const checklistItems = [
        { key: 'exercise', label: '30 minutes of physical activity' },
        { key: 'noSmoking', label: 'No smoking or tobacco today' },
        { key: 'lowSalt', label: 'Low-salt and balanced meals' },
        { key: 'sleep', label: '7-8 hours of quality sleep' },
        { key: 'hydration', label: 'Stayed well hydrated' }
    ];

    const completedCount = Object.values(checklistState).filter(Boolean).length;
    const progressPercentage = Math.round((completedCount / checklistItems.length) * 100);

    const scrollToPredict = () => {
        setResult(null);
        setTimeout(() => {
            const element = document.getElementById('prediction-section');
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleChecklistToggle = (key) => {
        setChecklistState((prev) => ({
            ...prev,
            [key]: !prev[key]
        }));
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

            {/* Interactive Prevention Checklist */}
            <section className="py-20 bg-gradient-to-b from-blue-50 to-slate-50 border-b border-slate-100">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-lg p-8 md:p-10">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                            <div>
                                <h2 className="text-3xl font-extrabold text-slate-900">Daily Heart-Healthy Checklist</h2>
                                <p className="text-slate-600 mt-2">Track healthy habits before running your AI assessment.</p>
                            </div>
                            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-bold">
                                {completedCount}/{checklistItems.length} completed
                            </div>
                        </div>

                        <div className="mb-8">
                            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300"
                                    style={{ width: `${progressPercentage}%` }}
                                ></div>
                            </div>
                            <p className="text-sm text-slate-500 mt-2">Wellness score: <span className="font-semibold text-slate-700">{progressPercentage}%</span></p>
                        </div>

                        <div className="grid gap-3">
                            {checklistItems.map((item) => (
                                <label
                                    key={item.key}
                                    className={`flex items-center gap-3 p-4 rounded-xl border transition cursor-pointer ${checklistState[item.key] ? 'border-green-300 bg-green-50' : 'border-slate-200 bg-slate-50 hover:border-slate-300'}`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={checklistState[item.key]}
                                        onChange={() => handleChecklistToggle(item.key)}
                                        className="w-5 h-5 accent-blue-600"
                                    />
                                    <span className={`font-medium ${checklistState[item.key] ? 'text-green-700' : 'text-slate-700'}`}>
                                        {item.label}
                                    </span>
                                </label>
                            ))}
                        </div>

                        <p className="text-xs text-slate-500 mt-6">
                            This checklist promotes preventive awareness and does not replace medical consultation.
                        </p>
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
