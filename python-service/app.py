from flask import Flask, jsonify
from flask_cors import CORS
import time

app = Flask(__name__)
# Allow requests from our Express server's origin
CORS(app, resources={r"/*": {"origins": "http://localhost:5000"}})

@app.route('/process-data', methods=['GET'])
def process_data():
    """
    Simulates a data processing task and returns a JSON object.
    The keys here ('result', 'timestamp') must match the ProcessedData interface in the `models` package.
    """
    timestamp = int(time.time())
    processed_data = {
        'result': f'Data processed by Python at {timestamp}',
        'timestamp': timestamp
    }
    return jsonify(processed_data)

if __name__ == '__main__':
    # This service runs on port 5001
    app.run(port=5001, debug=True)