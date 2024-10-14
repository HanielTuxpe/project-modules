import { createTheme } from '@mui/material/styles';
import '@fontsource/roboto-condensed/900.css';  // Extra-negrita

const getTheme = (darkMode) =>
    createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light',
            primary: {
                main: '#1976d2', // Azul principal
            },
            secondary: {
                main: '#D9D9D9', // Naranja secundario
            },
            background: {
                default: '#D9D9D9', // Color de fondo general
                paper: '#ffffff', // Color de fondo de los componentes de papel (opcional)
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
