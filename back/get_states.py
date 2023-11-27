import pandas as pd

# Load the CSV files
prestige_df = pd.read_csv('data/school_prestige.csv')
states_df = pd.read_csv('data/school_states.csv')

# Merging the dataframes on 'UnitID' or 'Institution Name'
# Assuming 'UnitID' is a common column in both CSV files.
# Replace 'UnitID' with 'Institution Name' if you want to join on that instead
merged_df = pd.merge(prestige_df, states_df[['UnitID', 'State']], on='UnitID')

# Saving the merged dataframe to a new CSV file
merged_df.to_csv('data/school_prestige_with_state.csv', index=False)
