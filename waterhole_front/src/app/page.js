// src/app/page.js
'use client';
import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import SearchBar from './SearchBar';

export default function Page() {
  const [data, setData] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [universityList, setUniversityList] = useState([]);

  useEffect(() => {
    // Fetch the list of universities from your backend
    const fetchUniversityList = async () => {
      try {
        const response = await fetch('http://localhost:4000/universities'); // Adjust the URL to your API endpoint
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUniversityList(data); // Assuming the response is the array of universities
      } catch (error) {
        console.error('Fetch error:', error);
        // Handle any errors here, such as setting an error state
      }
    };

    fetchUniversityList();
  }, []); // empty dependency array ([]) ensures that the fetching logic runs only once when the component mounts

  const handleSearch = (term) => {
    if (!term) return;  // Avoid searching when the input is empty

    setLoading(true);
    fetch(`http://localhost:4000/data?university=${encodeURIComponent(term)}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Fetch error:', error);
        setError(error);
        setLoading(false);
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            Search for your University
          </Typography>
        </Toolbar>
      </AppBar>
      <div>
        <h1>University Data</h1>
        <SearchBar onSearch={handleSearch} universityList={universityList} />
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
        <pre>{data ? JSON.stringify(data, null, 2) : 'No data'}</pre>
      </div>
    </ThemeProvider>
  );
}