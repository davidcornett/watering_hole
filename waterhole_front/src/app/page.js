// src/app/page.js
'use client';
import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import SearchBar from './components/SearchBar';
import SchoolInfo from './components/SchoolInfo';
import USChoroplethMap from './components/Map';
import OutlookCard from './components/OutlookCard';


const IntroCard = ({ title, content }) => (
  <div style={{ margin: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '10px', backgroundColor: '#f9f9f9' }}>
    <h2 style={{ color: '#333' }}>{title}</h2>
    <p style={{ color: '#555', textAlign: 'left' }}>{content}</p>
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
      console.log(data)
      setMapData(mapData);
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

  const introCards = [
    { title: "Demographic Cliff", 
    content: "The overall pool of US students is shrinking, but this hides significant differences between states and regions. Colleges with student pipelines from growing areas are positioned to thrive while others will struggle to survive." },
    { title: "Selectivity Matters",
    content: "Elite schools will fare better. This leaves even fewer prospective students for the rest. Non-selective schools with poor demographics will have the highest risk of financial difficulties." }
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
        <div style={{ textAlign: 'center', margin: '40px 0' }}>
          <h1 style={{ fontSize: '2.5em', marginBottom: '10px' }}>Will My College Thrive?</h1>
          <p style={{ fontSize: '1.2em', maxWidth: '800px', margin: 'auto', lineHeight: '1.6', color: '#999' }}>
          Discover how changing demographics will uniquely impact each college.
          </p>
          {showIntro && (
          <div style={{ display: 'flex', justifyContent: 'space-around', margin: '20px' }}>
            {introCards.map((card, index) => (
              <IntroCard key={index} title={card.title} content={card.content} />
            ))}
          </div>
          )}
        </div>
        <SearchBar onSearch={handleSearch} universityList={universityList} />
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
        <div style={{ display: 'flex', flexDfirection: 'row' }}>
          {data && <SchoolInfo data={data} />}
          {data && <OutlookCard data={data} />}
        </div>

        <div>
          <h3 style={{ textAlign: 'center' }}>Map of student pipeline for {data.name} (darker shades indicate more students)</h3>
          {data && <USChoroplethMap mapData={mapData} universityName={searchTerm} />}
        </div>
      </div>

    </ThemeProvider>
      </div>
      
  );
}