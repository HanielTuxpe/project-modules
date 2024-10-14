import React, { useState, useMemo ,useEffect} from 'react';
import { Box, Typography, Tabs, Tab, Fade, TextField, IconButton, Button, List, ListItem, ListItemText, Avatar, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';


import MenuPrincipal from './menu'; // Importa tu menú
import PerfilEmpresa from './PerfilEmpresa'; // Importa perfil de la empresa
import PoliticasPrivacidad from './PoliticasPrivacidad'; // Importa Politicas
import TerminosCondiciones from './TerminosCondiciones'; // Importa TerminosCondiciones

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
      <MainContainer>
        {/* Menú principal */}
        <MenuPrincipal />

        {/* Menú horizontal centrado */}
        <Box display="flex" justifyContent="center" alignItems="center" mb={4}>
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


// Componente para deslinde legal
const DeslindeLegal = () => {
  const [items, setItems] = useState(['Deslinde 1', 'Deslinde 2']);
  const [newItem, setNewItem] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState('');

  const addItem = () => {
    if (newItem.trim()) {
      setItems([...items, newItem]);
      setNewItem('');
    }
  };

  const deleteItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const startEdit = (index) => {
    setEditIndex(index);
    setEditValue(items[index]);
  };

  const confirmEdit = () => {
    if (editValue.trim()) {
      const updatedItems = items.map((item, index) =>
        index === editIndex ? editValue : item
      );
      setItems(updatedItems);
      setEditIndex(null);
      setEditValue('');
    }
  };

  return (
    <Box>
      <Typography variant="h5" align="center" color="primary">
        Deslinde Legal
      </Typography>
      <List>
        {items.map((item, index) => (
          <ListItem key={index}>
            <ListItemText primary={item} />
            <IconButton onClick={() => startEdit(index)}>
              <EditIcon color="primary" />
            </IconButton>
            <IconButton onClick={() => deleteItem(index)}>
              <DeleteIcon color="error" />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <Box display="flex" mt={2}>
        <TextField
          value={editIndex !== null ? editValue : newItem}
          onChange={(e) => (editIndex !== null ? setEditValue(e.target.value) : setNewItem(e.target.value))}
          label={editIndex !== null ? "Editar deslinde" : "Nuevo deslinde"}
          fullWidth
        />
        <Button
          onClick={editIndex !== null ? confirmEdit : addItem}
          color="primary"
          variant="contained"
          sx={{ ml: 2 }}
        >
          {editIndex !== null ? "Confirmar" : "Agregar"}
        </Button>
      </Box>
    </Box>
  );
};

export default EmpresaApp;
