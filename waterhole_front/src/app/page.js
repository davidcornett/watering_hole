// src/app/page.js
'use client';
import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import SearchBar from './components/SearchBar';
import SchoolInfo from './components/SchoolInfo';


const IntroCard = ({ title, content }) => (
  <div style={{ margin: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '10px', backgroundColor: '#f9f9f9' }}>
    <h2 style={{ color: '#333' }}>{title}</h2>
    <p style={{ color: '#555' }}>{content}</p>
  </div>
);

export default function Page() {
  const [data, setData] = useState('');
  const [showIntro, setShowIntro] = useState(true);  // Control visibility of intro content

  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
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
        return response.json(); // change to .text() if your backend sends plain text instead of JSON
      })
      .then(data => {
        console.log("Received data from server:", data);  // Log the data

        setData(data);
        setShowIntro(false);
        setLoading(false);
      })
      .catch(error => {
        console.error('Fetch error:', error);
        setError(error);
        setLoading(false);
      });
  };

  const introCards = [
    { title: "Introduction", content: "This is the introduction to our application." },
    { title: "Methodology", content: "Here we explain our methodology." },
    { title: "About Us", content: "Information about our team." }
  ];

  return (
    <div>
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
        {showIntro && (
        <div style={{ display: 'flex', justifyContent: 'space-around', margin: '20px' }}>
          {introCards.map((card, index) => (
            <IntroCard key={index} title={card.title} content={card.content} />
          ))}
        </div>
      )}
        <SearchBar onSearch={handleSearch} universityList={universityList} />
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
        <div>
          {data && <SchoolInfo data={data} />}
        </div>
      </div>
    </ThemeProvider>
      </div>
      
  );
}