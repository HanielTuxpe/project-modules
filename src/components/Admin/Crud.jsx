import React, { useState } from 'react';
import { Box, Tabs, Tab, Fade , Button, useMediaQuery} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'; // Importa el ícono de flecha derecha
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Importa el ícono de flecha izquierda


import PerfilEmpresa from '../Admin/PerfilEmpresa'; // Importa perfil de la empresa
import PoliticasPrivacidad from '../Admin/PoliticasPrivacidad'; // Importa Politicas
import TerminosCondiciones from '../Admin/TerminosCondiciones'; // Importa TerminosCondiciones
import DeslindeLegal from '../Admin/DeslindeLegal'; // Importa DeslindeLegal


const EmpresaApp = () => {
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
    <Box  >
      {/* Contenedor principal del menú */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        mb={4}
        sx={{
          flexWrap: isMobile ? "nowrap" : "wrap", // En móvil, evita que las pestañas se envuelvan.
          gap: isMobile ? 1 : 2, // Ajusta el espacio entre elementos.
        }}
      >
        {/* Botón de retroceso en móvil */}
        {isMobile && (
          <Button onClick={handlePreviousTab} disabled={selectedTab === 0}>
            <ArrowBackIcon />
          </Button>
        )}

        {/* Pestañas con comportamiento adaptable */}
        <Box
       
          display="flex"
          flexGrow={1}
          justifyContent={isMobile ? "flex-start" : "center"}
          sx={{
            overflowX: isMobile ? "auto" : "visible", // Desplazamiento horizontal en móvil.
            maxWidth: "100%",
            whiteSpace: isMobile ? "nowrap" : "normal",
          }}
        >
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            textColor="primary"
            indicatorColor="primary"
            centered={!isMobile}
            variant={isMobile ? "scrollable" : "standard"}
          >
            <Tab label="Perfil de la Empresa" />
            <Tab label="Políticas de Privacidad" />
            <Tab label="Términos y Condiciones" />
            <Tab label="Deslinde Legal" />
          </Tabs>
        </Box>

        {/* Botón de avance en móvil */}
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
            bgcolor="secondary.main"
            sx={{
           
              padding: { xs: 2, sm: 3 }, // Ajusta el padding según el tamaño de la pantalla
              margin: { xs: 1, sm: 2 }, // Ajusta el margin para móvil
              overflowX: 'auto', // Permitir desplazamiento horizontal si es necesario
              flexDirection: { xs: 'column', md: 'row' }, // Cambiar la dirección del flex si es necesario
            }}
          >
            {renderContent()}
          </Box>
        </Fade>

    </Box>
  );
};


export default EmpresaApp;
