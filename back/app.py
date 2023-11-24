from flask import Flask, request
from flask_cors import CORS
from cryptography.fernet import Fernet

app = Flask(__name__)
CORS(app)

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

        return decrypted_data_str
        
    else:
        return "Please enter a valid university name."




if __name__ == '__main__':
    app.run(port=4000, debug=True)
