from waterhole import load_data

def main():
    state_demographics = load_data("data/state_demographics.csv")
    schools = load_data("data/school_prestige_with_state.csv")
    student_origins = load_data("data/school_student_geography.csv")

    # Map states to their demographic changes
    state_changes = {row['State']: row['2027_change'] for index, row in state_demographics.iterrows()}
    print(state_changes)

    schools_dict = {}
    for index, row in schools.iterrows():
        schools_dict[row["UnitID"]] = {
            "name": row["Institution Name"],
            "name_with_state": row["Institution Name"] + " (" + row["State"] + ")",
            "state": row["State"],
            "demographic_projected_2027": 0  # Initialize the count
        }

    # Calculate the projected 2027 count based on demographics
    for index, row in student_origins.iterrows():
        school_id = row['UnitID']
        if school_id in schools_dict:
            total_count = 0
            for state, change in state_changes.items():
                state_student_count = row[state]
                if (school_id == 100937): 
                    print(f"{state}: {state_student_count} * (1 + {change})")
                total_count += state_student_count * (1 + change)
            schools_dict[school_id]["demographic_projected_2027"] = total_count

    tests = ["240693", "213996", "196130", "169248", "100812"]
    for unit_id, school in schools_dict.items():
        if str(unit_id) in tests:
            print(f"{school['name_with_state']}: Projected 2027 Students: {school['demographic_projected_2027']}")

main()
