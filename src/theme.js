// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2', // Azul principal
        },
        secondary: {
            main: '#ff9800', // Naranja secundario
        },
    },
    typography: {
        fontFamily: 'Arial, sans-serif',
    },
});

export default theme;
