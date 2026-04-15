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
        "result_actions": "सुझाए गए कदम:"
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
