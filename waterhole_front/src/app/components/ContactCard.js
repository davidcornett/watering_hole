import { useState } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";

const ContactCard = ({ isMobile }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
  
    const handleSubmit = (e) => {
      e.preventDefault();
      // submit the form to the server
    };

    const cardStyle = {
        margin: '20px auto', 
        padding: '20px', 
        border: '1px solid #ccc', 
        borderRadius: '10px', 
        backgroundColor: '#f9f9f9', 
        textAlign: 'left', 
        maxWidth: isMobile ? '100%' : '50%'
    };

    return (
        <div style={cardStyle}>
            <div style={{ color: '#333' }}>
            <h2 style={{ color: '#333' }}>Contact Us</h2>
            <p>To learn more, please email us or submit the form below:</p>
            <p><strong>Email:</strong> dcornett@edtraverse.com</p>
            </div>
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    margin="normal"
                    required
                />
                <TextField
                    fullWidth
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    margin="normal"
                    required
                    type="email"
                />
                <TextField
                    fullWidth
                    label="Message (optional)"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    margin="normal"
                    multiline
                    rows={4}
                />
                <Button variant="contained" type="submit" sx={{ mt: 2 }}
                    style={{
                        backgroundColor: '#05656b', 
                        color: '#fffcbc'
                        }}
                >
                    Submit
                </Button>
             </form>
        </div>
    );
};

export default ContactCard;
