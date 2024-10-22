import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { TableChart} from '@mui/icons-material';
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

function SideMenu({ open, toggleMenu, user }) { // Recibe las props open y toggleMenu
    const navigate = useNavigate(); // useNavigate dentro del componente

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
                {/* Verificar si hay un usuario autenticado y si es administrador */}
                {user && user === 'Admin' ? (
                    <>
                        <ListItem>
                            <ListItemText primary="ADMINISTRADOR" style={{ color: '#ffffff' }} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary={`Bienvenido, ${user}`} style={{ color: '#ffffff' }} />
                        </ListItem>

                        {/* Elementos del menú */}
                        <ListItem button onClick={handleCrudClick}>
                            <ListItemIcon>
                                <TableChart style={{ color: '#c2c2c2' }} />
                            </ListItemIcon>
                            <Typography>
                                INFORMACION DE LA EMPRESA
                            </Typography>
                        </ListItem>
                    </>
                ) : (
                    <ListItem>
                        <ListItemText primary={`Por favor, inicie sesión, ${user}`} style={{ color: '#ffffff' }} />
                    </ListItem>
                )}
            </List>
        </StyledDrawer>
    );

}

export default SideMenu;
