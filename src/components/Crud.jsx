import React, { useState, useMemo } from 'react';
import { Box, Tabs, Tab, Fade } from '@mui/material';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';


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
      <MainContainer >
        {/* Menú principal */}
        <MenuPrincipal />

        {/* Menú horizontal centrado */}
        <Box display="flex" justifyContent="center" alignItems="center" mb={4} >
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            centered
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="Perfil de la Empresa" />
            <Tab label="Políticas de Privacidad" />
            <Tab label="Términos y Condiciones" />
            <Tab label="Deslinde Legal" />
          </Tabs>
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
