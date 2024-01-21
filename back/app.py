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

@app.route('/map_data', methods=['GET'])
def get_map_data():

    university_name = request.args.get('university')
    #

    # load csv
    df = pd.read_csv('data/school_student_geography.csv')
    match_df = pd.read_csv('data/id_name_table.csv')

    matching_rows = match_df[match_df['name_with_state'] == university_name]

    # Check if matching university is found
    if not matching_rows.empty:
        unit_id = matching_rows['unit_id'].iloc[0]  # Use iloc to access the first item
        print(unit_id)
    else:
        # Handle the case where the university is not found
        # You can return an error message or an empty response
        return {'error': 'University not found'}
    #unit_id = match_df[match_df['name'] == university_name]['unit_id'].values[0]
    #print(unit_id)
    university_row = df[df['UnitID'] == unit_id]
    origins = university_row.iloc[0].to_dict()  # Convert the row to a dictionary

    # Remove specific keys
    keys_to_remove = ['SUM', 'US FR', 'UnitID', 'YR']
    for key in keys_to_remove:
        origins.pop(key, None)  # Removes the key if it exists, does nothing otherwise
    return jsonify(origins)


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
                'students_change_sidewalk': matching_school_sidewalk_2027['students_change'],
                'score': matching_school_2027['score'],
                'latitude': matching_school_2027['latitude'],
                'longitude': matching_school_2027['longitude']
            }
            return jsonify(combined_data)
        else:
            return jsonify({"error: School not found"}), 404
    else:
        return jsonify({"error: School not found"}), 404

@app.route('/selectivity', methods=['GET'])
def get_selectivity():
    pass


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=4000)
"""
if __name__ == '__main__':
    app.run(port=4000, debug=True)
"""