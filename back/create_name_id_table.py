from cryptography.fernet import Fernet
import pandas as pd
import json



# Load and decrypt with the sidewalk key
with open('sidewalk_key.key', 'rb') as f:
    sidewalk_key = f.read()
sidewalk_cipher_suite = Fernet(sidewalk_key)


# Load and decrypt 'schools_sidewalk_2027.encrypted'
with open('schools_sidewalk_2027.encrypted', 'rb') as f:
    encrypted_data_sidewalk = f.read()
decrypted_data_sidewalk = sidewalk_cipher_suite.decrypt(encrypted_data_sidewalk)
data_sidewalk_2027 = json.loads(decrypted_data_sidewalk.decode('utf-8'))

data_for_df = []
for unit_id, school_info in data_sidewalk_2027.items():
    row = {
        'unit_id': unit_id,
        'name_with_state': school_info['name_with_state']
    }
    data_for_df.append(row)

# Create the DataFrame
df = pd.DataFrame(data_for_df)
output_csv_path = 'data/id_name_table.csv'
df.to_csv(output_csv_path, index=False)

