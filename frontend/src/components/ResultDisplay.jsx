import React, { useState } from 'react';

const ResultDisplay = ({ result, onReset }) => {
    // result structure:
    // Clinical: { prediction: 0/1, probability: 0.88, type: 'clinical' (optional/default) }
    // Symptom: { riskLevel: 'High'/'Moderate'/'Low', advice: [...], type: 'symptom' }

    const isSymptomMode = result.type === 'symptom';

    // Clinical Mode Logic
    const isPositive = !isSymptomMode && result.prediction === 1;

    // Symptom Mode Logic
    const riskLevel = isSymptomMode ? result.riskLevel : null;
    const isHighRisk = riskLevel === 'High';
    const isModerateRisk = riskLevel === 'Moderate';

    const [loadingLocation, setLoadingLocation] = useState(false);

    const handleLocateDoctors = () => {
        setLoadingLocation(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const url = `https://www.google.com/maps/search/cardiologist/@${latitude},${longitude},13z`;
                    window.location.href = url;
                    setLoadingLocation(false);
                },
                (error) => {
                    console.error("Error getting location: ", error);
                    const url = `https://www.google.com/maps/search/cardiologist+near+me`;
                    window.location.href = url;
                    setLoadingLocation(false);
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
            setLoadingLocation(false);
        }
    };

    if (isSymptomMode) {
        return (
            <div id="result-display" className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-4xl border border-slate-100 animate-fade-in transition-all hover:shadow-2xl">
                <h2 className={`text-4xl font-extrabold text-center mb-4 ${isHighRisk ? 'text-red-600' : isModerateRisk ? 'text-orange-500' : 'text-green-500'}`}>
                    {riskLevel} Risk Assessment
                </h2>

                <p className="text-slate-600 text-center text-lg mb-8 font-light">
                    Based on your reported symptoms
                </p>

                <div className={`rounded-xl p-6 mb-8 ${isHighRisk ? 'bg-red-50 border-red-100' : isModerateRisk ? 'bg-orange-50 border-orange-100' : 'bg-green-50 border-green-100'}`}>
                    <h3 className={`font-bold text-lg mb-4 ${isHighRisk ? 'text-red-800' : isModerateRisk ? 'text-orange-800' : 'text-green-800'}`}>
                        Recommended Actions:
                    </h3>
                    <ul className="space-y-3">
                        {result.advice && result.advice.map((item, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <span className="text-xl">{isHighRisk ? '🚨' : isModerateRisk ? '⚠️' : '✅'}</span>
                                <span className="font-medium text-slate-700">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {(isHighRisk || isModerateRisk) && (
                    <div className="text-center mb-8">
                        <h3 className="text-xl font-bold text-slate-800 mb-4">Find Specialized Care Nearby</h3>
                        <p className="text-slate-500 mb-6">Locate the nearest cardiologists and heart hospitals using your current location.</p>

                        <button
                            onClick={handleLocateDoctors}
                            disabled={loadingLocation}
                            className={`w-full md:w-auto text-white font-bold py-4 px-8 rounded-xl shadow-lg transform hover:scale-[1.02] transition duration-200 flex items-center justify-center gap-3 mx-auto ${isHighRisk ? 'bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 shadow-red-500/30' : 'bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 shadow-orange-500/30'}`}
                        >
                            <span className="text-xl">📍</span>
                            {loadingLocation ? 'Locating...' : 'Find Nearest Cardiologists'}
                        </button>
                        <p className="text-xs text-slate-400 mt-2">Opens Google Maps with top-rated doctors in your area.</p>
                    </div>
                )}

                <button onClick={onReset} className="mt-4 w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 px-6 rounded-xl transition duration-200 flex items-center justify-center gap-2">
                    <span>🔄</span> Check Another Patient
                </button>
            </div>
        );
    }

    // Default Clinical Mode Display
    return (
        <div id="result-display" className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-4xl border border-slate-100 animate-fade-in transition-all hover:shadow-2xl">
            <h2 className={`text-4xl font-extrabold text-center mb-4 ${isPositive ? 'text-red-500' : 'text-green-500'}`}>
                {isPositive ? 'High Risk Detected' : 'Low Risk Detected'}
            </h2>

            <p className="text-slate-600 text-center text-lg mb-8 font-light">
                AI Confidence Score: <span className={`font-bold text-2xl ${isPositive ? 'text-red-500' : 'text-green-500'}`}>
                    {isPositive ? (result.probability * 100).toFixed(1) : ((1 - result.probability) * 100).toFixed(1)}%
                </span>
            </p>

            {isPositive ? (
                <div>
                    <div className="bg-red-50 border border-red-100 rounded-xl p-6 mb-8">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <span className="text-2xl">⚠️</span>
                            <h3 className="text-red-800 font-bold text-lg">Immediate Attention Recommended</h3>
                        </div>
                        <p className="text-red-600 text-center font-medium">
                            Our analysis suggests a high probability of heart disease. Please consult a specialist immediately.
                        </p>
                    </div>

                    {/* Explainable AI Section */}
                    {result.contributors && result.contributors.length > 0 && (
                        <div className="mb-8 p-6 bg-slate-50 border border-slate-200 rounded-xl">
                            <h3 className="text-lg font-bold text-slate-800 mb-3 border-b pb-2">Why this result?</h3>
                            <p className="text-sm text-slate-500 mb-4">
                                Based on your inputs, these are the top factors contributing to the high risk assessment:
                            </p>
                            <ul className="space-y-2">
                                {result.contributors.map((factor, index) => (
                                    <li key={index} className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
                                        <span className="text-red-500 font-bold text-lg">{index + 1}.</span>
                                        <span className="font-semibold text-slate-700">{factor}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="text-center mb-8">
                        <h3 className="text-xl font-bold text-slate-800 mb-4">Find Specialized Care Nearby</h3>
                        <p className="text-slate-500 mb-6">Locate the nearest cardiologists and heart hospitals using your current location.</p>

                        <button
                            onClick={handleLocateDoctors}
                            disabled={loadingLocation}
                            className="w-full md:w-auto bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-red-500/30 transform hover:scale-[1.02] transition duration-200 flex items-center justify-center gap-3 mx-auto"
                        >
                            <span className="text-xl">📍</span>
                            {loadingLocation ? 'Locating...' : 'Find Nearest Cardiologists'}
                        </button>
                        <p className="text-xs text-slate-400 mt-2">Opens Google Maps with top-rated doctors in your area.</p>
                    </div>
                </div>
            ) : (
                <div>
                    <div className="bg-green-50 border border-green-100 rounded-xl p-6 mb-8">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <span className="text-2xl">✅</span>
                            <h3 className="text-green-800 font-bold text-lg">Heart Health Looks Good</h3>
                        </div>
                        <p className="text-green-600 text-center font-medium">
                            Great news! Your indicators suggest a low risk of heart disease. Keep up the healthy lifestyle.
                        </p>
                    </div>

                    <h3 className="text-xl font-bold text-slate-800 mb-6 px-2 border-l-4 border-green-500 ml-1">Healthy Lifestyle Suggestions</h3>
                    <ul className="space-y-4">
                        {[
                            'Maintain a balanced diet rich in fruits and vegetables.',
                            'Exercise regularly (at least 30 mins a day).',
                            'Avoid smoking and limit alcohol consumption.',
                            'Manage stress through yoga or meditation.',
                            'Monitor your blood pressure and cholesterol periodically.'
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <span className="text-green-500 font-bold">•</span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <button onClick={onReset} className="mt-10 w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 px-6 rounded-xl transition duration-200 flex items-center justify-center gap-2">
                <span>🔄</span> Check Another Patient
            </button>
        </div>
    );
};

export default ResultDisplay;
