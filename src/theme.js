import { createTheme } from '@mui/material/styles';

const getTheme = (darkMode) =>
    createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light',
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

export default getTheme;
