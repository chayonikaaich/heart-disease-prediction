# Quick Reference: XAI & Google Maps Code Locations

## 🎯 Explainable AI (XAI) - Backend

**File**: `backend/app.py`  
**Function**: `predict()`  
**Lines**: 75-122

### Key Code Snippet
```python
# --- Explainable AI (XAI) Logic ---
contributors = []
if prediction == 1:  # Only for high-risk predictions
    try:
        if hasattr(model, 'feature_importances_'):
            importances = model.feature_importances_
            feature_names = ['Age', 'Sex', 'Chest Pain', 'Blood Pressure', 
                           'Cholesterol', 'Fasting Blood Sugar', 'ECG Result', 
                           'Max Heart Rate', 'Exercise Angina', 'ST Depression', 
                           'Slope', 'Major Vessels', 'Thalassemia']
            
            # Medical risk conditions for THIS patient
            risk_mask = [
                feature_values[0] > 55,       # Age
                feature_values[1] == 1,        # Sex (Male)
                feature_values[2] != 4,       # Chest Pain present
                feature_values[3] > 135,      # High BP
                feature_values[4] > 240,      # High Cholesterol
                feature_values[5] == 1,       # High FBS
                feature_values[6] > 0,       # Abnormal ECG
                feature_values[7] < 120,     # Low Max HR
                feature_values[8] == 1,      # Exercise Angina
                feature_values[9] > 1.0,      # ST Depression
                feature_values[10] != 1,     # Slope not upsloping
                feature_values[11] > 0,      # Major vessels
                feature_values[12] >= 6      # Thalassemia
            ]
            
            # Combine global importance + local risk
            local_contributions = []
            for i in range(len(feature_names)):
                if risk_mask[i]:  # Feature is risky for this patient
                    local_contributions.append((feature_names[i], importances[i]))
            
            # Sort by importance, get top 3
            local_contributions.sort(key=lambda x: x[1], reverse=True)
            contributors = [x[0] for x in local_contributions[:3]]
    except Exception as e_xai:
        print(f"XAI Error: {e_xai}")
        contributors = []

return jsonify({
    'prediction': int(prediction),
    'probability': float(probability),
    'contributors': contributors  # ["Age", "Cholesterol", "Blood Pressure"]
})
```

---

## 🗺️ Google Maps Integration - Frontend

**File**: `frontend/src/components/ResultDisplay.jsx`  
**Function**: `handleLocateDoctors()`  
**Lines**: 20-41

### Key Code Snippet
```javascript
const [loadingLocation, setLoadingLocation] = useState(false);

const handleLocateDoctors = () => {
    setLoadingLocation(true);
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            // Success: Use coordinates
            (position) => {
                const { latitude, longitude } = position.coords;
                const url = `https://www.google.com/maps/search/cardiologist/@${latitude},${longitude},13z`;
                window.location.href = url;
                setLoadingLocation(false);
            },
            // Error: Fallback to generic search
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
```

### UI Button (Lines 139-147)
```javascript
<button
    onClick={handleLocateDoctors}
    disabled={loadingLocation}
    className="w-full md:w-auto bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-red-500/30 transform hover:scale-[1.02] transition duration-200 flex items-center justify-center gap-3 mx-auto"
>
    <span className="text-xl">📍</span>
    {loadingLocation ? 'Locating...' : 'Find Nearest Cardiologists'}
</button>
```

---

## 📊 Data Flow

```
User Input
    ↓
Backend: /predict endpoint
    ↓
Model Prediction (0 or 1)
    ↓
If prediction == 1:
    ├─ XAI: Calculate contributors
    └─ Return: { prediction, probability, contributors }
    ↓
Frontend: Display result
    ↓
If high risk: Show "Find Cardiologists" button
    ↓
User clicks → handleLocateDoctors()
    ↓
Geolocation API → Get coordinates
    ↓
Redirect to Google Maps
```

---

## 🔑 Key Concepts

### XAI Algorithm
1. **Global Importance**: `model.feature_importances_` (from training)
2. **Local Risk**: `risk_mask` (patient-specific conditions)
3. **Combination**: Filter features that are both globally important AND locally risky
4. **Ranking**: Sort by importance, select top 3

### Google Maps Flow
1. **Request Permission**: `navigator.geolocation.getCurrentPosition()`
2. **Success**: Build URL with coordinates
3. **Error**: Fallback to generic search
4. **Redirect**: `window.location.href = url`

---

## 📝 Interview Quick Answers

**Q: What is XAI?**  
A: Explains WHY the model made a prediction by identifying top contributing risk factors.

**Q: Why risk_mask?**  
A: Combines global model importance with patient-specific risk conditions for local interpretability.

**Q: Why Google Maps URL instead of API?**  
A: No API key needed, no rate limits, simple implementation, full Maps features.

**Q: What if user denies location?**  
A: Falls back to generic "cardiologist near me" search using IP-based location.

---

*See `XAI_AND_GOOGLE_MAPS_EXPLANATION.md` for detailed explanations and more interview questions.*

