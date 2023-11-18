import pandas as pd

school_growth_target_rate = 0

class School:
    def __init__(self, unit_id, name, admit_rate, yield_rate, score, segment):
        self.unit_id = unit_id
        self.name = name
        self.admit_rate = admit_rate
        self.yield_rate = yield_rate
        self.score = score
        self.segment = segment

        self.students_2022 = 0
        self.students_2027 = 0
        self.student_change = 0

    def set_students(self, states):
        for state in states:
            self.students_2022 += states[state].schools[self.unit_id].students_2022
            self.students_2027 += states[state].schools[self.unit_id].students_2027


class School_Pipeline:
    def __init__(self, school, freshmen_2022, wt_demand=None): 
        self.school = school
        self.students_2022 = freshmen_2022
        self.wt_demand = wt_demand
        #self.state_demographics = state_demographics

        # these values will iteratively be updated by watering hole algorithm
        self.students_2027 = 0
        self.capped_students_2027 = 0
        self.wt_shortfall = 0
        self.surplus = 0
    
    def cap_students(self):
        self.capped_students_2027 = min(self.students_2022 * (1 + school_growth_target_rate), self.students_2027)



class State:
    def __init__(self, name, birth_change_2027, birth_change_2032):
        self.name = name
        self.birth_change_2027 = birth_change_2027
        self.birth_change_2032 = birth_change_2032
        self.wt_demand_sum = 0 # sums wt demand of each school
        self.overage_sum = 0
        self.wt_shortfall_sum = 0

        self.schools = {}  # holds School_Pipeline objects

        self.students_2022 = 0
        self.students_2027 = 0
        
    
    def add_school(self, school_pipeline_object):
        self.schools[school_pipeline_object.school.unit_id] = school_pipeline_object

    def set_students_2027(self):
        self.students_2027 = self.students_2022 * (1 + self.birth_change_2027)



def load_data(filename):
    """
    Load CSV data into a pandas DataFrame.
    
    Parameters:
    - filename: str, path to the CSV file
    
    Returns:
    - pd.DataFrame with the data from the CSV file
    """
    return pd.read_csv(filename)


def calculate_scores(schools_dict):
    """Calculate and return a dictionary of scores for each school."""
    scores = {}
    for unit_id in schools_dict:
        scores[unit_id] = float(schools_dict[unit_id].score.replace("%", "")) / 100
    return scores

def waterhole(states, schools_dict, student_origins_dict):

    scores = calculate_scores(schools_dict)
    for state in states:
        this_state = states[state]
        change_2027 = this_state.birth_change_2027

        # for growing states, simply increase each school by overall state growth rate
        if change_2027 >= 0:
            for unit_id in schools_dict:
                freshmen_2022 = student_origins_dict[unit_id][state]
                new_pipeline = School_Pipeline(schools_dict[unit_id], freshmen_2022)
                this_state.add_school(new_pipeline)
                new_pipeline.students_2027 = new_pipeline.students_2022 * (1 + change_2027)
        else:

            # WATERHOLE STEP 1: initial processing for each school
            for unit_id in schools_dict:
                
                freshmen_2022 = student_origins_dict[unit_id][state]
                
                score = scores[unit_id] # school's selectivity score
                wt_demand = score * freshmen_2022 * (1 + change_2027) # demand for students taking into account selectivity and state demographics

                # create school-state pipeline object and add it to state.schools
                new_pipeline = School_Pipeline(schools_dict[unit_id], freshmen_2022, wt_demand)
                this_state.add_school(new_pipeline)
                this_state.wt_demand_sum += wt_demand 
                this_state.students_2022 += freshmen_2022

            # change state's total students based on 2022-2027 demographic change
            this_state.set_students_2027() 

            # WATERHOLE STEP 2: set inital 2027 student counts for schools
            for unit_id in schools_dict:
                school_pipeline = this_state.schools[unit_id]
                share = school_pipeline.wt_demand / this_state.wt_demand_sum
                school_pipeline.students_2027 = share * this_state.students_2027
                school_pipeline.cap_students() # caps any growth at estimated growth target
                overage = school_pipeline.students_2027 - school_pipeline.capped_students_2027
                this_state.overage_sum += overage
                
                score = scores[unit_id]
                wt_shortfall = score * (school_pipeline.students_2022 - school_pipeline.capped_students_2027)
                school_pipeline.wt_shortfall = wt_shortfall
                this_state.wt_shortfall_sum += wt_shortfall

            # WATERHOLE STEP 3 - n: keep redistributing students until each school is capped by the target growth rate and excess students are apportioned to other schools
            while this_state.overage_sum > 0:
                for unit_id in schools_dict:
                    school_pipeline = this_state.schools[unit_id]
                    surplus = (school_pipeline.wt_shortfall/this_state.wt_shortfall_sum) * this_state.overage_sum
                    school_pipeline.students_2027 = surplus + school_pipeline.capped_students_2027
                    school_pipeline.cap_students() # caps any growth at estimated growth target
                
                this_state.overage_sum = 0 # reset for next loop
                for unit_id in schools_dict:
                    school_pipeline = this_state.schools[unit_id]
                    overage = school_pipeline.students_2027 - school_pipeline.capped_students_2027
                    this_state.overage_sum += overage
                
                this_state.wt_shortfall_sum = 0
                for unit_id in schools_dict:
                    school_pipeline = this_state.schools[unit_id]
                    score = scores[unit_id]
                    wt_shortfall = score * (school_pipeline.students_2022 - school_pipeline.capped_students_2027)
                    school_pipeline.wt_shortfall = wt_shortfall
                    this_state.wt_shortfall_sum += wt_shortfall

    #return states

def main():

    # CREATE DICT OF STATE OBJECTS
    state_demographics = load_data("data/state_demographics.csv")
    states = {}
    for index, row in state_demographics.iterrows():
        state_name = row['State']
        demographics_change_2027 = row['2027_change']
        demographics_change_2032 = row['2032_change']
        states[state_name] = State(state_name, demographics_change_2027, demographics_change_2032)


    #print(states['CA'].birth_change_2027)

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

    # CREATE DICT OF SCHOOL STUDENT PIPELINES
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

    # WATER HOLE algorithm distributes students based on state demographics and school selectivity
    waterhole(states, schools_dict, student_origins_dict)
    #print(states['IL'].schools[145600].students_2027)  

    # Aggregate 2027 student counts for each school
    for unit_id in schools_dict:
       schools_dict[unit_id].set_students(states)

    #print(schools_dict[145600].students_2027)
    return schools_dict

main()

#print(s['IL'].schools[145600].students_2027)
#166683 MIT
#186131
#145600


