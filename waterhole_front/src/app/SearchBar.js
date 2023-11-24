// src/components/SearchBar.js
import React from 'react';
import TextField from '@mui/material/TextField';

function SearchBar({ onSearch }) {
  return (
    <TextField
      label="Search for a University"
      variant="outlined"
      fullWidth
      onChange={(e) => onSearch(e.target.value)}
    />
  );
}

export default SearchBar;

