from waterhole import load_data, encrypt_data, save_encrypted_data, save_key
import json
from cryptography.fernet import Fernet

def main():
    state_demographics = load_data("data/state_demographics.csv")
    schools = load_data("data/school_prestige_with_state.csv")
    student_origins = load_data("data/school_student_geography.csv")

    # Map states to their demographic changes
    state_changes = {row['State']: row['2027_change'] for index, row in state_demographics.iterrows()}

    schools_dict = {}
    for index, row in schools.iterrows():
        schools_dict[row["UnitID"]] = {
            "name": row["Institution Name"],
            "name_with_state": row["Institution Name"] + " (" + row["State"] + ")",
            "state": row["State"],
            "demographic_projected_2027": 0,  # initialize 
            "students_change": 0
        }

    # Calculate the projected 2027 count based on demographics
    for index, row in student_origins.iterrows():
        school_id = row['UnitID']
        if school_id in schools_dict:
            total_count = 0
            for state, change in state_changes.items():
                state_student_count = row[state]
                total_count += state_student_count * (1 + change)

            total_count += (row['Foreign'] + row['Unknown_state']) # add foreign/unknown students unnaffected by demographic projections
            schools_dict[school_id]["demographic_projected_2027"] = total_count
            schools_dict[school_id]["students_change"] = total_count / row['SUM'] - 1
    
    """
    tests = ["100937", "240693", "213996", "196130", "169248", "100812"]
    for unit_id, school in schools_dict.items():
        if str(unit_id) in tests:
            print(f"{school['name_with_state']}: Projected 2027 Students: {school['demographic_projected_2027']}, Change: {school['students_change']}")
    """
    # Convert the dictionary to a JSON string
    data = json.dumps(schools_dict)
    
    # Generate a key
    key = Fernet.generate_key()

    # Encrypt the data
    cipher_text = encrypt_data(data, key)

    # Save the encrypted data to a file
    save_encrypted_data(cipher_text, 'schools_sidewalk_2027.encrypted')

    # Save the key to a local file
    save_key(key, 'sidewalk_key.key')

main()
