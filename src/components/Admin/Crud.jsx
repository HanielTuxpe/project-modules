import React, { useState, useMemo } from 'react';
import { Box, Tabs, Tab, Fade , Button, useMediaQuery} from '@mui/material';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'; // Importa el ícono de flecha derecha
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Importa el ícono de flecha izquierda


import MenuPrincipal from './menu'; // Importa tu menú
import PerfilEmpresa from './PerfilEmpresa'; // Importa perfil de la empresa
import PoliticasPrivacidad from './PoliticasPrivacidad'; // Importa Politicas
import TerminosCondiciones from './TerminosCondiciones'; // Importa TerminosCondiciones
import DeslindeLegal from './DeslindeLegal'; // Importa DeslindeLegal

// Colores personalizados
const wineRed = '#8B0000'; // Rojo vino


// Componente contenedor principal con un diseño centrado
const MainContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(2),

  color: theme.palette.text.primary, // Texto dinámico
borderRadius:'5%',

}));

const EmpresaApp = ({ darkMode }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const isMobile = useMediaQuery('(max-width:600px)');

  const handlePreviousTab = () => {
    // Lógica para ir a la pestaña anterior
    if (selectedTab > 0) {
      handleTabChange(null, selectedTab - 1);
    }
  };

  const handleNextTab = () => {
    // Lógica para ir a la pestaña siguiente
    if (selectedTab < 3) { // Cambia 3 por el número total de pestañas - 1
      handleTabChange(null, selectedTab + 1);
    }
  };

  // Crear el tema basado en el modo oscuro o claro
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: {
            main: wineRed, // Rojo vino
          },
          background: {
            default: darkMode ? '#121212' : '#fff', // Fondo oscuro o claro
            paper: darkMode ? '#1e1e1e' : '#f5f5f5', // Fondo de papel
          },
          text: {
            primary: darkMode ? '#ffffff' : '#000000', // Texto dinámico
          },
        },
        typography: {
          fontFamily: 'Comfortaa, sans-serif', // Tipografía estilizada
        },
      }),
    [darkMode]
  );

  // Cambiar de pestañas
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  // Renderizar el contenido basado en la pestaña seleccionada
  const renderContent = () => {
    switch (selectedTab) {
      case 0:
        return <PerfilEmpresa />;
      case 1:
        return <PoliticasPrivacidad />;
      case 2:
        return <TerminosCondiciones />;
      case 3:
        return <DeslindeLegal />;
      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <MainContainer>
        {/* Menú principal */}
        <MenuPrincipal />

        {/* Menú horizontal centrado */}
        <Box display="flex" justifyContent="center" alignItems="center" mb={4}>
          {isMobile && (
            <Button onClick={handlePreviousTab} disabled={selectedTab === 0}>
              <ArrowBackIcon />
            </Button>
          )}
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            centered
            textColor="primary"
            indicatorColor="primary"
            scrollable
            variant="scrollable"
          >
            <Tab label="Perfil de la Empresa" />
            <Tab label="Políticas de Privacidad" />
            <Tab label="Términos y Condiciones" />
            <Tab label="Deslinde Legal" />
          </Tabs>
          {isMobile && (
            <Button onClick={handleNextTab} disabled={selectedTab === 3}>
              <ArrowForwardIcon />
            </Button>
          )}
        </Box>

        {/* Contenedor del contenido */}
        <Fade in={true} timeout={700}>
          <Box
            width="100%"
            maxWidth={'100%'}
            p={3}
            boxShadow={4}
            borderRadius={4}
            sx={{
              backgroundColor: theme.palette.background.paper, // Fondo dinámico
              padding: { xs: 2, sm: 3 }, // Ajusta el padding según el tamaño de la pantalla
              margin: { xs: 1, sm: 2 }, // Ajusta el margin para móvil
              overflowX: 'auto', // Permitir desplazamiento horizontal si es necesario
              flexDirection: { xs: 'column', md: 'row' }, // Cambiar la dirección del flex si es necesario
            }}
          >
            {renderContent()}
          </Box>
        </Fade>
      </MainContainer>
    </ThemeProvider>
  );
};


export default EmpresaApp;
