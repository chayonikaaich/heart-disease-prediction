import React from 'react';

const LearnMore = ({ lang = 'en', translations = {} }) => {
    const tx = (key, fallback) => translations[key] || fallback;
    return (
        <div className="pt-24 pb-16 min-h-screen bg-slate-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-extrabold text-slate-900 mb-8 text-center">{tx('learn_title', lang === 'hi' ? 'हृदय स्वास्थ्य जागरूकता' : 'Heart Health Awareness')}</h1>

                <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 mb-8 animate-fade-in-up">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">{tx('learn_why_title', lang === 'hi' ? 'शुरुआती पहचान क्यों महत्वपूर्ण है?' : 'Why Early Detection Matters?')}</h2>
                    <p className="text-lg text-slate-600 mb-4">
                        {tx('learn_why_desc', lang === 'hi'
                            ? 'हृदय संबंधी रोग (CVDs) विश्व स्तर पर मृत्यु का प्रमुख कारण हैं। नियमित जांच और AI आधारित आकलन से जोखिम समय रहते पहचाना जा सकता है।'
                            : 'Cardiovascular diseases (CVDs) are the number one cause of death globally. Early detection through regular screening and AI-powered assessments can identify risks before they become critical events.')}
                    </p>
                    <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                        <p className="text-red-800 font-bold">{tx('learn_did_you_know', lang === 'hi' ? 'क्या आप जानते हैं?' : 'Did you know?')}</p>
                        <p className="text-red-600">{tx('learn_did_you_know_desc', lang === 'hi' ? 'WHO के अनुसार हर साल लगभग 17.9 मिलियन लोगों की मृत्यु CVDs से होती है, जो कुल वैश्विक मौतों का 32% है।' : 'According to the WHO, approximately 17.9 million people die each year from CVDs, representing 32% of all global deaths.')}</p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">{tx('learn_risk_title', lang === 'hi' ? 'मुख्य जोखिम कारक' : 'Key Risk Factors')}</h2>
                    <ul className="grid sm:grid-cols-2 gap-4">
                        {[
                            { title: tx('learn_risk_bp_title', lang === 'hi' ? 'उच्च रक्तचाप' : 'High Blood Pressure'), desc: tx('learn_risk_bp_desc', lang === 'hi' ? 'हृदय पर अतिरिक्त दबाव बढ़ाता है।' : 'Increases workload on the heart.') },
                            { title: tx('learn_risk_chol_title', lang === 'hi' ? 'उच्च कोलेस्ट्रॉल' : 'High Cholesterol'), desc: tx('learn_risk_chol_desc', lang === 'hi' ? 'धमनियों में प्लाक जमा कर सकता है।' : 'Can build up plaque in arteries.') },
                            { title: tx('learn_risk_smoking_title', lang === 'hi' ? 'धूम्रपान' : 'Smoking'), desc: tx('learn_risk_smoking_desc', lang === 'hi' ? 'रक्त वाहिनियों को नुकसान पहुंचाता है और ऑक्सीजन कम करता है।' : 'Damages blood vessels and reduces oxygen.') },
                            { title: tx('learn_risk_diabetes_title', lang === 'hi' ? 'मधुमेह' : 'Diabetes'), desc: tx('learn_risk_diabetes_desc', lang === 'hi' ? 'उच्च शुगर नसों और रक्त वाहिनियों को नुकसान पहुंचाती है।' : 'High blood sugar damages nerves and vessels.') },
                            { title: tx('learn_risk_inactivity_title', lang === 'hi' ? 'शारीरिक निष्क्रियता' : 'Physical Inactivity'), desc: tx('learn_risk_inactivity_desc', lang === 'hi' ? 'मोटापा और उच्च रक्तचाप का जोखिम बढ़ाती है।' : 'Increases risk of obesity and hypertension.') },
                            { title: tx('learn_risk_diet_title', lang === 'hi' ? 'अस्वस्थ आहार' : 'Unhealthy Diet'), desc: tx('learn_risk_diet_desc', lang === 'hi' ? 'अधिक नमक/वसा जोखिम बढ़ाते हैं।' : 'High salt/fat intake contributes to risks.') },
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
                    <h2 className="text-2xl font-bold mb-4">{tx('learn_ai_title', lang === 'hi' ? 'AI कैसे मदद करता है?' : 'How AI Helps?')}</h2>
                    <p className="text-blue-100 text-lg leading-relaxed">
                        {tx('learn_ai_desc', lang === 'hi'
                            ? 'आर्टिफिशियल इंटेलिजेंस स्वास्थ्य डेटा में ऐसे पैटर्न पहचानता है जिन्हें पारंपरिक तरीकों से पकड़ना मुश्किल हो सकता है। हमारा मॉडल 13 से अधिक क्लिनिकल पैरामीटर्स पर आधारित व्यक्तिगत जोखिम प्रोफाइल देता है।'
                            : 'Artificial Intelligence analyzes complex patterns in health data that might be missed by traditional methods. Our model considers over 13 unique clinical parameters to provide a personalized risk profile with high accuracy.')}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LearnMore;
