import React, { useState } from 'react';
import axios from 'axios';

const PredictionForm = ({ onResult }) => {
    // Modes: 'clinical' (ML model) or 'symptom' (Rule-based)
    const [mode, setMode] = useState('clinical');

    // Clinical Data State
    const [formData, setFormData] = useState({
        age: '', sex: '1', cp: '0', trestbps: '', chol: '',
        fbs: '0', restecg: '0', thalach: '', exang: '0',
        oldpeak: '', slope: '0', ca: '0', thal: '0'
    });

    // Symptom Data State
    const [symptomData, setSymptomData] = useState({
        chestPain: false,
        shortnessOfBreath: false,
        palpitations: false,
        legSwelling: false,
        fatigue: false,
        dizziness: false
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleClinicalChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSymptomChange = (e) => {
        setSymptomData({ ...symptomData, [e.target.name]: e.target.checked });
    };

    const assessSymptoms = () => {
        setLoading(true);
        // Rule-Based Logic
        let riskLevel = 'Low';
        let advice = [];

        const { chestPain, shortnessOfBreath, palpitations, legSwelling, fatigue, dizziness } = symptomData;

        const seriousSymptomsCount = [chestPain, shortnessOfBreath, palpitations].filter(Boolean).length;
        const totalSymptomsCount = Object.values(symptomData).filter(Boolean).length;

        if (chestPain || (shortnessOfBreath && seriousSymptomsCount >= 2)) {
            riskLevel = 'High';
            advice = [
                "Seek emergency medical care immediately.",
                "Do not drive yourself to the hospital.",
                "Chew an aspirin if available and not allergic.",
                "Try to stay calm and sit down."
            ];
        } else if (totalSymptomsCount >= 3 || palpitations || legSwelling) {
            riskLevel = 'Moderate';
            advice = [
                "Consult a cardiologist within 24 hours.",
                "Monitor your blood pressure and heart rate.",
                "Avoid physical exertion until consulted.",
                "Limit salt intake if experiencing swelling."
            ];
        } else {
            riskLevel = 'Low';
            advice = [
                "Monitor your symptoms for the next 3 days.",
                "Ensure you are staying well-hydrated.",
                "Maintain a regular sleep schedule.",
                "Reduce caffeine and stress levels."
            ];
        }

        // Simulate a small delay for "analysis" feel
        setTimeout(() => {
            onResult({
                type: 'symptom',
                riskLevel: riskLevel,
                advice: advice
            });
            setLoading(false);
        }, 800);
    };

    const handleClinicalSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await axios.post('http://localhost:5000/predict', formData);
            onResult({ ...response.data, type: 'clinical' });
        } catch (err) {
            setError('Error predicting. Please ensure backend is running.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id="prediction-form" className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-4xl border border-slate-100 transition-all hover:shadow-2xl">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Heart Health Assessment</h2>
                <div className="flex justify-center mt-4">
                    <div className="bg-slate-100 p-1 rounded-xl inline-flex relative">
                        <button
                            onClick={() => setMode('clinical')}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${mode === 'clinical' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Clinical Analysis (AI)
                        </button>
                        <button
                            onClick={() => setMode('symptom')}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${mode === 'symptom' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Symptom Checker
                        </button>
                    </div>
                </div>
            </div>

            {mode === 'clinical' ? (
                <form onSubmit={handleClinicalSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Age */}
                    <div>
                        <label className="block text-slate-700 text-sm font-semibold mb-2">Age (years)</label>
                        <input type="number" name="age" required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-slate-800 transition placeholder-slate-400" placeholder="e.g. 45" onChange={handleClinicalChange} />
                    </div>

                    {/* Sex */}
                    <div>
                        <label className="block text-slate-700 text-sm font-semibold mb-2">Sex</label>
                        <select name="sex" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-slate-800 transition" onChange={handleClinicalChange}>
                            <option value="1">Male</option>
                            <option value="0">Female</option>
                        </select>
                    </div>

                    {/* CP */}
                    <div>
                        <label className="block text-slate-700 text-sm font-semibold mb-2">Chest Pain Type</label>
                        <select name="cp" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-slate-800 transition" onChange={handleClinicalChange}>
                            <option value="0">Typical Angina</option>
                            <option value="1">Atypical Angina</option>
                            <option value="2">Non-anginal Pain</option>
                            <option value="3">Asymptomatic</option>
                        </select>
                    </div>

                    {/* Resting BP */}
                    <div>
                        <label className="block text-slate-700 text-sm font-semibold mb-2">Resting BP (mm Hg)</label>
                        <div className="relative">
                            <input type="number" name="trestbps" required placeholder="e.g. 120" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-slate-800 transition placeholder-slate-400" onChange={handleClinicalChange} />
                            <span className="absolute right-4 top-3.5 text-slate-400 text-sm font-medium">mmHg</span>
                        </div>
                    </div>

                    {/* Cholesterol */}
                    <div>
                        <label className="block text-slate-700 text-sm font-semibold mb-2">Cholesterol (mg/dl)</label>
                        <div className="relative">
                            <input type="number" name="chol" required placeholder="e.g. 200" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-slate-800 transition placeholder-slate-400" onChange={handleClinicalChange} />
                            <span className="absolute right-4 top-3.5 text-slate-400 text-sm font-medium">mg/dl</span>
                        </div>
                    </div>

                    {/* FBS */}
                    <div>
                        <label className="block text-slate-700 text-sm font-semibold mb-2">Fasting Blood Sugar ({">"} 120 mg/dl)</label>
                        <select name="fbs" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-slate-800 transition" onChange={handleClinicalChange}>
                            <option value="0">False</option>
                            <option value="1">True</option>
                        </select>
                    </div>

                    {/* RestECG */}
                    <div>
                        <label className="block text-slate-700 text-sm font-semibold mb-2">Resting ECG</label>
                        <select name="restecg" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-slate-800 transition" onChange={handleClinicalChange}>
                            <option value="0">Normal</option>
                            <option value="1">ST-T Wave Abnormality</option>
                            <option value="2">Left Ventricular Hypertrophy</option>
                        </select>
                    </div>

                    {/* Max Heart Rate */}
                    <div>
                        <label className="block text-slate-700 text-sm font-semibold mb-2">Max Heart Rate</label>
                        <input type="number" name="thalach" required placeholder="e.g. 150" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-slate-800 transition placeholder-slate-400" onChange={handleClinicalChange} />
                    </div>

                    {/* ExAng */}
                    <div>
                        <label className="block text-slate-700 text-sm font-semibold mb-2">Exercise Induced Angina</label>
                        <select name="exang" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-slate-800 transition" onChange={handleClinicalChange}>
                            <option value="0">No</option>
                            <option value="1">Yes</option>
                        </select>
                    </div>

                    {/* Oldpeak */}
                    <div>
                        <label className="block text-slate-700 text-sm font-semibold mb-2">Oldpeak (ST Depression)</label>
                        <input type="number" step="0.1" name="oldpeak" required placeholder="e.g. 1.0" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-slate-800 transition placeholder-slate-400" onChange={handleClinicalChange} />
                    </div>

                    {/* Slope */}
                    <div>
                        <label className="block text-slate-700 text-sm font-semibold mb-2">Slope of Peak Exercise ST</label>
                        <select name="slope" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-slate-800 transition" onChange={handleClinicalChange}>
                            <option value="0">Upsloping</option>
                            <option value="1">Flat</option>
                            <option value="2">Downsloping</option>
                        </select>
                    </div>

                    {/* CA */}
                    <div>
                        <label className="block text-slate-700 text-sm font-semibold mb-2">Major Vessels (0-3)</label>
                        <input type="number" name="ca" min="0" max="3" required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-slate-800 transition placeholder-slate-400" onChange={handleClinicalChange} />
                    </div>

                    {/* Thal */}
                    <div className="md:col-span-2">
                        <label className="block text-slate-700 text-sm font-semibold mb-2">Thalassemia</label>
                        <select name="thal" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-slate-800 transition" onChange={handleClinicalChange}>
                            <option value="0">Normal</option>
                            <option value="1">Fixed Defect</option>
                            <option value="2">Reversable Defect</option>
                        </select>
                    </div>

                    <div className="md:col-span-2 mt-6">
                        <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-blue-500/30 transform hover:scale-[1.01] transition duration-200 disabled:opacity-50 text-lg">
                            {loading ? 'Analyzing Clinical Data...' : 'Generate Prediction'}
                        </button>
                        <p className="text-center text-xs text-slate-400 mt-4">
                            *This tool is for screening purposes only and should not replace professional medical advice.
                        </p>
                    </div>
                    {error && <p className="text-red-500 text-center mt-2 md:col-span-2 bg-red-50 p-3 rounded-lg border border-red-200">{error}</p>}
                </form>
            ) : (
                <div className="space-y-6">
                    <p className="text-slate-600 mb-6 text-center">Check all that apply to you currently. This quick check will provide advice based on common symptoms.</p>

                    <div className="grid grid-cols-1 gap-4">
                        {[
                            { id: 'chestPain', label: 'Do you feel Chest Pain or Tightness?' },
                            { id: 'shortnessOfBreath', label: 'Are you experiencing Shortness of Breath?' },
                            { id: 'palpitations', label: 'Do you have Palpitations (Irregular Heartbeat)?' },
                            { id: 'legSwelling', label: 'Do you have swelling in your legs or ankles?' },
                            { id: 'fatigue', label: 'Are you experiencing extreme or unusual fatigue?' },
                            { id: 'dizziness', label: 'Have you felt dizzy or lightheaded?' }
                        ].map((symptom) => (
                            <label key={symptom.id} className={`flex items-center p-4 rounded-xl border-2 transition-all cursor-pointer ${symptomData[symptom.id] ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:border-slate-200'}`}>
                                <input
                                    type="checkbox"
                                    name={symptom.id}
                                    checked={symptomData[symptom.id]}
                                    onChange={handleSymptomChange}
                                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                                />
                                <span className="ml-3 font-semibold text-slate-700">{symptom.label}</span>
                            </label>
                        ))}
                    </div>

                    <div className="mt-8">
                        <button onClick={assessSymptoms} disabled={loading} className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-teal-500/30 transform hover:scale-[1.01] transition duration-200 disabled:opacity-50 text-lg">
                            {loading ? 'Assessing Symptoms...' : 'Analyze Symptoms'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PredictionForm;
