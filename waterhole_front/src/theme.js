// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6', // Example color
    },
    // Add other color overrides if needed
  },

  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: 'white', // Background color for TextFields
          color: 'black', // Text color for TextFields
          '& .MuiInputBase-input': {
            color: 'black', // This sets the text color for input
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'black', // This sets the border color
            },
            '&:hover fieldset': {
              borderColor: '#556cd6', // This sets the border color on hover
            },
            '&.Mui-focused fieldset': {
              borderColor: '#556cd6', // This sets the border color on focus
            },
          },
        },
      },
    },
  },
});

export default theme;

