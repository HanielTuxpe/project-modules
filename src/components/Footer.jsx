import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';  // Importa el componente Link
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
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                textAlign: 'center',
                backgroundColor: '#921F45',
                color: '#fff',
                bottom: 0,       
                left: 0,
                right: 0,
            }}
        >
            <Box 
                sx={{ 
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    justifyContent: 'space-between',
                    gap: 2 
                }}
            >
                <Link href="/privacy-policy" sx={{ color: '#fff', textDecoration: 'none' }}>
                    Política de Privacidad
                </Link>
                <Link href="/terms-conditions" sx={{ color: '#fff', textDecoration: 'none' }}>
                    Términos y Condiciones
                </Link>
                <Link href="/legal-disclaimer" sx={{ color: '#fff', textDecoration: 'none' }}>
                    Deslinde Legal
                </Link>
                <Link href="/about" sx={{ color: '#fff', textDecoration: 'none' }}>
                    Acerca de...
                </Link>
            </Box>
            <Typography variant={isMobile ? 'body2' : 'body1'}>
                Universidad Tecnológica de la Huasteca Hidalguense
            </Typography>
        </Box>
    );
};

export default Footer;
