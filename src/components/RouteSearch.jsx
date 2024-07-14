import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Button, FormControl, InputLabel, Select, MenuItem, IconButton, Collapse, Grid } from '@mui/material';
import { DirectionsBus, DirectionsCar, ExpandMore, ExpandLess } from '@mui/icons-material';
import axios from 'axios';
import getTheme from '../theme';

const BuscarRuta = () => {
    const [salida, setSalida] = useState('');
    const [destino, setDestino] = useState('');
    const [lugares, setLugares] = useState([]);
    const [rutas, setRutas] = useState([]);
    const [expanded, setExpanded] = useState(null);
    const [boxShadow, setBoxShadow] = useState(null);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('darkMode') === 'true';
        setDarkMode(savedTheme);
    }, []);

    useEffect(() => {
        const theme = getTheme(darkMode);
        setBoxShadow(theme.palette.mode === 'dark' ? theme.palette.shadows.dark : theme.palette.shadows.light);
    }, [darkMode]);


    useEffect(() => {
        const fetchLugares = async () => {
            try {
                const response = await axios.get('https://rutas-huejutla-server.onrender.com/lugares');
                setLugares(response.data);
            } catch (error) {
                console.error('Error obteniendo lugares', error);
            }
        };
        fetchLugares();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://rutas-huejutla-server.onrender.com/buscar', { salida, destino });
            setRutas(response.data);
            console.log(response.data)
        } catch (error) {
            console.error('Error buscando rutas', error);
        }
    };

    const handleExpandClick = (index) => {
        setExpanded(expanded === index ? null : index);
    };

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
                    Buscar Ruta
                </Typography>
                <Box component="form" onSubmit={handleSubmit} 
                    sx={{ 
                        mt: 3, 
                        width: '100%', 
                        display: 'flex', 
                        flexDirection: 'row', 
                        alignItems: 'center' 
                }}>
                    <FormControl fullWidth sx={{ mt: 2, mr: 2, boxShadow: boxShadow, }}>
                        <InputLabel id="salida-label">Ruta de Salida</InputLabel>
                        <Select
                            labelId="salida-label"
                            id="salida"
                            value={salida}
                            label="Ruta de Salida"
                            onChange={(e) => setSalida(e.target.value)}
                        >
                            {lugares.map((lugar, index) => (
                                <MenuItem key={index} value={lugar}>{lugar}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth sx={{ mt: 2, mr: 2, boxShadow: boxShadow, }}>
                        <InputLabel id="destino-label">Ruta de Destino</InputLabel>
                        <Select
                            labelId="destino-label"
                            id="destino"
                            value={destino}
                            label="Ruta de Destino"
                            onChange={(e) => setDestino(e.target.value)}
                        >
                            {lugares.map((lugar, index) => (
                                <MenuItem key={index} value={lugar}>{lugar}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2, width: '20%', height: '20%', boxShadow: boxShadow, }}
                    >
                        Buscar
                    </Button>
                </Box>
                {/*RESULTS BOX */ }
                {rutas.length > 0 && (
                    <Box 
                        sx={{ 
                            mt: 4,
                            width: '100%'
                        }}>
                        <Typography variant="h6">Rutas Encontradas:</Typography>
                        {rutas.map((ruta, index) => (
                            <Box
                                key={index}
                                sx={{
                                    mt: 2,
                                    p: 2,
                                    border: '1px solid #ccc',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    flexDirection: 'column',
                                    boxShadow: boxShadow,
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        width: '100%',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        {ruta.transporte === 'Autobús' ? <DirectionsBus /> : <DirectionsCar />}
                                        <Typography sx={{ ml: 1 }}>
                                            {ruta.transporte} #{ruta.numero}
                                        </Typography>
                                    </Box>
                                    <IconButton onClick={() => handleExpandClick(index)}>
                                        {expanded === index ? <ExpandLess /> : <ExpandMore />}
                                    </IconButton>
                                </Box>
                                <Box
                                    sx={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(3, 1fr)', // Tres columnas de ancho igual
                                        gridTemplateRows: 'repeat(2, auto)', // Dos filas con altura automática
                                        gap: 2, // Espacio entre las celdas
                                        width: '100%',
                                        padding: 2 // Espacio interno de la caja
                                    }}
                                >
                                    <Typography gridColumn="1 / span 1">Salida: {ruta.salida}</Typography>
                                    <Typography gridColumn="2 / span 1">Hora de Salida: {ruta.horaSalida}</Typography>
                                    <Typography gridColumn="3 / span 1">Tiempo de Recorrido: {ruta.tiempoRecorrido} minutos</Typography>
                                    <Typography gridColumn="1 / span 1">Destino: {ruta.destino}</Typography>
                                    <Typography gridColumn="2 / span 1">Hora de Llegada: {ruta.horaLlegada}</Typography>
                                </Box>
                                <Collapse in={expanded === index} timeout="auto" unmountOnExit>
                                    <Typography sx={{ textAlign: 'center', mt: 2, mb: 2 }}>Paradas:</Typography>
                                    <Box
                                        sx={{
                                            gap: 2, 
                                            width: '100%',
                                            padding: 2
                                        }}>
                                        <Grid container spacing={2}>
                                            {ruta.paradas.map((parada, i) => (
                                                <Grid item xs={12} sm={6} key={i}>
                                                    <Typography> ● {parada.nombre} - {parada.hora}</Typography>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Box>
                                </Collapse>
                            </Box>
                        ))}
                    </Box>
                )}
            </Box>
        </Container>
    );
};

export default BuscarRuta;
