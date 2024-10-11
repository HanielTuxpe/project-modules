import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import { Box, Button, IconButton } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/uthh.png';
import useMediaQuery from '@mui/material/useMediaQuery';

const Header = ({ usuario, onLogout, toggleDarkMode, darkMode }) => {
    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width: 600px)'); // Detecta si es un dispositivo móvil

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleLogoutClick = () => {
        onLogout();
        navigate('/');
    };

    return (
        <AppBar position="static"
            sx={{
                mb: 2,
                backgroundColor: '#923',
                color: '#fff',
            }}
        >
            <Toolbar>
                <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                    <img src={logo} alt="My Icon" style={{ width: 32, height: 32, marginRight: 16 }} />
                    <Typography variant="h6" component="div">
                        {isMobile ? 'PODAI' : 'PORTAL DIGITAL DE ATENCIÓN INTEGRAL A ESTUDIANTES DE LA UTHH'} {/* Cambia el texto si es móvil */}
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
                    <Button color="inherit" onClick={handleLoginClick}>
                        Iniciar Sesión
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Header;
