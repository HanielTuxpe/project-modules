import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [codigo, setCodigo] = useState('');
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [isEmailSent, setIsEmailSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            toast.warning('Por favor, ingrese su correo electrónico.');
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            toast.warning('Por favor, ingresa un correo electrónico válido.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3001/forgot-password', {
                email,
            });

            if (response.status === 200) {
                setNombreUsuario(response.data.username);
                setIsEmailSent(true);
                toast.success('Código de recuperación enviado. Por favor, revise su bandeja de entrada.');
            } else {
                toast.warning(response.data.message);
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                toast.warning(error.response.data.message);
            } else {
                toast.error('Error al enviar el correo de recuperación');
            }
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        // Lógica para verificar el código aquí
        toast.success('Código verificado correctamente.');
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
                    Recuperar Contraseña
                </Typography>
                {!isEmailSent ? (
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            id="email"
                            label="Correo Electrónico"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Enviar Correo de Recuperación
                        </Button>
                    </Box>
                ) : (
                    <Box component="form" onSubmit={handleVerify} sx={{ mt: 3 }}>
                        <Typography component="p" variant="body1">
                            Usuario vinculado: {nombreUsuario}
                        </Typography>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            id="codigo"
                            label="Código de Verificación"
                            name="codigo"
                            autoComplete="one-time-code"
                            autoFocus
                            value={codigo}
                            onChange={(e) => setCodigo(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Verificar Código
                        </Button>
                    </Box>
                )}
            </Box>
        </Container>
    );
};

export default ForgotPassword;
