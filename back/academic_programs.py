from waterhole import load_data, encrypt_data, save_encrypted_data, save_key
import json
from cryptography.fernet import Fernet

def main():
    schools_file = load_data("data/program_driven_changes.csv")

    schools_dict = {}
    for index, row in schools_file.iterrows():
        schools_dict[row["UnitID"]] = {
            "name": row["Name"],
            "name_with_state": row["Name"] + " (" + row["State"] + ")",
            "Rank": row["Rank"]
        }

    
    
    """
    tests = [100937, 240693, 213996, 196130, 169248, 100812]
    # print school names and their rank for each unit_id in tests 


    for unit_id, details in schools_dict.items():
        if unit_id in tests:
            print("e")
            print(f"{details['name_with_state']}: Rank: {details['Rank']}")

    """
    # Convert the dictionary to a JSON string
    data = json.dumps(schools_dict)
    
    # Generate a key
    key = Fernet.generate_key()

    # Encrypt the data
    cipher_text = encrypt_data(data, key)

    # Save the encrypted data to a file
    save_encrypted_data(cipher_text, 'schools_programs_2032.encrypted')

    # Save the key to a local file
    save_key(key, 'programs_key.key')
    

main()
