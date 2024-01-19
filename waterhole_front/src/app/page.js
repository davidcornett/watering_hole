// src/app/page.js
'use client';
import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import SearchBar from './components/SearchBar';
import SchoolInfo from './components/SchoolInfo';
import USChoroplethMap from './components/Map';
import OutlookCard from './components/OutlookCard';
import SchoolNote from './components/SchoolNote';
import DevCard from './components/DevCard';
import ContactCard from './components/ContactCard';
import Head from 'next/head';


const getUnderLineStyle = (isCurrentPage) => {
  return {
    borderBottom: isCurrentPage ? '3px solid #fffcbc' : 'none', // Adjust the thickness and color as needed
    color: "#fffcbc",
    flex: 1,
    textTransform: 'none'
  };
};


const IntroCard = ({ title, content }) => (
  <div style={{ margin: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '10px', backgroundColor: '#f9f9f9' }}>
    <h2 style={{ color: '#333' }}>{title}</h2>
    <p style={{ color: '#555', textAlign: 'left' }}>{content}</p>
  </div>
);


const OrgCard = ({ title, content, image, isMobile }) => (
  <div style={{ margin: '20px', 
                padding: '20px', 
                border: '1px solid #ccc', 
                borderRadius: '10px', 
                backgroundColor: '#f9f9f9', 
                textAlign: 'left',  
                maxWidth: isMobile ? '100%' : '50%'
                }}>
    <h2 style={{ color: '#333' }}>{title}</h2>
    <p style={{ color: '#555' }}>{content}</p>
    {image && <img 
    src={image} alt={title} style={{ 
      width: '100%', 
      height: 'auto', 
      marginRight: '20px'}}
      />}
  </div>
);
/*
const OrgCard = ({ title, content, image }) => (
  <div style={{ margin: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '10px', backgroundColor: '#f9f9f9', textAlign: 'left', maxWidth: '60%' }}>
    <h2 style={{ color: '#333' }}>{title}</h2>
    <p style={{ color: '#555' }}>{content}</p>
    {image && (
      <img 
        src={image} 
        alt={title} 
        style={{ width: '100%', height: 'auto', display: 'block', marginTop: '20px' }} 
      />
    )}
  </div>
);
*/


const introCardsStyle = {
  display: 'flex',
  justifyContent: 'space-around',
  margin: '20px',
  flexWrap: 'wrap' // This will allow cards to wrap onto the next line on smaller screens
};

