import pandas as pd

class School:
    def __init__(self, unit_id, name, admit_rate, yield_rate, score, segment):
        self.unit_id = unit_id
        self.name = name
        self.admit_rate = admit_rate
        self.yield_rate = yield_rate
        self.score = score
        self.segment = segment

        # these values will iteratively be updated by watering hole algorithm
        self.students_2022 = 0
        self.students_2027 = 0
        self.capped_students_2027 = 0
        self.overage = 0
        self.shortfall = 0
        self.WT_shortfall = 0
        self.surplus = 0

class School_Pipeline:
    def __init__(self, school, state_demographics):
        self.school = school
        self.state_demographics = state_demographics

class State:
    def __init__(self, name, birth_change_2027, birth_change_2032):
        self.name = name
        self.birth_change_2027 = birth_change_2027
        self.birth_change_2032 = birth_change_2032
        self.schools = {}  # holds School_Pipeline objects
    
    def add_school(self, school_object):
        self.schools[school_object.unit_it] = school_object



def load_data(filename):
    """
    Load CSV data into a pandas DataFrame.
    
    Parameters:
    - filename: str, path to the CSV file
    
    Returns:
    - pd.DataFrame with the data from the CSV file
    """
    return pd.read_csv(filename)


def watering_hole(change, score, count):
    print(count)
    return 0




# CREATE DICT OF STATE OBJECTS
state_demographics = load_data("data/state_demographics.csv")
state_demographics_dict = {}
states = {}
for index, row in state_demographics.iterrows():
    state_name = row['State']
    demographics_change_2027 = row['2027_change']
    demographics_change_2032 = row['2032_change']
    states[state_name] = State(state_name, demographics_change_2027, demographics_change_2032)

"""
# Iterate over the DataFrame rows
for index, row in state_demographics.iterrows():
    state_demographics_dict[row['State']] = {
        '2032_change': row['2032_change'],
        '2027_change': row['2027_change']
    }
#print(state_demographics_dict['CA'])
"""
print(states['CA'].birth_change_2027)

# CREATE DICT OF SCHOOLS
schools = load_data("data/school_prestige.csv")
schools_dict = {}

for index, row in schools.iterrows():
    unit_id = row['UnitID']
    # Create a School object and store it in the dictionary with UnitID as the key
    schools_dict[unit_id] = School(
        unit_id,
        row['Institution Name'],
        row['Admit %'],
        row['Yield %'],
        row['Score'],
        row['Segment']
    )

student_origins = load_data("data/school_student_geography.csv")
student_origins_dict = {}
origins = [col for col in student_origins.columns if col not in ['UnitID', 'US FR', 'YR', 'SUM']]

# Iterate over the DataFrame rows
for index, row in student_origins.iterrows():
    # Use UnitID as the key for the dictionary
    unit_id = row['UnitID']
    student_origins_dict[unit_id] = {}

    # Populate the values for each state abbreviation
    for state_abbr in origins:
        student_origins_dict[unit_id][state_abbr] = row[state_abbr]

#print(student_origins_dict[100937])  




state = 'AZ'
WT_demand_sum = 0
WT_demand = 0

students_2027 = 0
capped_students_2027 = 0
overage = -1
shortfall = 0
WT_shortfall = 0
surplus = 0

    


"""
#print(schools_dict[166683]) 
for unit_id in schools_dict:
    #print(schools_dict[unit_id]['Score'])
    start = student_origins_dict[unit_id]['AL']
    if unit_id == 166683:
        print(student_origins_dict[unit_id])


#a = schools_dict[166683]
#print(a['AL'])
"""

"""
# Initialize a variable to hold the sum of the calculations
total_calculation = 0

# Iterate through each school in the schools_dict
for unit_id, school_info in schools_dict.items():
    if unit_id == 166683:

        # For the current school, initialize a variable to hold the sum of the state adjustments
        school_sum = 0

        # Iterate through each state in the student_origins_dict for the current school
        for state_abbr, student_count in student_origins_dict[unit_id].items():
            
            if state_abbr in state_demographics_dict: 
                change = state_demographics_dict[state_abbr]['2027_change']
                if change >= 0:
                    # simple increase
                    adjustment = student_count * (1 + change)
                    
                else:
                    # watering hole algorithm for declines
                    adjustment = watering_hole(change, schools_dict[unit_id]['Score'], student_count)

                school_sum += adjustment

            else:
                print(state_abbr)
                

        # Add the school's state adjustment sum to the total calculation
        total_calculation += school_sum

# Print the final total calculation
print(f"Total Calculation for all schools: {total_calculation}")
"""



