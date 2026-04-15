from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app)

TRANSLATIONS = {
    "en": {
        "nav_home": "Home",
        "nav_about": "About",
        "nav_learn_more": "Learn More",
        "nav_start_assessment": "Start Assessment",
        "footer_tagline": "Empowering early detection for a healthier future.",
        "lang_english": "English",
        "lang_hindi": "Hindi",
        "home_hero_badge": "Advanced AI Diagnostics",
        "home_hero_title_1": "Protect Your Heart with",
        "home_hero_title_2": "AI",
        "home_hero_desc": "Detect heart disease risks early with our advanced machine learning algorithm. Fast, accurate, and easy to use.",
        "home_start_analysis": "Start Analysis",
        "home_accuracy_rate": "Accuracy Rate",
        "home_availability": "Availability",
        "home_instant_results": "Instant Results",
        "home_instant_results_desc": "Get immediate analysis of your heart health indicators.",
        "home_private_secure": "Private & Secure",
        "home_private_secure_desc": "Your data is processed locally and never stored permanently.",
        "home_medical_grade": "Medical Grade",
        "home_medical_grade_desc": "Built with parameters used by top cardiologists worldwide.",
        "home_start_assessment_title": "Start Your Assessment",
        "home_start_assessment_desc": "Enter your clinical details below. Our AI model will analyze your data against thousands of verified cases.",
        "form_heading": "Heart Health Assessment",
        "form_mode_clinical": "Clinical Analysis (AI)",
        "form_mode_symptom": "Symptom Checker",
        "form_clinical_loading": "Analyzing Clinical Data...",
        "form_clinical_submit": "Generate Prediction",
        "form_disclaimer": "*This tool is for screening purposes only and should not replace professional medical advice.",
        "form_error": "Error predicting. Please ensure backend is running.",
        "form_symptom_desc": "Check all that apply to you currently. This quick check will provide advice based on common symptoms.",
        "form_symptom_loading": "Assessing Symptoms...",
        "form_symptom_submit": "Analyze Symptoms",
        "symptom_q_chest_pain": "Do you feel Chest Pain or Tightness?",
        "symptom_q_breath": "Are you experiencing Shortness of Breath?",
        "symptom_q_palpitations": "Do you have Palpitations (Irregular Heartbeat)?",
        "symptom_q_swelling": "Do you have swelling in your legs or ankles?",
        "symptom_q_fatigue": "Are you experiencing extreme or unusual fatigue?",
        "symptom_q_dizziness": "Have you felt dizzy or lightheaded?",
        "symptom_advice_high_1": "Seek emergency medical care immediately.",
        "symptom_advice_high_2": "Do not drive yourself to the hospital.",
        "symptom_advice_high_3": "Chew an aspirin if available and not allergic.",
        "symptom_advice_high_4": "Try to stay calm and sit down.",
        "symptom_advice_moderate_1": "Consult a cardiologist within 24 hours.",
        "symptom_advice_moderate_2": "Monitor your blood pressure and heart rate.",
        "symptom_advice_moderate_3": "Avoid physical exertion until consulted.",
        "symptom_advice_moderate_4": "Limit salt intake if experiencing swelling.",
        "symptom_advice_low_1": "Monitor your symptoms for the next 3 days.",
        "symptom_advice_low_2": "Ensure you are staying well-hydrated.",
        "symptom_advice_low_3": "Maintain a regular sleep schedule.",
        "symptom_advice_low_4": "Reduce caffeine and stress levels.",
        "form_age": "Age (years)",
        "form_age_placeholder": "e.g. 45",
        "form_sex": "Sex",
        "form_male": "Male",
        "form_female": "Female",
        "form_cp": "Chest Pain Type",
        "form_cp_typical": "Typical Angina",
        "form_cp_atypical": "Atypical Angina",
        "form_cp_nonanginal": "Non-anginal Pain",
        "form_cp_asymptomatic": "Asymptomatic",
        "form_resting_bp": "Resting BP (mm Hg)",
        "form_bp_placeholder": "e.g. 120",
        "form_chol": "Cholesterol (mg/dl)",
        "form_chol_placeholder": "e.g. 200",
        "form_fbs": "Fasting Blood Sugar (> 120 mg/dl)",
        "form_false": "False",
        "form_true": "True",
        "form_restecg": "Resting ECG",
        "form_restecg_normal": "Normal",
        "form_restecg_st": "ST-T Wave Abnormality",
        "form_restecg_lvh": "Left Ventricular Hypertrophy",
        "form_thalach": "Max Heart Rate",
        "form_thalach_placeholder": "e.g. 150",
        "form_exang": "Exercise Induced Angina",
        "form_no": "No",
        "form_yes": "Yes",
        "form_oldpeak": "Oldpeak (ST Depression)",
        "form_oldpeak_placeholder": "e.g. 1.0",
        "form_slope": "Slope of Peak Exercise ST",
        "form_slope_up": "Upsloping",
        "form_slope_flat": "Flat",
        "form_slope_down": "Downsloping",
        "form_ca": "Major Vessels (0-3)",
        "form_thal": "Thalassemia",
        "form_thal_normal": "Normal",
        "form_thal_fixed": "Fixed Defect",
        "form_thal_reversible": "Reversible Defect",
        "result_high_risk": "High Risk Detected",
        "result_low_risk": "Low Risk Detected",
        "result_confidence": "AI Confidence Score:",
        "result_attention": "Immediate Attention Recommended",
        "result_attention_desc": "Our analysis suggests a high probability of heart disease. Please consult a specialist immediately.",
        "result_why": "Why this result?",
        "result_contributors_desc": "Based on your inputs, these are the top factors contributing to the high risk assessment:",
        "result_find_care": "Find Specialized Care Nearby",
        "result_find_care_desc": "Locate the nearest cardiologists and heart hospitals using your current location.",
        "result_locating": "Locating...",
        "result_find_docs": "Find Nearest Cardiologists",
        "result_maps_note": "Opens Google Maps with top-rated doctors in your area.",
        "result_healthy_title": "Heart Health Looks Good",
        "result_healthy_desc": "Great news! Your indicators suggest a low risk of heart disease. Keep up the healthy lifestyle.",
        "result_lifestyle": "Healthy Lifestyle Suggestions",
        "result_reset": "Check Another Patient",
        "result_symptom_based": "Based on your reported symptoms",
        "result_actions": "Recommended Actions:"
        ,
        "about_title": "About Us",
        "about_project_details": "Project Details",
        "about_project_desc": "This is a Final Year Project dedicated to leveraging advanced artificial intelligence for the early detection of heart disease. Our goal is to make predictive healthcare accessible and accurate.",
        "about_inspiration": "Inspiration",
        "about_inspiration_desc": "Heart disease remains a leading cause of mortality worldwide. We were inspired to build a tool that bridges the gap between complex medical data and actionable insights, potentially saving lives through early warning and intervention.",
        "about_team": "Meet the Team",
        "about_role": "Developer",
        "learn_title": "Heart Health Awareness",
        "learn_why_title": "Why Early Detection Matters?",
        "learn_why_desc": "Cardiovascular diseases (CVDs) are the number one cause of death globally. Early detection through regular screening and AI-powered assessments can identify risks before they become critical events.",
        "learn_did_you_know": "Did you know?",
        "learn_did_you_know_desc": "According to the WHO, approximately 17.9 million people die each year from CVDs, representing 32% of all global deaths.",
        "learn_risk_title": "Key Risk Factors",
        "learn_ai_title": "How AI Helps?",
        "learn_ai_desc": "Artificial Intelligence analyzes complex patterns in health data that might be missed by traditional methods. Our model considers over 13 unique clinical parameters to provide a personalized risk profile with high accuracy.",
        "learn_risk_bp_title": "High Blood Pressure",
        "learn_risk_bp_desc": "Increases workload on the heart.",
        "learn_risk_chol_title": "High Cholesterol",
        "learn_risk_chol_desc": "Can build up plaque in arteries.",
        "learn_risk_smoking_title": "Smoking",
        "learn_risk_smoking_desc": "Damages blood vessels and reduces oxygen.",
        "learn_risk_diabetes_title": "Diabetes",
        "learn_risk_diabetes_desc": "High blood sugar damages nerves and vessels.",
        "learn_risk_inactivity_title": "Physical Inactivity",
        "learn_risk_inactivity_desc": "Increases risk of obesity and hypertension.",
        "learn_risk_diet_title": "Unhealthy Diet",
        "learn_risk_diet_desc": "High salt/fat intake contributes to risks."
    },
    "hi": {
        "nav_home": "होम",
        "nav_about": "हमारे बारे में",
        "nav_learn_more": "और जानें",
        "nav_start_assessment": "आकलन शुरू करें",
        "footer_tagline": "बेहतर भविष्य के लिए शुरुआती पहचान को सशक्त बनाना।",
        "lang_english": "English",
        "lang_hindi": "हिंदी",
        "home_hero_badge": "उन्नत AI निदान",
        "home_hero_title_1": "AI के साथ अपने दिल की",
        "home_hero_title_2": "सुरक्षा करें",
        "home_hero_desc": "हमारे उन्नत मशीन लर्निंग एल्गोरिदम से हृदय रोग का जोखिम जल्दी पहचानें। तेज, सटीक और उपयोग में आसान।",
        "home_start_analysis": "विश्लेषण शुरू करें",
        "home_accuracy_rate": "सटीकता दर",
        "home_availability": "उपलब्धता",
        "home_instant_results": "तुरंत परिणाम",
        "home_instant_results_desc": "अपने हार्ट हेल्थ इंडिकेटर्स का तुरंत विश्लेषण प्राप्त करें।",
        "home_private_secure": "निजी और सुरक्षित",
        "home_private_secure_desc": "आपका डेटा लोकली प्रोसेस होता है और स्थायी रूप से स्टोर नहीं होता।",
        "home_medical_grade": "मेडिकल ग्रेड",
        "home_medical_grade_desc": "दुनिया भर के शीर्ष कार्डियोलॉजिस्ट द्वारा उपयोग किए जाने वाले मानकों पर आधारित।",
        "home_start_assessment_title": "अपना आकलन शुरू करें",
        "home_start_assessment_desc": "नीचे अपनी क्लिनिकल जानकारी भरें। हमारा AI मॉडल आपके डेटा का विश्लेषण करेगा।",
        "form_heading": "हृदय स्वास्थ्य आकलन",
        "form_mode_clinical": "क्लिनिकल विश्लेषण (AI)",
        "form_mode_symptom": "लक्षण जांच",
        "form_clinical_loading": "क्लिनिकल डेटा का विश्लेषण हो रहा है...",
        "form_clinical_submit": "पूर्वानुमान बनाएं",
        "form_disclaimer": "*यह टूल केवल स्क्रीनिंग के लिए है, यह पेशेवर चिकित्सा सलाह का विकल्प नहीं है।",
        "form_error": "पूर्वानुमान में त्रुटि। कृपया सुनिश्चित करें कि बैकएंड चल रहा है।",
        "form_symptom_desc": "जो लक्षण अभी लागू होते हैं उन्हें चुनें। यह त्वरित जांच सामान्य लक्षणों के आधार पर सलाह देगी।",
        "form_symptom_loading": "लक्षणों का आकलन हो रहा है...",
        "form_symptom_submit": "लक्षणों का विश्लेषण करें",
        "symptom_q_chest_pain": "क्या आपको छाती में दर्द या जकड़न महसूस हो रही है?",
        "symptom_q_breath": "क्या आपको सांस लेने में तकलीफ हो रही है?",
        "symptom_q_palpitations": "क्या दिल की धड़कन अनियमित महसूस हो रही है?",
        "symptom_q_swelling": "क्या पैरों या टखनों में सूजन है?",
        "symptom_q_fatigue": "क्या असामान्य या अत्यधिक थकान है?",
        "symptom_q_dizziness": "क्या चक्कर या हल्कापन महसूस हुआ है?",
        "symptom_advice_high_1": "तुरंत आपातकालीन चिकित्सा सहायता लें।",
        "symptom_advice_high_2": "खुद गाड़ी चलाकर अस्पताल न जाएं।",
        "symptom_advice_high_3": "यदि उपलब्ध हो और एलर्जी न हो तो एस्पिरिन लें।",
        "symptom_advice_high_4": "शांत रहें और बैठ जाएं।",
        "symptom_advice_moderate_1": "24 घंटे के भीतर कार्डियोलॉजिस्ट से परामर्श करें।",
        "symptom_advice_moderate_2": "ब्लड प्रेशर और हृदय गति की निगरानी करें।",
        "symptom_advice_moderate_3": "परामर्श तक शारीरिक मेहनत से बचें।",
        "symptom_advice_moderate_4": "सूजन होने पर नमक कम लें।",
        "symptom_advice_low_1": "अगले 3 दिनों तक लक्षणों पर नज़र रखें।",
        "symptom_advice_low_2": "पर्याप्त पानी पीते रहें।",
        "symptom_advice_low_3": "नियमित नींद का पालन करें।",
        "symptom_advice_low_4": "कैफीन और तनाव कम करें।",
        "form_age": "आयु (वर्ष)",
        "form_age_placeholder": "जैसे 45",
        "form_sex": "लिंग",
        "form_male": "पुरुष",
        "form_female": "महिला",
        "form_cp": "छाती दर्द का प्रकार",
        "form_cp_typical": "टिपिकल एंजाइना",
        "form_cp_atypical": "एटिपिकल एंजाइना",
        "form_cp_nonanginal": "नॉन-एंजाइनल दर्द",
        "form_cp_asymptomatic": "बिना लक्षण",
        "form_resting_bp": "आराम की स्थिति BP (mm Hg)",
        "form_bp_placeholder": "जैसे 120",
        "form_chol": "कोलेस्ट्रॉल (mg/dl)",
        "form_chol_placeholder": "जैसे 200",
        "form_fbs": "फास्टिंग ब्लड शुगर (> 120 mg/dl)",
        "form_false": "नहीं",
        "form_true": "हाँ",
        "form_restecg": "रेस्टिंग ECG",
        "form_restecg_normal": "सामान्य",
        "form_restecg_st": "ST-T वेव असामान्यता",
        "form_restecg_lvh": "लेफ्ट वेंट्रिकुलर हाइपरट्रॉफी",
        "form_thalach": "अधिकतम हृदय गति",
        "form_thalach_placeholder": "जैसे 150",
        "form_exang": "व्यायाम से एंजाइना",
        "form_no": "नहीं",
        "form_yes": "हाँ",
        "form_oldpeak": "ओल्डपीक (ST Depression)",
        "form_oldpeak_placeholder": "जैसे 1.0",
        "form_slope": "पीक एक्सरसाइज ST की ढलान",
        "form_slope_up": "ऊपर की ओर",
        "form_slope_flat": "समतल",
        "form_slope_down": "नीचे की ओर",
        "form_ca": "मुख्य रक्तवाहिनियां (0-3)",
        "form_thal": "थैलेसीमिया",
        "form_thal_normal": "सामान्य",
        "form_thal_fixed": "फिक्स्ड डिफेक्ट",
        "form_thal_reversible": "रिवर्सिबल डिफेक्ट",
        "result_high_risk": "उच्च जोखिम पाया गया",
        "result_low_risk": "कम जोखिम पाया गया",
        "result_confidence": "AI कॉन्फिडेंस स्कोर:",
        "result_attention": "तुरंत ध्यान आवश्यक",
        "result_attention_desc": "हमारे विश्लेषण के अनुसार हृदय रोग का जोखिम अधिक है। कृपया तुरंत विशेषज्ञ से परामर्श लें।",
        "result_why": "यह परिणाम क्यों आया?",
        "result_contributors_desc": "आपके इनपुट के आधार पर ये मुख्य कारण उच्च जोखिम में योगदान दे रहे हैं:",
        "result_find_care": "नज़दीकी विशेषज्ञ देखभाल खोजें",
        "result_find_care_desc": "अपने स्थान के आधार पर नज़दीकी कार्डियोलॉजिस्ट और हार्ट हॉस्पिटल खोजें।",
        "result_locating": "स्थान खोजा जा रहा है...",
        "result_find_docs": "नज़दीकी कार्डियोलॉजिस्ट खोजें",
        "result_maps_note": "यह आपके क्षेत्र के डॉक्टरों के साथ Google Maps खोलेगा।",
        "result_healthy_title": "हृदय स्वास्थ्य अच्छा दिख रहा है",
        "result_healthy_desc": "अच्छी खबर! आपके संकेतक हृदय रोग के कम जोखिम को दिखाते हैं। स्वस्थ जीवनशैली जारी रखें।",
        "result_lifestyle": "स्वस्थ जीवनशैली सुझाव",
        "result_reset": "एक और मरीज जांचें",
        "result_symptom_based": "आपके बताए गए लक्षणों के आधार पर",
        "result_actions": "सुझाए गए कदम:",
        "about_title": "हमारे बारे में",
        "about_project_details": "प्रोजेक्ट विवरण",
        "about_project_desc": "यह एक फाइनल ईयर प्रोजेक्ट है जो हृदय रोग की शुरुआती पहचान के लिए उन्नत आर्टिफिशियल इंटेलिजेंस का उपयोग करता है। हमारा लक्ष्य भविष्यवाणी आधारित स्वास्थ्य सेवाओं को सुलभ और सटीक बनाना है।",
        "about_inspiration": "प्रेरणा",
        "about_inspiration_desc": "हृदय रोग दुनिया भर में मृत्यु का एक प्रमुख कारण है। हमने ऐसा टूल बनाने की प्रेरणा ली जो जटिल चिकित्सा डेटा और उपयोगी निर्णयों के बीच की दूरी कम करे।",
        "about_team": "टीम से मिलें",
        "about_role": "डेवलपर",
        "learn_title": "हृदय स्वास्थ्य जागरूकता",
        "learn_why_title": "शुरुआती पहचान क्यों महत्वपूर्ण है?",
        "learn_why_desc": "हृदय संबंधी रोग (CVDs) विश्व स्तर पर मृत्यु का प्रमुख कारण हैं। नियमित जांच और AI आधारित आकलन से जोखिम समय रहते पहचाना जा सकता है।",
        "learn_did_you_know": "क्या आप जानते हैं?",
        "learn_did_you_know_desc": "WHO के अनुसार हर साल लगभग 17.9 मिलियन लोगों की मृत्यु CVDs से होती है, जो कुल वैश्विक मौतों का 32% है।",
        "learn_risk_title": "मुख्य जोखिम कारक",
        "learn_ai_title": "AI कैसे मदद करता है?",
        "learn_ai_desc": "आर्टिफिशियल इंटेलिजेंस स्वास्थ्य डेटा में ऐसे पैटर्न पहचानता है जिन्हें पारंपरिक तरीकों से पकड़ना मुश्किल हो सकता है। हमारा मॉडल 13 से अधिक क्लिनिकल पैरामीटर्स पर आधारित व्यक्तिगत जोखिम प्रोफाइल देता है।",
        "learn_risk_bp_title": "उच्च रक्तचाप",
        "learn_risk_bp_desc": "हृदय पर अतिरिक्त दबाव बढ़ाता है।",
        "learn_risk_chol_title": "उच्च कोलेस्ट्रॉल",
        "learn_risk_chol_desc": "धमनियों में प्लाक जमा कर सकता है।",
        "learn_risk_smoking_title": "धूम्रपान",
        "learn_risk_smoking_desc": "रक्त वाहिनियों को नुकसान पहुंचाता है और ऑक्सीजन कम करता है।",
        "learn_risk_diabetes_title": "मधुमेह",
        "learn_risk_diabetes_desc": "उच्च शुगर नसों और रक्त वाहिनियों को नुकसान पहुंचाती है।",
        "learn_risk_inactivity_title": "शारीरिक निष्क्रियता",
        "learn_risk_inactivity_desc": "मोटापा और उच्च रक्तचाप का जोखिम बढ़ाती है।",
        "learn_risk_diet_title": "अस्वस्थ आहार",
        "learn_risk_diet_desc": "अधिक नमक/वसा जोखिम बढ़ाते हैं।"
    }
}