export default function Page() {
  const [data, setData] = useState('');
  const [mapData, setMapData] = useState('');
  const [showIntro, setShowIntro] = useState(true);  // Control visibility of intro content
  const [showOrgs, setShowOrgs] = useState(false);  // Control visibility of org content

  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [universityList, setUniversityList] = useState([]);

  const [showNote, setShowNote] = useState(false);

  useEffect(() => {
    // Fetch the list of universities from your backend
    const fetchUniversityList = async () => {
      try {
        //const response = await fetch('http://localhost:4000/universities');
        const response = await fetch('http://10.100.102.7:4000/universities');  
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
      fetch(`http://10.100.102.7:4000/data?university=${encodeURIComponent(term)}`),
      fetch(`http://10.100.102.7:4000/map_data?university=${encodeURIComponent(term)}`)
    ])
    .then(async ([dataResponse, mapDataResponse]) => {
      if (!dataResponse.ok || !mapDataResponse.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await dataResponse.json();
      const mapData = await mapDataResponse.json();
  
      setSearchTerm(term);
      setData(data);
      setMapData(mapData);
      setShowIntro(false);
      setShowNote(data.students_change > 0 && data.students_change_sidewalk < 0);

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
    content: "Elite schools will fare better. This leaves even fewer graduating high school students for the rest. Non-selective schools with poor demographics will have the highest risk of financial difficulties." }
  ];

  const orgCards = [
    { title: "Find Segments of Growing Educational Clients", 
    content: "Despite the 'demographic cliff,' many institutions will thrive due to their strong demographic pipeline and attractiveness to students. Their increasing budgets position them as strong potential clients for your organization. In contrast, other institutions will face budgetary pressures and a higher risk of financial difficulty.",
    image: "/matrix.png"
  },
    { title: "Our Approach",
    content: "We merge educational-specific datasets with demographic trends to model changes to net tuition and operating revenue for nearly 3,000 institutions. Here is the overall landscape in 2032:",
    image: "/piechart.png" 
  }
  ];

  const isMobile = window.innerWidth <= 600;

  return (
    <div>

      <Head>
        <title>My Custom Page Title</title>
      </Head>
      
    <ThemeProvider theme={theme}>
      <AppBar className="button" position="static" style={{ backgroundColor: '#05656b' }}>
        <Toolbar>
        <img src="/logo_clear_simple.png" alt="Logo" style={{ height: '50px', marginRight: '20px' }} />

          <Button
            color="inherit"
            onClick={() => {
              setShowOrgs(false); // show org content
              setShowIntro(true); // show intro content
            }}
            sx={{ textTransform: 'none' }}
          >
          <Typography variant="h6" style={getUnderLineStyle(!showOrgs)}>
            University Search
          </Typography>
          </Button>

          {/* spacer to push next button to the right */}
          <Typography style={{ flexGrow: 1 }}></Typography>
          
          <Button
            className="button"
            color="inherit"
            onClick={() => {
              setShowOrgs(true);
              setShowIntro(false);
            }} 
            sx={{ textTransform: 'none' }}
          >
          <Typography variant="h6" style={getUnderLineStyle(showOrgs)}>
            Solutions for Organizations
          </Typography>
          </Button>
  
        </Toolbar>
      </AppBar>

      <div>
        <div style={{ textAlign: 'center', margin: '40px 0' }}>

        {showIntro && (
          <>

          <div style={{ position: 'relative', display: 'inline-block' }}>
              <img src="/logo_clear.png" alt="Your Logo" style={{ height: '250px', width: 'auto' }} />
              <span className="logo" style={{ 
                  position: 'absolute', 
                  top: '20%', 
                  left: '50%', 
                  transform: 'translate(-50%, -50%)', 
                  fontSize: '36px',
                  fontWeight: '400'
              }}>
                  <span style={{ color: '#002542' }}>Ed</span>
                  <span style={{ color: '#fffcbc' }}>Traverse</span>
              </span>
          </div>

          {/*
          <img src="/logo_clear.png" alt="Logo" style={{ height: '250px', marginRight: '20px' }} />
          */}
          <h1 style={{ fontSize: '2.5em', marginBottom: '10px' }}>Will My College Thrive?</h1>
          <p style={{ fontSize: '1.2em', maxWidth: '800px', margin: 'auto', lineHeight: '1.6', color: '#999' }}>
          Discover how changing demographics will uniquely impact each educational institution.
          </p>
          </>
        )}

        { !showOrgs && (
        <>
          <SearchBar onSearch={handleSearch} universityList={universityList} />
          {loading && <p>Loading...</p>}
          {error && <p>Error: {error.message}</p>}
        </>
          )}


        {showIntro && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-around', 
            margin: '20px',
            flexWrap: isMobile ? 'wrap' : 'nowrap' // vertically align cards on mobile
            }}>
            {introCards.map((card, index) => (
              <IntroCard key={index} title={card.title} content={card.content} />
            
            ))}
          </div>
        )}
        </div>

        <div style={{ 
          display: 'flex', 
          flexDfirection: 'row',
          flexWrap: isMobile ? 'wrap' : 'nowrap' // vertically align cards on mobile
          }}>
          {!showOrgs &&
          <>
          {data && <OutlookCard data={data} />}
          {data && <SchoolInfo data={data} />}
          {data && <DevCard data={data} />}
          </>
          }
          
        </div>

        <div style={{ display: 'flex' }}>
        {showNote && !showOrgs && <SchoolNote />}
        </div>

        <div>
          {data && !showOrgs && (
          <>
          <h3 style={{ textAlign: 'center' }}>Map of US student pipeline for {data.name} (darker shades indicate more students)</h3>
          <USChoroplethMap mapData={mapData} universityName={searchTerm} schoolCoords={{ lat: data.latitude, lon: data.longitude }} isMobile={isMobile}/>

          </>
          )
          }

        </div>

        {showOrgs && (
          <>
          <div style={{
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '40px 0'
          }}>
              <img src="/logo_clear_simple.png" alt="Your Logo" style={{ height: '250px', width: 'auto' }} />
              <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#05656b', 
                  padding: '10px', // Adjust padding to control the size of the box
                  height: '250px', // Match the height of the logo
                  boxSizing: 'border-box' // Ensures padding is included in height calculation
              }}>
                  <h1 style={{ 
                      fontSize: '2.5em', 
                      marginRight: '40px', // Add some space between the logo and text
                      marginBottom: '0', // Remove the bottom margin to align with the bottom of the box
                      color: '#fffcbc' // Optional: Change text color for contrast
                  }}>
                      Leverage Our Higher Education Insights to Grow Your Business
                  </h1>
              </div>
          </div>


          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-around', 
            margin: '20px',
            flexWrap: isMobile ? 'wrap' : 'nowrap' // vertically align cards on mobile
            }}>
            {orgCards.map((card, index) => (
              <OrgCard key={index} title={card.title} content={card.content} image={card.image} isMobile={isMobile}/>
            ))}
          </div>
          <ContactCard />
          
          </>
          )}



      </div>
      <footer style={{ backgroundColor: '#2a2a2a', padding: '20px', textAlign: 'center' }}>
        <div style={{ marginBottom: '15px', color: '#dcdcdc' }}>
            <p>Email: dcornett@edtraverse.com</p>
        </div>

        <div style={{ marginBottom: '15px', color: '#dcdcdc' }}>
            <p>© 2024 EdTraverse. All Rights Reserved.</p>
        </div>

        <div style={{ color: '#dcdcdc', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '300px', margin: '10px', textAlign: 'left' }}>
              <strong>About EdTraverse</strong>
              <p> EdTraverse empowers prospective college students, parents, organizations, and other stakeholders
                successfully traverse the changing landscape of higher education. Our first service predicts the 
                growth or decline of nearly 3,000 US educational institutions based on demographic trends.
              </p><br></br>
              <p>David Cornett founded EdTraverse to navigate the societal, cultural, and technological
                changes impacting higher education. He brings more than a decade of strategic progam leadership, product development,
                financial analysis, and managing emerging risks at the leading insurance & risk management company for educational institutions.
              </p>
          </div>
          <div style={{ flex: 1, minWidth: '300px', margin: '10px', textAlign: 'left' }}>
          <strong>Disclaimer</strong>
              <p>Our model captures important factors impacting school trajectories: selectivity and demographics.
                However, additional factors will also impact educational institutions, including their leadership decisions,
                vision & mission, financial strength, debt usage, research activities, acedemic program management, 
                alumni & donor base, and athletic success. </p>
          </div>
        </div>
    </footer>

    </ThemeProvider>
      </div>
      
  );
}