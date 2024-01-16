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
    //console.log(newInputValue);
    setOpen(newInputValue.length > 0);  // Open dropdown only if there's input
  };

  const handleButtonClick = () => {
    //onSearch("Harvard University (MA)");
    onSearch(inputValue);
  };
  {/*
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
  */}
  return (
    <div style={{ marginLeft: '40px', marginRight: '40px' }}> 
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
      <div style={{ textAlign: 'left', marginTop: '10px'}}> {/* Align button to the left */}
        <Button variant="contained" color="primary" onClick={handleButtonClick} style={{backgroundColor: '#05656b', color: '#fffcbc'}}>
          Search
        </Button>
      </div>
    </div>
  );
  
}

export default SearchBar;
