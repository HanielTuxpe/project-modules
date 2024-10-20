import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Collapse } from '@mui/material';
import { ExpandLess, ExpandMore, TableChart, BarChart, Lock, PersonAdd, Login } from '@mui/icons-material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';

// Estilos personalizados
const drawerWidth = 240;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
        width: drawerWidth,
        backgroundColor: '#1e1e2d', // Color oscuro del fondo del menú
        color: '#fff',
    },
}));

const StyledListItemText = styled(ListItemText)({
    '& .MuiTypography-root': {
        fontFamily: 'Comfortaa',
        fontWeight: 'bold',
    },
});

function SideMenu({ open, toggleMenu,user }) { // Recibe las props open y toggleMenu
    const [openAuth, setOpenAuth] = React.useState(false); // Controla el despliegue de la sublista de Autenticación
    const navigate = useNavigate(); // useNavigate dentro del componente

    const handleAuthClick = () => {
        setOpenAuth(!openAuth); // Alterna la visibilidad de la sublista de Autenticación
    };

    const handleCrudClick = () => {
        navigate('/Crud'); // Navegar a la ruta "/Crud"
    };

    return (
        <StyledDrawer
            variant="temporary"
            anchor="right"
            open={open} // Usa la prop open para controlar la visibilidad del Drawer
            onClose={toggleMenu} // Usa la prop toggleMenu para cerrar el Drawer
        >
            <List>
                <ListItem>
                    <ListItemText primary="ADMINISTRADOR" style={{ color: '#ffffff' }} />
                </ListItem>
                <ListItem>
                    <ListItemText primary={`Bievenido, ${user}`} style={{ color: '#ffffff' }} />
                </ListItem>

                {/* Elementos del menú */}
                <ListItem button onClick={handleCrudClick}>
                    <ListItemIcon>
                        <TableChart style={{ color: '#c2c2c2' }} />
                    </ListItemIcon>
                    <StyledListItemText primary="INFORMACION DE LA EMPRESA" />
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
    );
}

export default SideMenu;
