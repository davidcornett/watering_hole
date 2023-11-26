// src/components/SearchBar.js
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';

function SearchBar({ onSearch, universityList }) {
  const [inputValue, setInputValue] = useState('');

  const handleButtonClick = () => {
    onSearch(inputValue);
  };

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
          <TextField {...params} label="Search for a University" variant="outlined" fullWidth />
        )}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
      />
      <Button variant="contained" color="primary" onClick={handleButtonClick}>
        Search
      </Button>
    </div>
  );
}

export default SearchBar;

