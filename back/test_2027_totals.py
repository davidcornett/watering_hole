import pandas as pd
from waterhole import main 

def load_test_data(filename="total_students_test.csv"):
    """
    Load CSV data into a pandas DataFrame.
    
    Parameters:
    - filename: str, path to the CSV file
    
    Returns:
    - pd.DataFrame with the data from the CSV file
    """
    return pd.read_csv(filename)

def test_school_data(school_dict, tolerance=0.01):
    test_data = load_test_data()
    discrepancies = []

    for index, row in test_data.iterrows():
        unit_id = row['UnitID']
        expected_change = row['change_ALL']
        actual_change = school_dict[unit_id].student_change  # Accessing the student_change attribute

        if abs(actual_change - expected_change) >= tolerance:
            discrepancies.append({
                'unit_id': unit_id,
                'expected_change': expected_change,
                'actual_change': actual_change,
                'difference': abs(actual_change - expected_change)
            })

    return discrepancies

# Run the main function from your script and get the dictionary of School objects
school_dict = main()

# Now, test the data
discrepancies = test_school_data(school_dict)

if discrepancies:
    print("Discrepancies found:")
    for discrepancy in discrepancies:
        print(discrepancy)
else:
    print("No discrepancies found. Test passed!")
