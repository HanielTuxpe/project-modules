import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import { Box, Button, IconButton } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useNavigate } from 'react-router-dom';

const Header = ({ usuario, onLogout }) => {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleLogoutClick = () => {
        onLogout();
        navigate('/');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                    <DirectionsBusIcon sx={{ mr: 2 }} />
                    <Typography variant="h6" component="div">
                        Tus Rutas Huejutla
                    </Typography>
                </Box>
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
