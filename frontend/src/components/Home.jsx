import React, { useState } from 'react';
import PredictionForm from './PredictionForm';
import ResultDisplay from './ResultDisplay';
import heartHero from '../assets/heart_hero.png';

const Home = ({ lang = 'en', translations = {} }) => {
    const [result, setResult] = useState(null);
    const t = {
        en: {
            heroBadge: 'Advanced AI Diagnostics',
            heroTitle1: 'Protect Your Heart with',
            heroTitle2: 'AI',
            heroDesc: 'Detect heart disease risks early with our advanced machine learning algorithm. Fast, accurate, and easy to use.',
            startAnalysis: 'Start Analysis',
            accuracyRate: 'Accuracy Rate',
            availability: 'Availability',
            instantResults: 'Instant Results',
            instantResultsDesc: 'Get immediate analysis of your heart health indicators.',
            privateSecure: 'Private & Secure',
            privateSecureDesc: 'Your data is processed locally and never stored permanently.',
            medicalGrade: 'Medical Grade',
            medicalGradeDesc: 'Built with parameters used by top cardiologists worldwide.',
            startAssessmentTitle: 'Start Your Assessment',
            startAssessmentDesc: 'Enter your clinical details below. Our AI model will analyze your data against thousands of verified cases.'
        },
        hi: {
            heroBadge: 'उन्नत AI निदान',
            heroTitle1: 'AI के साथ अपने दिल की',
            heroTitle2: 'सुरक्षा करें',
            heroDesc: 'हमारे उन्नत मशीन लर्निंग एल्गोरिदम से हृदय रोग का जोखिम जल्दी पहचानें। तेज, सटीक और उपयोग में आसान।',
            startAnalysis: 'विश्लेषण शुरू करें',
            accuracyRate: 'सटीकता दर',
            availability: 'उपलब्धता',
            instantResults: 'तुरंत परिणाम',
            instantResultsDesc: 'अपने हार्ट हेल्थ इंडिकेटर्स का तुरंत विश्लेषण प्राप्त करें।',
            privateSecure: 'निजी और सुरक्षित',
            privateSecureDesc: 'आपका डेटा लोकली प्रोसेस होता है और स्थायी रूप से स्टोर नहीं होता।',
            medicalGrade: 'मेडिकल ग्रेड',
            medicalGradeDesc: 'दुनिया भर के शीर्ष कार्डियोलॉजिस्ट द्वारा उपयोग किए जाने वाले मानकों पर आधारित।',
            startAssessmentTitle: 'अपना आकलन शुरू करें',
            startAssessmentDesc: 'नीचे अपनी क्लिनिकल जानकारी भरें। हमारा AI मॉडल आपके डेटा का विश्लेषण करेगा।'
        }
    };

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
                                <span>✨</span> <span>{translations.home_hero_badge || t[lang].heroBadge}</span>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-slate-900">
                                {translations.home_hero_title_1 || t[lang].heroTitle1} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{translations.home_hero_title_2 || t[lang].heroTitle2}</span>
                            </h1>
                            <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
                                {translations.home_hero_desc || t[lang].heroDesc}
                            </p>
                            <div className="flex items-center gap-4">
                                <button onClick={scrollToPredict} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition shadow-xl shadow-blue-500/25 flex items-center gap-2 transform hover:-translate-y-1">
                                    {translations.home_start_analysis || t[lang].startAnalysis} <span>→</span>
                                </button>
                            </div>
                            <div className="flex items-center gap-8 pt-4">
                                <div>
                                    <p className="text-3xl font-bold text-slate-900">88.33%</p>
                                    <p className="text-slate-500 text-sm">{translations.home_accuracy_rate || t[lang].accuracyRate}</p>
                                </div>
                                <div className="h-12 w-px bg-slate-200"></div>
                                <div>
                                    <p className="text-3xl font-bold text-slate-900">24/7</p>
                                    <p className="text-slate-500 text-sm">{translations.home_availability || t[lang].availability}</p>
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
                            { icon: '⚡', title: translations.home_instant_results || t[lang].instantResults, desc: translations.home_instant_results_desc || t[lang].instantResultsDesc },
                            { icon: '🛡️', title: translations.home_private_secure || t[lang].privateSecure, desc: translations.home_private_secure_desc || t[lang].privateSecureDesc },
                            { icon: '🩺', title: translations.home_medical_grade || t[lang].medicalGrade, desc: translations.home_medical_grade_desc || t[lang].medicalGradeDesc }
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
                        <h2 className="text-4xl font-extrabold text-slate-900 mb-4">{translations.home_start_assessment_title || t[lang].startAssessmentTitle}</h2>
                        <p className="text-lg text-slate-600">{translations.home_start_assessment_desc || t[lang].startAssessmentDesc}</p>
                    </div>

                    {!result ? (
                        <PredictionForm onResult={setResult} lang={lang} translations={translations} />
                    ) : (
                        <ResultDisplay result={result} onReset={() => setResult(null)} lang={lang} translations={translations} />
                    )}
                </div>
            </section>
        </>
    );
};

export default Home;
