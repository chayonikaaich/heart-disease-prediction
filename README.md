# Heart Disease Prediction System

A comprehensive full-stack application designed to predict the likelihood of heart disease using Machine Learning. This project integrates a robust backend analysis pipeline with a modern, user-friendly React frontend.

![Project Status](https://img.shields.io/badge/Status-Active-brightgreen)
![Python](https://img.shields.io/badge/Python-3.8%2B-blue)
![React](https://img.shields.io/badge/React-18-cyan)
![Flask](https://img.shields.io/badge/Framework-Flask-black)

---

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Dataset](#dataset)
- [Project Architecture](#project-architecture)
- [Detailed Workflow](#detailed-workflow)
    - [1. Data Ingestion & EDA](#1-data-ingestion--eda)
    - [2. Model Training & Tuning](#2-model-training--tuning)
    - [3. Backend API](#3-backend-api)
    - [4. Frontend Application](#4-frontend-application)
- [Installation & Setup](#installation--setup)
- [Results & Metrics](#results--metrics)
- [Team](#-team)

---

## 🔍 Project Overview
The **Heart Disease Prediction System** aims to assist in early diagnosis by analyzing clinical parameters. It uses the famous Cleveland Heart Disease dataset to train a Random Forest Classifier, achieving high accuracy. The system provides:
1.  **Clinical Prediction**: Returns a probability of heart disease based on 13 medical attributes.
2.  **Explainability**: Identifies top contributing risk factors (e.g., High Cholesterol, Age) for positive predictions.
3.  **Doctor Recommendation**: Suggests nearby cardiologists for high-risk patients.

---

## 📊 Dataset
We use the **Cleveland Heart Disease Dataset** from the UCI Machine Learning Repository.
- **Location**: `backend/processed.cleveland.data`
- **Instances**: 303
- **Attributes**: 14 (13 features + 1 target)
    - **Demographic**: Age, Sex
    - **Vitals**: Resting Blood Pressure (`trestbps`), Cholesterol (`chol`), Fasting Blood Sugar (`fbs`)
    - **Cardiac Tests**: Resting ECG (`restecg`), Max Heart Rate (`thalach`), Exercise Induced Angina (`exang`), ST Depression (`oldpeak`), Slope of Peak Exercise ST Segment (`slope`), Fluoroscopy (`ca`), Thalassemia (`thal`).
- **Target**: Presence (1-4) or Absence (0) of heart disease. (Binarized to 0 vs 1 for this project).

---

## 🏗 Project Architecture

```
heart-disease-prediction/
├── backend/                   # Flask API & Model Hosting
│   ├── app.py                 # Main application entry point
│   ├── model.pkl              # Serialized Machine Learning Model
│   ├── processed.cleveland.data # Raw Dataset
│   └── train_model.py         # Quick retraining script
├── frontend/                  # React + Vite Client
│   ├── src/                   # Source code (Components, Pages)
│   ├── tailwind.config.js     # Styling configuration
│   └── package.json           # Frontend dependencies
├── notebooks/                 # Data Analysis & Research
│   ├── analysis_pipeline.py   # Full pipeline: EDA -> Train -> Tune -> Save
│   └── graphs/                # Generated visualization artifacts
└── README.md                  # Project Documentation
```

---

## 🔄 Detailed Workflow

The project follows a linear Data Science + Software Engineering pipeline:

### 1. Data Ingestion & EDA
**Script**: `notebooks/analysis_pipeline.py`
- **Loading**: Reads the raw CSV data and assigns meaningful column names.
- **Preprocessing**: Handles missing values (drops rows with `?`) and binarizes the target variable (0 = Healthy, >0 = Disease).
- **Visualization**: Generates insight graphs in `notebooks/graphs/`:
    - `relation_matrix.png`: Heatmap showing correlation between all features.
    - `eda_target_distribution.png`: Balance of healthy vs. sick cases.
    - `eda_pairplot.png`: Pairwise relationships colored by target.

### 2. Model Training & Tuning
**Script**: `notebooks/analysis_pipeline.py`
- **Algorithm Selection**: Compares 5 algorithms:
    1.  Logistic Regression
    2.  **Random Forest** (Selected Best Performance)
    3.  Support Vector Machine (SVM)
    4.  K-Nearest Neighbors (KNN)
    5.  Gradient Boosting
- **Hyperparameter Tuning**: Uses `GridSearchCV` to optimize the Random Forest:
    - `n_estimators`, `max_depth`, `min_samples_split`, `min_samples_leaf`.
- **Validation**: Generates Confusion Matrices, ROC Curves, and Learning Curves.
- **Artifact Creation**: Saves the best performing model to `backend/model.pkl`.

### 3. Backend API
**Script**: `backend/app.py`
- **Technology**: Flask (Python)
- **Endpoints**:
    - `POST /predict`: Accepts JSON data with 13 features.
        - **Preprocessing**: Maps frontend enum values (e.g., Chest Pain Type 0-3) to dataset standards (1-4).
        - **Inference**: Runs `model.predict_proba`.
        - **XAI Logic**: If risk is detected, calculates "Top Contributors" based on feature importance and patient-specific high-risk values.
- **CORS**: Enabled to allow requests from the React frontend.

### 4. Frontend Application
**Tech Stack**: React 18, Vite, TailwindCSS
- **User Interface**:
    - **Home**: Landing page with call-to-action.
    - **Prediction Form**: Interactive form with sliders and dropdowns for easy data entry.
    - **Results Display**: Shows risk score, probability, and health advice.
- **Features**:
    - **Real-time Validation**: Ensures inputs are within medical ranges.
    - **Google Maps Integration**: "Find Cardiologists Nearby" button for high-risk results.

---

## 💻 Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js & npm

### Step 1: Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
   *(Ensure flask, flask-cors, scikit-learn, pandas, numpy, joblib are installed)*
3. Start the Flask server:
   ```bash
   python app.py
   ```
   Server will run at `http://localhost:5000`.

### Step 2: Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install Node modules:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   Access the app at `http://localhost:5173`.

---

## 📈 Results & Metrics
(Based on latest training run)
- **Best Model**: Tuned Random Forest Classifier
- **Accuracy**: ~85-90% (Varies by split)
- **Key Metrics**: High Recall (minimizing False Negatives is critical in healthcare).

---

## 👥 Team
**Final Year Project** developed by:
- Shatakshi Bhushan
- Jayshree Jain
- Swayam Jain
- Chayonika Aich
- Syed Aakif Sultan
