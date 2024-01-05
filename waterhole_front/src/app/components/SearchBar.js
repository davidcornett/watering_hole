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
    // this works: 
    console.log(newInputValue);
    setOpen(newInputValue.length > 0);  // Open dropdown only if there's input
  };

  const handleButtonClick = () => {
    onSearch("Harvard University (MA)");
    //onSearch(inputValue);
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
      <Button variant="contained" color="primary" onClick={handleButtonClick} onTouchEnd={handleButtonClick}>
        Search
      </Button>
    </div>
  );
}

export default SearchBar;
/*

function SearchBar({ onSearch, universityList }) {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
  };

  const handleButtonClick = () => {
    onSearch(inputValue);
  };

  return (
    <div>
      <Autocomplete
        freeSolo
        disableClearable
        inputValue={inputValue}
        onInputChange={handleInputChange}
        options={universityList.map((option) => option.title)}
        filterOptions={(options) => inputValue ? options : []} // Filter options based on whether the user has inputted something
        renderInput={(params) => (
          <TextField 
            {...params} 
            label="Search for a University" 
            variant="outlined" 
            fullWidth 
          />
        )}
      />
      <Button variant="contained" color="primary" onClick={handleButtonClick} onTouchEnd={handleButtonClick}>
        Search
      </Button>
    </div>
  );
}

export default SearchBar;
*/