import pandas as pd
from waterhole import main

def load_test_data(filename="AZ-test-2027.csv"):
    """
    Load CSV data into a pandas DataFrame.
    
    Parameters:
    - filename: str, path to the CSV file
    
    Returns:
    - pd.DataFrame with the data from the CSV file
    """
    return pd.read_csv(filename)

def test_school_data(state, tolerance=0.01):
    test_data = load_test_data()
    discrepancies = []

    for index, row in test_data.iterrows():
        unit_id = row['UnitID']
        expected_students_2027 = row['New 2027 FR']
        actual_students_2027 = state.schools[unit_id].students_2027

        if abs(actual_students_2027 - expected_students_2027) > tolerance:
            discrepancies.append({
                'unit_id': unit_id,
                'expected': expected_students_2027,
                'actual': actual_students_2027,
                'difference': abs(actual_students_2027 - expected_students_2027)
            })

    return discrepancies

# Run the main function from waterhole.py and get the state data
this_state = main()

# Now, test the data
discrepancies = test_school_data(this_state)

if discrepancies:
    print("Discrepancies found:")
    for discrepancy in discrepancies:
        print(discrepancy)
else:
    print("No discrepancies found. Test passed!")
