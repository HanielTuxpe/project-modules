import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Box, Button, IconButton } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LoginIcon from '@mui/icons-material/Login';
import Home from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu'; // Icono para el menú
import { useNavigate } from 'react-router-dom';
import logo from '../assets/uthh.png';
import useMediaQuery from '@mui/material/useMediaQuery';

const Header = ({ usuario, onLogout, toggleDarkMode, darkMode }) => {
    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width: 600px)'); // Detecta si es un dispositivo móvil


    const user = localStorage.getItem('usuario');

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleLogoutClick = () => {
        onLogout();
        navigate('/');
    };

    const handleGoIndex = () => {
        // Verifica si hay un usuario almacenado
        if (user) {
            navigate('/index'); // Si hay usuario, navega a /index
        } else {
            navigate('/'); // Si no hay usuario, navega a /
        }
    };

    return (
        <AppBar position="static"
            sx={{
                mb: 2,
                backgroundColor: '#921F45',
                color: '#fff',
            }}
        >
            <Toolbar>
                <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                    <img src={logo} alt="My Icon" style={{ width: 32, height: 32, marginRight: 16 }} />
                    <Typography variant="h6" component="div">
                        {isMobile ? 'PODAI' : 'Portal Digital de Atención Integral a Estudiantes De La UTHH'} {/* Cambia el texto si es móvil */}
                    </Typography>
                </Box>
                <IconButton color="inherit" onClick={toggleDarkMode}>
                    {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
                {usuario ? (
                    <IconButton color="inherit" onClick={handleLogoutClick}>
                        <ExitToAppIcon />
                        <Typography variant="button" sx={{ ml: 1 }}>
                            Cerrar Sesión
                        </Typography>
                    </IconButton>
                ) : (
                    <IconButton color="inherit" onClick={handleLoginClick}>
                            <LoginIcon  />
                    </IconButton>
                )}
                <IconButton color="inherit" onClick={handleGoIndex}>
                    <Home  />
                </IconButton>
                <IconButton color="inherit" /*onClick={extendMenu}*/>
                    <MenuIcon  />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
