import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, useMediaQuery } from '@mui/material';
import Menu from './menu'; // Importamos el nuevo menú lateral

const BuscarRuta = () => {
    const [darkMode, setDarkMode] = useState(false); // Mueve useState dentro del componente

    const user = localStorage.getItem('usuario');

    useEffect(() => {
        const savedTheme = localStorage.getItem('darkMode') === 'true';
        setDarkMode(savedTheme);
    }, []);

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
                <Menu />
                <Typography component="h1" variant="h5">
                    BIENVENIDO {user}
                </Typography>
            </Box>
        </Container>
    );
};

export default BuscarRuta;
