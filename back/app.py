from flask import Flask, request, jsonify
from flask_cors import CORS
from cryptography.fernet import Fernet
import pandas as pd
import json

app = Flask(__name__)
CORS(app)

@app.route('/universities', methods=['GET'])
def get_universities():
    try:
        # Load the CSV file
        df = pd.read_csv('data/school_prestige_with_state.csv')

        # Get the list of unique university names
        df['Institution With State'] = df['Institution Name'] + " (" + df['State'] + ")"
        universities = df['Institution With State'].unique().tolist()

        # Return the list as JSON
        return jsonify(universities)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500



@app.route('/data', methods=['GET'])
def get_data():

    university_name = request.args.get('university')

    if university_name:
        # Load and decrypt with the first key
        with open('key.key', 'rb') as f:
            key = f.read()
        cipher_suite = Fernet(key)

        # Load and decrypt 'schools_2027.encrypted'
        with open('schools_2027.encrypted', 'rb') as f:
            encrypted_data = f.read()
        decrypted_data = cipher_suite.decrypt(encrypted_data)
        data_2027 = json.loads(decrypted_data.decode('utf-8'))

        # Load and decrypt with the sidewalk key
        with open('sidewalk_key.key', 'rb') as f:
            sidewalk_key = f.read()
        sidewalk_cipher_suite = Fernet(sidewalk_key)

        # Load and decrypt 'schools_sidewalk_2027.encrypted'
        with open('schools_sidewalk_2027.encrypted', 'rb') as f:
            encrypted_data_sidewalk = f.read()
        decrypted_data_sidewalk = sidewalk_cipher_suite.decrypt(encrypted_data_sidewalk)
        data_sidewalk_2027 = json.loads(decrypted_data_sidewalk.decode('utf-8'))

        # Find the matching school in both datasets
        matching_school_2027 = next((info for info in data_2027.values() if info['name_with_state'] == university_name), None)
        matching_school_sidewalk_2027 = next((info for info in data_sidewalk_2027.values() if info['name_with_state'] == university_name), None)

        # Combine data if both matches are found
        if matching_school_2027 and matching_school_sidewalk_2027:
            combined_data = {
                **matching_school_2027, 
                **matching_school_sidewalk_2027, 
                'students_change': matching_school_2027['students_change'],
                'students_change_sidewalk': matching_school_sidewalk_2027['students_change']
            }
            return jsonify(combined_data)
        else:
            return "School not found"
    else:
        return "Please enter a valid university name."




if __name__ == '__main__':
    app.run(port=4000, debug=True)
