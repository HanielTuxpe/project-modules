// src/components/Login.js
import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Link } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import banner from '../assets/banner-login.png'
import { useMediaQuery } from '@mui/material';
import { blue } from '@mui/material/colors';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width: 600px)');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username.trim() || !password.trim()) {
            toast.warning('Por favor, complete todos los campos.');
            return;
        }

        try {
            const response = await axios.post('https://prj-server.onrender.com/login', {
                username,
                password,
            });

            if (response.status === 200) {
                toast.success('Inicio de sesión exitoso');
                onLogin(username);
                navigate('/index');
            } else {
                toast.warning(response.data.message);
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                toast.warning(error.response.data.message);
            } else {
                toast.error('Error al iniciar sesión');
            }
        }
    };

    return (
        <Container
            maxWidth= {false}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                color: '#fff',
            }}
        >
            <Box
                maxWidth="md"
                sx={{ 
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.8)',
                    borderRadius: 2,
                    maxWidth: '100%',
                    marginLeft: '0 !important', 
                    marginRight: '0 !important',
                }}
            >
                {/* Banner Izquierdo */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        width: '100%',
                        alignItems: 'center',
                        backgroundColor: '#921F45',
                    }}
                >
                    <img
                        src={banner}
                        alt="Banner PODAI"
                        style={{
                            borderRadius: 10,
                            maxHeight: 'auto'
                        }}
                    />
                </Box>

                {/* Formulario de Inicio de Sesión Derecho */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        background: '#BC955B',
                        height: '50%',
                        width: '50%',
                        padding: 4,
                        borderRadius: '0 8px 8px 0',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Acceder al Sistema
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, color: '#fff', }}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="userType"
                            label="Elige un tipo de usuario"
                            name="userType"
                            select
                            SelectProps={{
                                native: true,
                            }}
                        >
                            <option value="student">Estudiante</option>
                            <option value="teacher">Docente</option>
                        </TextField>
                        <TextField  sx={{ mt: 3, color: '#fff', }}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Usuario"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <TextField  sx={{ mt: 3, color: '#fff', }}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Contraseña"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Acceder
                        </Button>
                        <Typography variant="body2" align="center">
                            <Link href="/forgot-password" sx={{ mr: 1 }}>
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Container>
    );

};

export default Login;
