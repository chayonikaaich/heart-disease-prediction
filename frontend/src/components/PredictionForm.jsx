import React, { useState } from 'react';
import axios from 'axios';

const PredictionForm = ({ onResult, lang = 'en', translations = {} }) => {
    const tx = (key, fallback) => translations[key] || fallback;
    const t = {
        en: {
            heading: 'Heart Health Assessment',
            clinicalMode: 'Clinical Analysis (AI)',
            symptomMode: 'Symptom Checker',
            clinicalLoading: 'Analyzing Clinical Data...',
            clinicalSubmit: 'Generate Prediction',
            disclaimer: '*This tool is for screening purposes only and should not replace professional medical advice.',
            error: 'Error predicting. Please ensure backend is running.',
            symptomDesc: 'Check all that apply to you currently. This quick check will provide advice based on common symptoms.',
            symptomLoading: 'Assessing Symptoms...',
            symptomSubmit: 'Analyze Symptoms'
        },
        hi: {
            heading: 'हृदय स्वास्थ्य आकलन',
            clinicalMode: 'क्लिनिकल विश्लेषण (AI)',
            symptomMode: 'लक्षण जांच',
            clinicalLoading: 'क्लिनिकल डेटा का विश्लेषण हो रहा है...',
            clinicalSubmit: 'पूर्वानुमान बनाएं',
            disclaimer: '*यह टूल केवल स्क्रीनिंग के लिए है, यह पेशेवर चिकित्सा सलाह का विकल्प नहीं है।',
            error: 'पूर्वानुमान में त्रुटि। कृपया सुनिश्चित करें कि बैकएंड चल रहा है।',
            symptomDesc: 'जो लक्षण अभी लागू होते हैं उन्हें चुनें। यह त्वरित जांच सामान्य लक्षणों के आधार पर सलाह देगी।',
            symptomLoading: 'लक्षणों का आकलन हो रहा है...',
            symptomSubmit: 'लक्षणों का विश्लेषण करें'
        }
    };
    const symptomQuestions = [
        { id: 'chestPain', label: tx('symptom_q_chest_pain', lang === 'hi' ? 'क्या आपको छाती में दर्द या जकड़न महसूस हो रही है?' : 'Do you feel Chest Pain or Tightness?') },
        { id: 'shortnessOfBreath', label: tx('symptom_q_breath', lang === 'hi' ? 'क्या आपको सांस लेने में तकलीफ हो रही है?' : 'Are you experiencing Shortness of Breath?') },
        { id: 'palpitations', label: tx('symptom_q_palpitations', lang === 'hi' ? 'क्या दिल की धड़कन अनियमित महसूस हो रही है?' : 'Do you have Palpitations (Irregular Heartbeat)?') },
        { id: 'legSwelling', label: tx('symptom_q_swelling', lang === 'hi' ? 'क्या पैरों या टखनों में सूजन है?' : 'Do you have swelling in your legs or ankles?') },
        { id: 'fatigue', label: tx('symptom_q_fatigue', lang === 'hi' ? 'क्या असामान्य या अत्यधिक थकान है?' : 'Are you experiencing extreme or unusual fatigue?') },
        { id: 'dizziness', label: tx('symptom_q_dizziness', lang === 'hi' ? 'क्या चक्कर या हल्कापन महसूस हुआ है?' : 'Have you felt dizzy or lightheaded?') }
    ];
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
                tx('symptom_advice_high_1', "Seek emergency medical care immediately."),
                tx('symptom_advice_high_2', "Do not drive yourself to the hospital."),
                tx('symptom_advice_high_3', "Chew an aspirin if available and not allergic."),
                tx('symptom_advice_high_4', "Try to stay calm and sit down.")
            ];
        } else if (totalSymptomsCount >= 3 || palpitations || legSwelling) {
            riskLevel = 'Moderate';
            advice = [
                tx('symptom_advice_moderate_1', "Consult a cardiologist within 24 hours."),
                tx('symptom_advice_moderate_2', "Monitor your blood pressure and heart rate."),
                tx('symptom_advice_moderate_3', "Avoid physical exertion until consulted."),
                tx('symptom_advice_moderate_4', "Limit salt intake if experiencing swelling.")
            ];
        } else {
            riskLevel = 'Low';
            advice = [
                tx('symptom_advice_low_1', "Monitor your symptoms for the next 3 days."),
                tx('symptom_advice_low_2', "Ensure you are staying well-hydrated."),
                tx('symptom_advice_low_3', "Maintain a regular sleep schedule."),
                tx('symptom_advice_low_4', "Reduce caffeine and stress levels.")
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
            setError(translations.form_error || t[lang].error);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id="prediction-form" className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-4xl border border-slate-100 transition-all hover:shadow-2xl">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-800 mb-2">{translations.form_heading || t[lang].heading}</h2>
                <div className="flex justify-center mt-4">
                    <div className="bg-slate-100 p-1 rounded-xl inline-flex relative">
                        <button
                            onClick={() => setMode('clinical')}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${mode === 'clinical' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            {translations.form_mode_clinical || t[lang].clinicalMode}
                        </button>
                        <button
                            onClick={() => setMode('symptom')}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${mode === 'symptom' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            {translations.form_mode_symptom || t[lang].symptomMode}
                        </button>
                    </div>
                </div>
            </div>

            {mode === 'clinical' ? (
                <form onSubmit={handleClinicalSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Age */}
                    <div>
                        <label className="block text-slate-700 text-sm font-semibold mb-2">{tx('form_age', 'Age (years)')}</label>
                        <input type="number" name="age" required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-slate-800 transition placeholder-slate-400" placeholder={tx('form_age_placeholder', 'e.g. 45')} onChange={handleClinicalChange} />
                    </div>

                    {/* Sex */}
                    <div>
                        <label className="block text-slate-700 text-sm font-semibold mb-2">{tx('form_sex', 'Sex')}</label>
                        <select name="sex" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-slate-800 transition" onChange={handleClinicalChange}>
                            <option value="1">{tx('form_male', 'Male')}</option>
                            <option value="0">{tx('form_female', 'Female')}</option>
                        </select>
                    </div>

                    {/* CP */}
                    <div>
                        <label className="block text-slate-700 text-sm font-semibold mb-2">{tx('form_cp', 'Chest Pain Type')}</label>
                        <select name="cp" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-slate-800 transition" onChange={handleClinicalChange}>
                            <option value="0">{tx('form_cp_typical', 'Typical Angina')}</option>
                            <option value="1">{tx('form_cp_atypical', 'Atypical Angina')}</option>
                            <option value="2">{tx('form_cp_nonanginal', 'Non-anginal Pain')}</option>
                            <option value="3">{tx('form_cp_asymptomatic', 'Asymptomatic')}</option>
                        </select>
                    </div>

                    {/* Resting BP */}
                    <div>
                        <label className="block text-slate-700 text-sm font-semibold mb-2">{tx('form_resting_bp', 'Resting BP (mm Hg)')}</label>
                        <div className="relative">
                            <input type="number" name="trestbps" required placeholder={tx('form_bp_placeholder', 'e.g. 120')} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-slate-800 transition placeholder-slate-400" onChange={handleClinicalChange} />
                            <span className="absolute right-4 top-3.5 text-slate-400 text-sm font-medium">mmHg</span>
                        </div>
                    </div>

                    {/* Cholesterol */}
                    <div>
                        <label className="block text-slate-700 text-sm font-semibold mb-2">{tx('form_chol', 'Cholesterol (mg/dl)')}</label>
                        <div className="relative">
                            <input type="number" name="chol" required placeholder={tx('form_chol_placeholder', 'e.g. 200')} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-slate-800 transition placeholder-slate-400" onChange={handleClinicalChange} />
                            <span className="absolute right-4 top-3.5 text-slate-400 text-sm font-medium">mg/dl</span>
                        </div>
                    </div>

                    {/* FBS */}
                    <div>
                        <label className="block text-slate-700 text-sm font-semibold mb-2">{tx('form_fbs', 'Fasting Blood Sugar (> 120 mg/dl)')}</label>
                        <select name="fbs" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-slate-800 transition" onChange={handleClinicalChange}>
                            <option value="0">{tx('form_false', 'False')}</option>
                            <option value="1">{tx('form_true', 'True')}</option>
                        </select>
                    </div>

                    {/* RestECG */}
                    <div>
                        <label className="block text-slate-700 text-sm font-semibold mb-2">{tx('form_restecg', 'Resting ECG')}</label>
                        <select name="restecg" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-slate-800 transition" onChange={handleClinicalChange}>
                            <option value="0">{tx('form_restecg_normal', 'Normal')}</option>
                            <option value="1">{tx('form_restecg_st', 'ST-T Wave Abnormality')}</option>
                            <option value="2">{tx('form_restecg_lvh', 'Left Ventricular Hypertrophy')}</option>
                        </select>
                    </div>

                    {/* Max Heart Rate */}
                    <div>
                        <label className="block text-slate-700 text-sm font-semibold mb-2">{tx('form_thalach', 'Max Heart Rate')}</label>
                        <input type="number" name="thalach" required placeholder={tx('form_thalach_placeholder', 'e.g. 150')} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-slate-800 transition placeholder-slate-400" onChange={handleClinicalChange} />
                    </div>

                    {/* ExAng */}
                    <div>
                        <label className="block text-slate-700 text-sm font-semibold mb-2">{tx('form_exang', 'Exercise Induced Angina')}</label>
                        <select name="exang" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-slate-800 transition" onChange={handleClinicalChange}>
                            <option value="0">{tx('form_no', 'No')}</option>
                            <option value="1">{tx('form_yes', 'Yes')}</option>
                        </select>
                    </div>

                    {/* Oldpeak */}
                    <div>
                        <label className="block text-slate-700 text-sm font-semibold mb-2">{tx('form_oldpeak', 'Oldpeak (ST Depression)')}</label>
                        <input type="number" step="0.1" name="oldpeak" required placeholder={tx('form_oldpeak_placeholder', 'e.g. 1.0')} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-slate-800 transition placeholder-slate-400" onChange={handleClinicalChange} />
                    </div>

                    {/* Slope */}
                    <div>
                        <label className="block text-slate-700 text-sm font-semibold mb-2">{tx('form_slope', 'Slope of Peak Exercise ST')}</label>
                        <select name="slope" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-slate-800 transition" onChange={handleClinicalChange}>
                            <option value="0">{tx('form_slope_up', 'Upsloping')}</option>
                            <option value="1">{tx('form_slope_flat', 'Flat')}</option>
                            <option value="2">{tx('form_slope_down', 'Downsloping')}</option>
                        </select>
                    </div>

                    {/* CA */}
                    <div>
                        <label className="block text-slate-700 text-sm font-semibold mb-2">{tx('form_ca', 'Major Vessels (0-3)')}</label>
                        <input type="number" name="ca" min="0" max="3" required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-slate-800 transition placeholder-slate-400" onChange={handleClinicalChange} />
                    </div>

                    {/* Thal */}
                    <div className="md:col-span-2">
                        <label className="block text-slate-700 text-sm font-semibold mb-2">{tx('form_thal', 'Thalassemia')}</label>
                        <select name="thal" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-slate-800 transition" onChange={handleClinicalChange}>
                            <option value="0">{tx('form_thal_normal', 'Normal')}</option>
                            <option value="1">{tx('form_thal_fixed', 'Fixed Defect')}</option>
                            <option value="2">{tx('form_thal_reversible', 'Reversible Defect')}</option>
                        </select>
                    </div>

                    <div className="md:col-span-2 mt-6">
                        <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-blue-500/30 transform hover:scale-[1.01] transition duration-200 disabled:opacity-50 text-lg">
                            {loading ? (translations.form_clinical_loading || t[lang].clinicalLoading) : (translations.form_clinical_submit || t[lang].clinicalSubmit)}
                        </button>
                        <p className="text-center text-xs text-slate-400 mt-4">
                            {translations.form_disclaimer || t[lang].disclaimer}
                        </p>
                    </div>
                    {error && <p className="text-red-500 text-center mt-2 md:col-span-2 bg-red-50 p-3 rounded-lg border border-red-200">{error}</p>}
                </form>
            ) : (
                <div className="space-y-6">
                    <p className="text-slate-600 mb-6 text-center">{translations.form_symptom_desc || t[lang].symptomDesc}</p>

                    <div className="grid grid-cols-1 gap-4">
                        {symptomQuestions.map((symptom) => (
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
                            {loading ? (translations.form_symptom_loading || t[lang].symptomLoading) : (translations.form_symptom_submit || t[lang].symptomSubmit)}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PredictionForm;
