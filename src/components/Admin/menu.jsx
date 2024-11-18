import React, { useEffect, useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { TableChart } from '@mui/icons-material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { obtenerTipoUsuario } from '../SessionService';

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

function SideMenu({ open, toggleMenu }) {
    const navigate = useNavigate();
    const [user, setUser] = useState(() => obtenerTipoUsuario()); // Inicializa el estado con el valor de la cookie

    useEffect(() => {
        // Ejecuta cada vez que el componente se renderiza
        const savedUser = obtenerTipoUsuario(); // Obtiene el valor actual de la cookie
        if (savedUser !== user) { // Si el valor de la cookie es diferente del estado actual
            setUser(savedUser); // Actualiza el estado solo si la cookie ha cambiado
        }
    }, [user]); // Se ejecuta siempre que el estado `user` cambie
    

    const handleCrudClick = () => {
        navigate('/Crud');
    };

    const handleUsuariosClick = () => {
        navigate('/Usuarios');
    };

    return (
        <StyledDrawer
            variant="temporary"
            anchor="right"
            open={open}
            onClose={toggleMenu}
        >
            <List>
                {user && user === 'Admin' ? (
                    <>
                        <ListItem>
                            <ListItemText primary="ADMINISTRADOR" style={{ color: '#ffffff' }} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary={`Bienvenido, ${user}`} style={{ color: '#ffffff' }} />
                        </ListItem>
                        <ListItem button onClick={handleCrudClick}>
                            <ListItemIcon>
                                <TableChart style={{ color: '#c2c2c2' }} />
                            </ListItemIcon>
                            <Typography>
                                INFORMACIÓN DE LA EMPRESA
                            </Typography>
                        </ListItem>
                        <ListItem button onClick={handleUsuariosClick}>
                            <ListItemIcon>
                                <TableChart style={{ color: '#c2c2c2' }} />
                            </ListItemIcon>
                            <Typography>
                                USUARIOS
                            </Typography>
                        </ListItem>
                    </>
                ) : (
                    <ListItem>
                        <ListItemText primary={`Por favor, inicie sesión${user ? `, ${user}` : ''}`} style={{ color: '#ffffff' }} />
                    </ListItem>
                )}
            </List>
        </StyledDrawer>
    );
}

export default SideMenu;
