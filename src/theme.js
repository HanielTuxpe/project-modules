import { createTheme } from '@mui/material/styles';
import '@fontsource/roboto-condensed/700.css'; // Extra-negrita

const getTheme = (darkMode) =>
    createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light',
            primary: {
                main: '#921F45',
            },
            background: {
                default: darkMode ? '#121212' : '#D9D9D9', // Fondo general para ambos modos
                paper: darkMode ? '#424242' : '#ffffff', // Fondo de componentes tipo "papel"
            },
            text: {
                primary: darkMode ? '#ffffff' : '#000000', // Ajuste del color del texto según el modo
            },
        },
        typography: {
            fontFamily: 'Roboto Condensed',
            h1: { fontWeight: 700 },
            h2: { fontWeight: 700 },
            h3: { fontWeight: 700 },
            fontWeightBold: 900,
        },
        shadows: Array(25).fill(darkMode 
            ? '6px 4px 6px rgba(255, 255, 255, 0.3)' 
            : '6px 4px 6px rgba(0, 0, 0, 0.3)'
        ), // Define 25 sombras para evitar el error de índice
    });

export default getTheme;
