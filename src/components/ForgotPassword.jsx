import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [codigo, setCodigo] = useState('');
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [isCodeVerified, setIsCodeVerified] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [token, setToken] = useState('');
    const navigate = useNavigate();

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
            const response = await axios.post('https://rutas-huejutla-server.onrender.com/forgot-password', {
                email,
            });

            if (response.status === 200) {
                setNombreUsuario(response.data.username);
                setIsEmailSent(true);
                toast.success('Código de recuperación enviado. Por favor, revise su bandeja de entrada.');
            } else if (response.status === 400) {
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

        try {
            const response = await axios.post('https://rutas-huejutla-server.onrender.com/verify-code', {
                code: codigo,
            });

            if (response.status === 200) {
                setIsCodeVerified(true);
                toast.success('Código verificado correctamente.');
                setToken(response.data.token);
            } else {
                toast.warning(response.data.message);
            }
        } catch (error) {
            toast.error('Error al verificar el código.');
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (!newPassword.trim()) {
            toast.warning('Por favor, ingrese su nueva contraseña.');
            return;
        }

        try {
            console.log(token)
            const response = await axios.post('https://rutas-huejutla-server.onrender.com/reset-password', {
                token: token,
                newPassword,
            });

            if (response.status === 200) {
                toast.success('Contraseña restablecida correctamente.');
                navigate('/login');
            } else {
                toast.warning(response.data);
            }
        } catch (error) {
            toast.error('Error al restablecer la contraseña.');
            console.log(error)
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
                ) : !isCodeVerified ? (
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
                ) : (
                    <Box component="form" onSubmit={handleResetPassword} sx={{ mt: 3 }}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            id="newPassword"
                            label="Nueva Contraseña"
                            type="password"
                            name="newPassword"
                            autoComplete="new-password"
                            autoFocus
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Restablecer Contraseña
                        </Button>
                    </Box>
                )}
            </Box>
        </Container>
    );
};

export default ForgotPassword;
