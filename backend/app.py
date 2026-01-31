import pandas as pd
import os
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def load_data():
    try:
        # Tumhara Bataya hua Exact Path (r lagana zaroori hai Windows ke liye)
        file_path = r"C:\Users\haris\Downloads\hotel_bookings.csv"
        
        print(f"📂 Reading file from: {file_path}")

        if not os.path.exists(file_path):
            print("❌ File wahan nahi mili! Path check karein.")
            return None

        df = pd.read_csv(file_path)
        df = df.fillna("")
        
        # --- Random Data Mixing ---
        # Data ko mix karte hain taake Chart acha banay
        if len(df) > 1000:
            df = df.sample(n=1000) 
        else:
            df = df.head(1000)
            
        return df 

    except Exception as e:
        print(f"❌ Error reading file: {e}")
        return None

@app.route('/api/stats', methods=['GET'])
def get_stats():
    df = load_data()
    if df is not None:
        return jsonify(df.to_dict(orient='records'))
    else:
        return jsonify({"error": "File not found"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=8080)