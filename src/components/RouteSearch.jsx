import React, { useState, useEffect, useRef } from 'react';
import { Container, Box, Typography, Drawer, IconButton, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu'; // Icono para el menú
import Menu from './menu'; // Importamos el nuevo menú lateral

const drawerWidth = 240; // Ancho del menú lateral

const BuscarRuta = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false); // Estado para controlar el menú lateral
    const menuRef = useRef(null); // Referencia para el Drawer

    const user = localStorage.getItem('usuario');
    const isMobile = useMediaQuery('(max-width:600px)'); // Detecta si es un dispositivo móvil

    useEffect(() => {
        const savedTheme = localStorage.getItem('darkMode') === 'true';
        setDarkMode(savedTheme);
    }, []);

    // Manejar clics fuera del menú para cerrarlo
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false); // Cierra el menú si el clic fue fuera del Drawer
            }
        };

        if (menuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuOpen]);

    const toggleDrawer = () => {
        setMenuOpen(!menuOpen); // Alterna la apertura del menú
    };

    return (
        <Container
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                m: 0,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mt: 8,
                    width: '100%',
                }}
            >
                <Menu></Menu>
                <Typography component="h1" variant="h5">
                    BIENVENIDO {user}
                </Typography>

               
            </Box>
        </Container>
    );
};

export default BuscarRuta;
