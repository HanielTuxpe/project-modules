import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';

const BuscarRuta = () => {
    const [salida, setSalida] = useState('');
    const [destino, setDestino] = useState('');
    const [lugares, setLugares] = useState([]);
    const [rutas, setRutas] = useState([]);

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
        } catch (error) {
            console.error('Error buscando rutas', error);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mt: 8,
                }}
            >
                <Typography component="h1" variant="h5">
                    Buscar Ruta
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
                    <FormControl fullWidth sx={{ mt: 2 }}>
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
                    <FormControl fullWidth sx={{ mt: 2 }}>
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
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Buscar
                    </Button>
                </Box>
                {rutas.length > 0 && (
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h6">Rutas Encontradas:</Typography>
                        {rutas.map((ruta, index) => (
                            <Box key={index} sx={{ mt: 2, p: 2, border: '1px solid #ccc', borderRadius: '8px' }}>
                                <Typography>Transporte: {ruta.transporte}</Typography>
                                <Typography>Salida: {ruta.salida}</Typography>
                                <Typography>Destino: {ruta.destino}</Typography>
                                <Typography>Hora de Salida: {ruta.horaSalida}</Typography>
                                <Typography>Hora de Llegada: {ruta.horaLlegada}</Typography>
                                <Typography>Tiempo de Recorrido: {ruta.tiempoRecorrido} minutos</Typography>
                                <Typography>Paradas:</Typography>
                                <ul>
                                    {ruta.paradas.map((parada, i) => (
                                        <li key={i}>{parada.nombre} - {parada.hora}</li>
                                    ))}
                                </ul>
                            </Box>
                        ))}
                    </Box>
                )}
            </Box>
        </Container>
    );
};

export default BuscarRuta;
