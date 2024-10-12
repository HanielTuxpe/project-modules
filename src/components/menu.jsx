import React, { useState, useRef, useEffect } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Collapse, IconButton, Box } from '@mui/material';
import { ExpandLess, ExpandMore, TableChart, BarChart, Lock, PersonAdd, Login, Menu, ArrowBack } from '@mui/icons-material';
import { styled } from '@mui/system';
import useMediaQuery from '@mui/material/useMediaQuery';
import MenuIcon from '@mui/icons-material/Menu'; // Icono para el menú
import { useNavigate } from 'react-router-dom';

// Estilos personalizados
const drawerWidth = 240;
const miniDrawerWidth = 20; // Ancho de la barra lateral delgada

const StyledDrawer = styled(Drawer)(({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
        width: drawerWidth,
        backgroundColor: '#1e1e2d', // Color oscuro del fondo del menú
        color: '#fff',
    },
}));

const MiniDrawer = styled(Box)(({ theme }) => ({
    width: miniDrawerWidth,
    height: '100vh',
    backgroundColor: '#1e1e2d', // Color oscuro de la barra delgada
    position: 'fixed', // Fijo para que esté en la esquina izquierda
    top: 0, // Asegura que esté en la parte superior
    left: 0, // Asegura que esté en la parte izquierda
    display: 'flex',
    justifyContent: 'center', // Centra verticalmente el contenido
    alignItems: 'center', // Centra horizontalmente el contenido
    color: '#fff',
    zIndex: 1000, // Asegúrate de que esté por encima de otros elementos
    cursor: 'pointer', // Hacer que la barra delgada sea interactiva (se vea como un botón)
}));

const StyledListItemText = styled(ListItemText)({
    '& .MuiTypography-root': {
        fontFamily: 'Comfortaa',
        fontWeight: 'bold',
    },
});

function SideMenu() {
    const [openAuth, setOpenAuth] = useState(false); // Controla el despliegue de la sublista de Autenticación
    const [openDrawer, setOpenDrawer] = useState(false); // Controla la apertura del Drawer en móviles y escritorio
    const isMobile = useMediaQuery('(max-width: 600px)'); // Detecta si es un dispositivo móvil
    const drawerRef = useRef(null); // Ref para el Drawer
    const navigate = useNavigate(); // Aquí movemos useNavigate dentro del componente

    const handleAuthClick = () => {
        setOpenAuth(!openAuth); // Alterna la visibilidad de la sublista de Autenticación
    };

    const handleDrawerToggle = () => {
        setOpenDrawer(!openDrawer); // Alterna la apertura/cierre del menú
    };

    // Cierra el Drawer si se hace clic fuera de él
    const handleClickOutside = (event) => {
        if (drawerRef.current && !drawerRef.current.contains(event.target)) {
            setOpenDrawer(false);
        }
    };

    // Añade el evento de clic al documento al montar el componente
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleCrudClick = () => {
        navigate('/Crud'); // Navegar a la ruta "/Crud"
    };

    return (
        <>
            {/* Botón de menú para móviles */}
            {isMobile && (
                <IconButton
                    onClick={handleDrawerToggle}
                    style={{
                        position: 'absolute',
                        top: '5%',
                        left: 16,
                        color: '#fff',
                        zIndex: 1200, // Asegura que el ícono esté por encima de otros elementos
                        backgroundColor: '#333', // Añade un fondo oscuro si es necesario para mayor visibilidad
                        padding: '10px', // Añade un poco de padding para hacerlo más clicable
                    }}
                >
                    {openDrawer ? <ArrowBack /> : <Menu />} {/* Cambia el ícono según el estado del menú */}
                </IconButton>
            )}

            {/* Barra delgada interactiva para pantallas grandes */}
            {!isMobile && !openDrawer && (
                <MiniDrawer onClick={handleDrawerToggle}> {/* Toda la barra es clickable */}
                    <IconButton style={{ color: '#fff' }}>
                        <Menu />
                    </IconButton>
                </MiniDrawer>
            )}

            {/* Drawer para móvil y PC */}
            <StyledDrawer
                ref={drawerRef} // Asignar el ref al Drawer
                variant={isMobile ? 'temporary' : 'persistent'} // El Drawer es temporal en móviles y permanente en pantallas grandes
                anchor="left"
                open={openDrawer} // Solo se abre cuando `openDrawer` es verdadero
                onClose={handleDrawerToggle} // Cierra el Drawer en móviles y pantallas grandes al hacer clic fuera
                ModalProps={{
                    keepMounted: true, // Mantener el Drawer montado en el DOM para evitar problemas de rendimiento
                }}
            >
                <List>
                    <ListItem>
                        <ListItemText primary="NEXTRO ABLE" style={{ color: '#ffffff' }} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="40+ Ready to Use from Plugins" style={{ color: '#ffffff' }} />
                    </ListItem>

                    {/* Elementos del menú */}
                    <ListItem button onClick={handleCrudClick}>
                        <ListItemIcon>
                            <TableChart style={{ color: '#c2c2c2' }} />
                        </ListItemIcon>
                        <StyledListItemText primary="Bootstrap Table" />
                    </ListItem>

                    <ListItem button>
                        <ListItemIcon>
                            <BarChart style={{ color: '#c2c2c2' }} />
                        </ListItemIcon>
                        <StyledListItemText primary="Chart & Maps" />
                    </ListItem>

                    {/* Desplegable para Autenticación */}
                    <ListItem button onClick={handleAuthClick}>
                        <ListItemIcon>
                            <Lock style={{ color: '#c2c2c2' }} />
                        </ListItemIcon>
                        <StyledListItemText primary="Authentication" />
                        {openAuth ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>

                    <Collapse in={openAuth} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItem button style={{ paddingLeft: 32 }}>
                                <ListItemIcon>
                                    <PersonAdd style={{ color: '#c2c2c2' }} />
                                </ListItemIcon>
                                <StyledListItemText primary="Sign Up" />
                            </ListItem>
                            <ListItem button style={{ paddingLeft: 32 }}>
                                <ListItemIcon>
                                    <Login style={{ color: '#c2c2c2' }} />
                                </ListItemIcon>
                                <StyledListItemText primary="Sign In" />
                            </ListItem>
                        </List>
                    </Collapse>
                </List>
            </StyledDrawer>
        </>
    );
}

export default SideMenu;
