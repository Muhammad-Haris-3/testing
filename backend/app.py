from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)  # Frontend (Port 3000) ko Backend (Port 8080) se connect karne ki ijazat di

def load_data():
    try:
        # CSV File load ki (Make sure file backend folder mein ho)
        df = pd.read_csv(r"C:\Users\haris\Python practice\hotel_bookings.csv")
        
        # Empty values ko clean kiya taake error na aaye
        df = df.fillna("")
        return df
    except Exception as e:
        print(f"Error reading file: {e}")
        return None

@app.route('/api/stats', methods=['GET'])
def get_stats():
    df = load_data()
    
    if df is None:
        return jsonify({"error": "File nahi mili!"})

    # Performance ke liye sirf pehli 50 rows bheji
    simple_data = df.head(50).to_dict(orient='records')

    return jsonify(simple_data)

if __name__ == '__main__':
    # Server ko Port 8080 par chalaya
    app.run(debug=True, port=8080)