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
            shadows: {
                light: '6px 4px 6px rgba(0, 0, 0, 0.3)', // Sombra para el modo claro
                dark: '6px 4px 6px rgba(255, 255, 255, 0.3)',  // Sombra para el modo oscuro
            },
        },
        typography: {
            fontFamily: 'Arial, sans-serif',
        },
    });

export default getTheme;
