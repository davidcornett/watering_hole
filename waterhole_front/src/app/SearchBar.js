// src/components/SearchBar.js
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';

function SearchBar({ onSearch, universityList }) {
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState(false);

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
    setOpen(newInputValue.length > 0);  // Open dropdown only if there's input
  };

  const handleButtonClick = () => {
    onSearch(inputValue);
  };

  return (
    <div>
      <Autocomplete
        freeSolo
        open={open}
        onOpen={() => {
          if (inputValue.length > 0) {
            setOpen(true);
          }
        }}
        onClose={() => setOpen(false)}
        options={universityList}
        renderInput={(params) => (
          <TextField {...params} label="Search for a University" variant="outlined" fullWidth />
        )}
        onInputChange={handleInputChange}
      />
      <Button variant="contained" color="primary" onClick={handleButtonClick}>
        Search
      </Button>
    </div>
  );
}

export default SearchBar;
