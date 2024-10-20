import { createTheme } from '@mui/material/styles';
import '@fontsource/roboto-condensed/900.css';  // Extra-negrita

const getTheme = (darkMode) =>
    createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light',
            primary: {
                main: '#921F45',
            },
            background: {
                default: darkMode ? '#000000' : '#D9D9D9', // Color de fondo general para ambos modos
                paper: '#ffffff', // Color de fondo de los componentes de papel en modo claro
            },
            text: {
                primary: '#ffffff', // Establecer el color del texto en blanco para ambos modos
            },
            shadows: {
                light: '6px 4px 6px rgba(0, 0, 0, 0.3)', // Sombra para el modo claro
                dark: '6px 4px 6px rgba(255, 255, 255, 0.3)',  // Sombra para el modo oscuro
            },
        },
        typography: {
            fontFamily: 'Roboto Condensed',
            fontWeightBold: 900,
        }, 
    });

export default getTheme;
