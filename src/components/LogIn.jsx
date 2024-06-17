// src/components/Login.js
import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Link } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username.trim() || !password.trim()) {
            toast.warning('Por favor, complete todos los campos.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3001/login', {
                username,
                password,
            });

            if (response.status === 200) {
                toast.success('Inicio de sesión exitoso');
                onLogin(username);
                navigate('/mis-rutas');
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
                    Iniciar Sesión
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <TextField
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
                    <TextField
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
                        Iniciar Sesión
                    </Button>
                    <Typography variant="body2">
                        <Link href="/forgot-password" sx={{ mr: 1 }}>
                            ¿Olvidaste tu contraseña?
                        </Link>
                        o
                        <Link href="/" sx={{ ml: 1 }}>
                            Regístrate
                        </Link>
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
};

export default Login;
