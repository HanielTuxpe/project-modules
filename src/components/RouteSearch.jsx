import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, /*Button, FormControl, InputLabel, Select, MenuItem, IconButton, Collapse, Grid */} from '@mui/material';
/*import { DirectionsBus, DirectionsCar, ExpandMore, ExpandLess } from '@mui/icons-material';
import axios from 'axios';
import getTheme from '../theme';*/

const BuscarRuta = () => {
    const [darkMode, setDarkMode] = useState(false);

    const user = localStorage.getItem('usuario');

    console.log(user)

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
            }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mt: 8,
                    width: '100%',
                }}
            >
                <Typography component="h1" variant="h5">
                    BIENVENIDO {user}
                </Typography>
            </Box>
        </Container>
    );
};

export default BuscarRuta;
