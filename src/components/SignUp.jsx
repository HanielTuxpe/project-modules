import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Registro = ({ onRegister }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación de campos vacíos
        if (!username.trim() || !password.trim() || !email.trim()) {
            toast.warning('Por favor, complete todos los campos.');
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            toast.warning('Por favor, ingresa un correo electrónico válido.');
            return;
        }

        try {
            const response = await axios.post('https://rutas-huejutla-server.onrender.com/register', {
                username,
                password,
                email
            });

            if (response.status === 201) {
                toast.success(response.data.message);
                onRegister(username);
                navigate('/mis-rutas');
            } else if (response.status === 400) {
                toast.warning(response.data.message);
            } else {
                toast.warning('Hubo un problema al registrar el usuario');
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                toast.warning(error.response.data.message);
            } else {
                toast.error('Error al registrar usuario');
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
                    mt: 2,
                }}
            >
                <Typography component="h1" variant="h5">
                    Registro
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
                        id="email"
                        label="Correo Electrónico"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                        Registrarse
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default Registro;
