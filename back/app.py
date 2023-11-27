from flask import Flask, request, jsonify
from flask_cors import CORS
from cryptography.fernet import Fernet
import pandas as pd

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
        # Load the key
        with open('key.key', 'rb') as f:
            key = f.read()

        # Create a cipher suite
        cipher_suite = Fernet(key)

        # Load the encrypted data
        with open('schools_2027.encrypted', 'rb') as f:
            encrypted_data = f.read()

        # Decrypt the data
        decrypted_data = cipher_suite.decrypt(encrypted_data)

        # Convert the bytes to string
        decrypted_data_str = decrypted_data.decode('utf-8')

        # get matching school info



        return decrypted_data_str
        
    else:
        return "Please enter a valid university name."




if __name__ == '__main__':
    app.run(port=4000, debug=True)
