import React from 'react';
import { Button } from '@mui/material';

const OfferCard = ({ learnMore }) => {
    return (
        <div style={{ margin: '20px', 
                        padding: '20px', 
                        border: '1px solid #ccc', 
                        borderRadius: '10px', 
                        backgroundColor: '#f9f9f9' }}>
            <h2 style={{ color: '#333' }}>Discover More with EdTraverse</h2>
            <p style={{ color: '#555' }}>
                Get detailed 5 & 10-year forecasts for nearly 3,000 institutions
            </p>
            <Button 
                variant="contained" 
                style={{ backgroundColor: '#05656b', color: '#fffcbc', marginTop: '20px', padding: '10px 20px', fontSize: '16px' }}
                onClick={learnMore}
            >
                Learn More
            </Button>
        </div>
    );
};

export default OfferCard;