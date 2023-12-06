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
import USChoroplethMap from './components/Map';


const IntroCard = ({ title, content }) => (
  <div style={{ margin: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '10px', backgroundColor: '#f9f9f9' }}>
    <h2 style={{ color: '#333' }}>{title}</h2>
    <p style={{ color: '#555' }}>{content}</p>
  </div>
);

export default function Page() {
  const [data, setData] = useState('');
  const [mapData, setMapData] = useState('');
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
    if (!term) return;
  
    setLoading(true);
    Promise.all([
      fetch(`http://localhost:4000/data?university=${encodeURIComponent(term)}`),
      fetch(`http://localhost:4000/map_data?university=${encodeURIComponent(term)}`)
    ])
    .then(async ([dataResponse, mapDataResponse]) => {
      if (!dataResponse.ok || !mapDataResponse.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await dataResponse.json();
      const mapData = await mapDataResponse.json();
  
      setSearchTerm(term);
      setData(data);
      setMapData(mapData); // Assuming you have a state for map data
      setShowIntro(false);
    })
    .catch(error => {
      console.error('Fetch error:', error);
      setError(error);
    })
    .finally(() => {
      setLoading(false);
    });
  };
  
  /*
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
  */



  const introCards = [
    { title: "Will my college thrive?", 
    content: "Discover how shifting student populations across regions and states will uniquely impact college growth and finances. From steep declines to strong growth, find out where your institution stands in the ever-changing landscape of higher education." },
    { title: "Demographic Cliff", 
    content: "The overall pool of US students is shrinking, but this hides significant differences between states and regions. Also, elite schools will fare better, leaving even fewer prospective students for the rest. Some colleges are positioned to thrive while others will struggle to survive." }
  ];

  return (
    <div>
    <ThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flex: 1 }}>
            Search for your University
          </Typography>
          <Typography variant="h6">
            Learn more about our methodology
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
        <div>
  {Object.entries(mapData).map(([key, value]) => (
    <p key={key}>{key}: {value}</p>
  ))}
</div>

      </div>
      <USChoroplethMap mapData={mapData} universityName={searchTerm} />
    </ThemeProvider>
      </div>
      
  );
}