# Load model
try:
    model = joblib.load('model.pkl')
    print("Model loaded successfully")
except Exception as e:
    print(f"Error loading model: {e}")
    print("Model not found or incompatible. Please run train_model.py first.")
    model = None

@app.route('/', methods=['GET'])
def home():
    return "Heart Disease Prediction API is running!"

@app.route('/translations', methods=['GET'])
def translations():
    lang = request.args.get('lang', 'en')
    selected = TRANSLATIONS.get(lang, TRANSLATIONS['en'])
    return jsonify({
        'lang': lang if lang in TRANSLATIONS else 'en',
        'translations': selected
    })

@app.route('/predict', methods=['POST'])
def predict():
    if not model:
        return jsonify({'error': 'Model not loaded. Service unavailable.'}), 503
        
    try:
        data = request.json
        print(f"Received data: {data}") # Debug logging
        
        # MAPPING FRONTEND VALUES TO CLEVELAND DATASET FORMAT
        
        # CP: Frontend (0-3) -> Cleveland (1-4)
        # 0:Typical -> 1, 1:Atypical -> 2, 2:Non-anginal -> 3, 3:Asymptomatic -> 4
        cp = float(data.get('cp')) + 1
        
        # Slope: Frontend (0-2) -> Cleveland (1-3)
        # 0:Upsloping -> 1, 1:Flat -> 2, 2:Downsloping -> 3
        slope = float(data.get('slope')) + 1
        
        # Thal: Frontend (0-2) -> Cleveland (3, 6, 7)
        # 0:Normal -> 3, 1:Fixed -> 6, 2:Reversable -> 7
        thal_input = float(data.get('thal'))
        if thal_input == 0:
            thal = 3.0
        elif thal_input == 1:
            thal = 6.0
        else: # 2
            thal = 7.0

        feature_values = [
            float(data.get('age')),
            float(data.get('sex')),
            cp,                         # Mapped
            float(data.get('trestbps')),
            float(data.get('chol')),
            float(data.get('fbs')),
            float(data.get('restecg')),
            float(data.get('thalach')),
            float(data.get('exang')),
            float(data.get('oldpeak')),
            slope,                      # Mapped
            float(data.get('ca')),
            thal                        # Mapped
        ]
        
        print(f"Features for prediction: {feature_values}")
        
        prediction = model.predict([feature_values])[0]
        probability = model.predict_proba([feature_values])[0][1] # prob of class 1
        
        print(f"Prediction: {prediction}, Probability: {probability}")
        
        # --- Explainable AI (XAI) Logic ---
        contributors = []
        if prediction == 1:
            try:
                # Get feature importance from model
                # Check if model has feature_importances_ (RandomForest does)
                if hasattr(model, 'feature_importances_'):
                    importances = model.feature_importances_
                    feature_names = ['Age', 'Sex', 'Chest Pain', 'Blood Pressure', 'Cholesterol', 
                                     'Fasting Blood Sugar', 'ECG Result', 'Max Heart Rate', 
                                     'Exercise Angina', 'ST Depression', 'Slope', 'Major Vessels', 'Thalassemia']
                    
                    # Identify Risk Conditions (Medical Heuristics)
                    risk_mask = [
                        feature_values[0] > 55,       # Age
                        feature_values[1] == 1,       # Sex (Male) - kept but usually low weight
                        feature_values[2] != 4,       # CP (1,2,3 are pain types, 4 Is Asymptom) - Wait, in Cleveland 4 is asymptomatic.
                                                      # Actually, let's simplify: CP 1/2/3 is pain. 
                                                      # In our map: 0->1(Typ), 1->2(Atyp), 2->3(Non-ang), 3->4(Asymp).
                                                      # So if input CP was 0,1,2 (mapped 1,2,3), it is "Pain".
                                                      # condition: mapped cp < 4
                        feature_values[3] > 135,      # Trestbps (High BP)
                        feature_values[4] > 240,      # Chol (High)
                        feature_values[5] == 1,       # FBS (High Sugar)
                        feature_values[6] > 0,        # RestECG (Abnormal)
                        feature_values[7] < 120,      # Thalach (Low Max Rate? - approximate)
                        feature_values[8] == 1,       # Exang (Yes)
                        feature_values[9] > 1.0,      # Oldpeak (Depression)
                        feature_values[10] != 1,      # Slope (2=Flat, 3=Down usually bad)
                        feature_values[11] > 0,       # CA (Colored vessels)
                        feature_values[12] >= 6       # Thal (6=Fixed, 7=Reversable)
                    ]
                    
                    # Calculate Local Contribution: Importance * Risk Presence
                    # This highlights important features that are ALSO abnormal for this patient
                    local_contributions = []
                    for i in range(len(feature_names)):
                        if risk_mask[i]:
                            local_contributions.append((feature_names[i], importances[i]))
                    
                    # Sort by importance (highest first)
                    local_contributions.sort(key=lambda x: x[1], reverse=True)
                    
                    # Pick Top 3
                    contributors = [x[0] for x in local_contributions[:3]]
            except Exception as e_xai:
                print(f"XAI Error: {e_xai}")
                contributors = []

        return jsonify({
            'prediction': int(prediction),
            'probability': float(probability),
            'contributors': contributors
        })
        
    except Exception as e:
        print(f"Error during prediction: {e}")
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)
