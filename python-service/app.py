from flask import Flask, jsonify, request
from flask_cors import CORS
import numpy as np
import joblib
import pickle

app = Flask(__name__)
# Configure CORS to allow requests from frontend (port 8080) and other origins
CORS(app, 
     origins=['http://localhost:8080', 'http://localhost:3000', 'http://127.0.0.1:8080', 'http://127.0.0.1:3000'],
     methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
     allow_headers=['Content-Type', 'Authorization', 'Access-Control-Allow-Credentials'],
     supports_credentials=True)

# Load saved models and artifacts once on startup
simple_lr = joblib.load("simple_lr.pkl")
scaler = joblib.load("scaler.pkl")

with open("features.pkl", "rb") as f:
    features = pickle.load(f)

@app.before_request
def log_request_info():
    print(f"[Flask] Incoming {request.method} request from {request.origin} to {request.path}")

@app.after_request
def log_response_info(response):
    print(f"[Flask] Response headers: {dict(response.headers)}")
    # Ensure CORS headers are present
    response.headers['Access-Control-Allow-Origin'] = request.headers.get('Origin', '*')
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, Access-Control-Allow-Credentials'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response

@app.route('/predict', methods=['POST', 'OPTIONS'])
def predict():
    if request.method == 'OPTIONS':
        # Handle preflight request
        return '', 200
    try:
        print("[Flask] /predict called")
        data = request.get_json()

        glacier_name = data.get("glacier_name", "Unknown")
        sequence = data.get("data", None)  # Expecting list of lists shape (12, len(features))

        if sequence is None:
            return jsonify({"error": "No data provided"}), 400
        
        # Convert to numpy array
        sequence = np.array(sequence)
        expected_shape = (12, len(features))
        if sequence.shape != expected_shape:
            return jsonify({
                "error": f"Input data shape must be {expected_shape}, got {sequence.shape}"
            }), 400

        # Scale the sequence
        scaled_sequence = scaler.transform(sequence)

        # Use the last timestep for prediction and feature contributions
        last_timestep = scaled_sequence[-1].reshape(1, -1)

        # Predict probability of danger
        prob = simple_lr.predict_proba(last_timestep)[0, 1]
        risk_score = prob * 100

        # Define risk level thresholds
        if risk_score >= 80:
            risk_level = "CRITICAL"
        elif risk_score >= 60:
            risk_level = "HIGH"
        elif risk_score >= 40:
            risk_level = "MODERATE"
        else:
            risk_level = "LOW"

        # Calculate feature contributions
        coefficients = simple_lr.coef_[0]
        contributions = {
            feat: abs(coeff * last_timestep[0][i])
            for i, (feat, coeff) in enumerate(zip(features, coefficients))
        }
        top_features = sorted(contributions, key=contributions.get, reverse=True)[:3]

        return jsonify({
            "glacier_name": glacier_name,
            "risk_score": round(risk_score, 2),
            "risk_level": risk_level,
            "top_contributing_features": top_features
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # This service runs on port 5001
    app.run(port=5001, debug=True)