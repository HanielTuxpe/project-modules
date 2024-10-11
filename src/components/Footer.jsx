import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useMediaQuery } from '@mui/material';

const Footer = () => {
    const isMobile = useMediaQuery('(max-width: 600px)'); // Detecta si es un dispositivo móvil

    return (
        <Box
            component="footer"
            sx={{
                py: 3,
                px: 2,
                mt: 'auto',
                textAlign: 'center',
                backgroundColor: (theme) =>
                    theme.palette.mode === 'light' ? theme.palette.grey[400] : theme.palette.grey[900],
                position: 'fixed', // Fijo en la parte inferior
                left: 0,
                right: 0,
                bottom: 0, // Asegura que esté en la parte inferior
            }}
        >
            <Typography variant={isMobile ? 'body2' : 'body1'}> {/* Cambia el tamaño del texto según el dispositivo */}
                Universidad Tecnológica de la Huasteca Hidalguense
            </Typography>
        </Box>
    );
};

export default Footer;
