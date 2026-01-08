import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib

def load_and_preprocess_data():
    # Define column names based on UCI documentation
    columns = [
        'age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg', 
        'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal', 'target'
    ]
    
    # Load dataset
    # The dataset uses '?' for missing values
    df = pd.read_csv('processed.cleveland.data', header=None, names=columns, na_values='?')
    
    # Handle missing values (features 'ca' and 'thal' have a few missing values)
    print(f"Original shape: {df.shape}")
    df = df.dropna()
    print(f"Shape after dropping missing values: {df.shape}")
    
    # Convert target to binary: 0 = No disease, 1-4 = Disease
    df['target'] = df['target'].apply(lambda x: 1 if x > 0 else 0)
    
    return df

if __name__ == "__main__":
    print("Loading Cleveland Heart Disease dataset...")
    try:
        df = load_and_preprocess_data()
        
        X = df.drop('target', axis=1)
        y = df['target']
        
        print(f"Data distribution:\n{y.value_counts()}")
        
        print("\nTraining Random Forest Classifier...")
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        clf = RandomForestClassifier(n_estimators=100, random_state=42)
        clf.fit(X_train, y_train)
        
        y_pred = clf.predict(X_test)
        
        print("\nModel Evaluation Metrics:")
        print("-" * 30)
        print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
        print("\nClassification Report:")
        print(classification_report(y_test, y_pred))
        print("Confusion Matrix:")
        print(confusion_matrix(y_test, y_pred))
        
        print("\nSaving model to model.pkl...")
        joblib.dump(clf, 'model.pkl')
        print("Done.")
        
    except FileNotFoundError:
        print("Error: 'processed.cleveland.data' not found. Please download it first.")
    except Exception as e:
        print(f"An error occurred: {e}")
