import React, { useState, useEffect } from 'react';
import { Container, Box, Typography } from '@mui/material';
import banner from '../assets/banner.png';
import { useMediaQuery } from '@mui/material';
import MenuPincipal from './Admin/menu'; // Importa politicas


const Index = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [visits, setVisits] = useState(0); 
    const [usersConnected, setusersConnected] = useState(0); 
    const isMobile = useMediaQuery('(max-width: 600px)');

    useEffect(() => {
        // Cargar tema guardado en localStorage
        const savedTheme = localStorage.getItem('darkMode') === 'true';
        setDarkMode(savedTheme);

        const storedVisits = parseInt(localStorage.getItem('visits'), 10) || 0;
        const storedUsersConnected = parseInt(localStorage.getItem('usersConnected'), 1) || 0;
        
        const updatedVisits = storedVisits + 1;
        const updatedUsersConnected = (storedVisits - storedVisits + 20) - (storedUsersConnected + 1);
        setVisits(updatedVisits);
        setusersConnected(updatedUsersConnected);
        localStorage.setItem('visits', updatedVisits);
        localStorage.setItem('usersConnected', updatedUsersConnected);
    }, []);

    return (

        <Container
            sx={{
                display: 'flex',
                flexDirection: 'column',
                m: 0,
                width: '100%',
                maxWidth: '100vw', // Para asegurarse que no exceda el ancho de la ventana
            }}
        >
            <MenuPincipal></MenuPincipal>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '100%',
                    height: 'auto',
                }}
            >
                <img
                    src={banner}
                    alt="Banner-PODAI"
                    style={{
                        width: '100%',   // Ancho responsivo al 100% del contenedor padre
                        maxWidth: '100vw', // No exceder el ancho de la ventana
                        height: 'auto',  // Mantiene la proporción de la imagen
                        boxShadow: '4px 10px 20px rgba(0, 0, 0, 0.9)', // Sombra
                        borderRadius: 10,
                    }}
                />
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    gap: isMobile ? 2 : 10,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: isMobile ? '70%' : '30%',
                        height: isMobile ? '20vh' : '30vh',
                        background: '#BC955B',
                        mt: 5,
                        boxShadow: '4px 10px 20px rgba(0, 0, 0, 0.9)', // Sombra
                        borderRadius: 2,
                    }}
                >
                    <Typography
                        sx={{
                            color: '#fff',
                            fontSize: 20,
                            margin: 2,
                            textAlign: 'center'
                        }}
                    >
                        Visitas totales desde su activación
                    </Typography>
                    <Typography
                        sx={{
                            color: '#fff',
                            fontSize: 50, // Tamaño grande para resaltar la cantidad
                        }}
                    >
                        {visits}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: isMobile ? '70%' : '30%',
                        height: isMobile ? '20vh' : '30vh',
                        background: '#BC955B',
                        mt: 5,
                        boxShadow: '4px 10px 20px rgba(0, 0, 0, 0.9)', // Sombra
                        borderRadius: 2,
                    }}
                >
                    <Typography
                        sx={{
                            color: '#fff',
                            fontSize: 20,
                            margin: 2,
                            textAlign: 'center'
                        }}
                    >
                        Usuarios Conectados
                    </Typography>
                    <Typography
                        sx={{
                            color: '#fff',
                            fontSize: 50,
                        }}
                    >
                        {usersConnected}
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
};

export default Index;
