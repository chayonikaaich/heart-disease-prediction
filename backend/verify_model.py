import joblib
import pandas as pd
import numpy as np

def verify():
    # Load model
    print("Loading model...")
    model = joblib.load('model.pkl')
    
    # Load one sample from data
    print("Loading sample data...")
    # age,sex,cp,trestbps,chol,fbs,restecg,thalach,exang,oldpeak,slope,ca,thal,target
    # 63.0,1.0,1.0,145.0,233.0,1.0,2.0,150.0,0.0,2.3,3.0,0.0,6.0,0
    sample = [63.0,1.0,1.0,145.0,233.0,1.0,2.0,150.0,0.0,2.3,3.0,0.0,6.0]
    
    print(f"Predicting for sample: {sample}")
    prediction = model.predict([sample])[0]
    probs = model.predict_proba([sample])[0]
    
    print(f"Prediction: {prediction}")
    print(f"Probabilities: {probs}")
    
    if prediction == 0:
        print("SUCCESS: Correctly predicted no disease for the first sample in dataset.")
    else:
        print("WARNING: Sample prediction does not match label 0 (Valid for some models if accuracy < 100%)")

if __name__ == "__main__":
    try:
        verify()
    except Exception as e:
        print(f"FAILED: {e}")
