// src/components/SearchBar.js
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';

function SearchBar({ onSearch, universityList }) {

  /*
  const [input, setInput] = useState('');

  const handleSearch = () => {
    onSearch(input);
  };
  */

  return (
    <div>
      <Autocomplete
        freeSolo
        options={universityList}
        renderInput={(params) => (
          <TextField {...params} 
          label="Search for a University" 
          variant="outlined" 
          fullWidth 
          style={{ color: 'white' }} // Adjust the color as needed
          />
        )}
        onInputChange={(event, newInputValue) => {
          onSearch(newInputValue);
        }}
      />
      <Button variant="contained" color="primary" onClick={() => onSearch()}>
        Search
      </Button>
    </div>
  );
}
export default SearchBar;

