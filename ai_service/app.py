# FULL UPDATED CODE FOR app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.ensemble import IsolationForest
import numpy as np

app = Flask(__name__)
CORS(app)

# Diverse dataset for training: [Amount, Frequency, Time]
# Sahi transactions ka pattern: Kam amount, kam frequency
X_train = np.array([
    [100, 1, 10], [250, 2, 11], [50, 1, 14], [800, 3, 16],
    [120, 1, 9], [300, 2, 10], [450, 1, 15], [60, 4, 12]
])

# Contamination 0.1 means hum expect kar rahe hain ki 10% data anomaly ho sakta hai
model = IsolationForest(contamination=0.1, random_state=42)
model.fit(X_train)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        amount = float(data.get('amount', 0))
        freq = float(data.get('freq', 0))
        time = float(data.get('time', 12))

        features = np.array([[amount, freq, time]])
        
        # Isolation Score: Jitna kam, utna bada fraud risk
        decision_score = model.decision_function(features)[0]
        prediction = model.predict(features)[0]
        
        # Risk Score Calculation (0-100)
        # Decision score normally -0.5 se 0.5 ke beech hota hai
        risk_score = int((0.5 - decision_score) * 100)
        risk_score = max(0, min(risk_score, 100))

        status = "FRAUD" if prediction == -1 or risk_score > 70 else "SAFE"

        return jsonify({
            "status": status,
            "risk_score": risk_score,
            "verdict": "High Risk Anomaly Detected" if status == "FRAUD" else "Legitimate Transaction",
            "confidence": round(abs(decision_score) * 100, 2)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("🚀 AI Neural Engine active on port 5001")
    app.run(port=5001)