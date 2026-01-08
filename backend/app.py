from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app)

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
