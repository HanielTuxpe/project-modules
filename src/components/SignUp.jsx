import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import banner from '../assets/banner-login.png'; // Reemplaza con la imagen correcta del registro
import { useMediaQuery } from '@mui/material';
import zxcvbn from 'zxcvbn';

const Registro = ({ onRegister }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // Nuevo estado para confirmar contraseña
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);
    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width: 600px)');

    const passwordStrength = zxcvbn(password);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username.trim() || !password.trim() || !email.trim() || !confirmPassword.trim()) {
            toast.warning('Por favor, complete todos los campos.');
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            toast.warning('Por favor, ingresa un correo electrónico válido.');
            return;
        }

        // Patrón de contraseña: mínimo 8 caracteres, al menos una letra y un número
        const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordPattern.test(password)) {
            toast.warning('La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y caracteres especiales (.!@#$%^&*()_+).');
            return;
        }

        if (password !== confirmPassword) {
            toast.warning('Las contraseñas no coinciden.');
            return;
        }

        try {
            const response = await axios.post('https://prj-server.onrender.com/register', {
                username,
                password,
                email
            });

            if (response.status === 201) {
                toast.success(response.data.message);
                setIsRegistered(true);
                onRegister(username);
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
            console.log(error);
        }
    };

    const handleVerification = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('https://prj-server.onrender.com/verify', {
                username,
                code: verificationCode
            });

            if (response.status === 200) {
                toast.success('Código verificado correctamente');
                navigate('/dashboard');
            } else {
                toast.warning('Código incorrecto');
            }
        } catch (error) {
            toast.error('Error al verificar el código');
            console.log(error);
        }
    };

    return (
        <Container
            maxWidth={false}
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
                        alt="Banner Registro"
                        style={{
                            borderRadius: 10,
                            maxHeight: 'auto'
                        }}
                    />
                </Box>

                {/* Formulario de Registro Derecho */}
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
                        {isRegistered ? 'Verificación de Código' : 'Registro'}
                    </Typography>
                    <Box component="form" onSubmit={isRegistered ? handleVerification : handleSubmit} sx={{ mt: 3 }}>
                        {!isRegistered ? (
                            <>
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
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="confirmPassword"
                                    label="Confirmar Contraseña"
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <Typography variant="body2" color="text.secondary">
                                    {passwordStrength.score === 0 && 'Muy débil'}
                                    {passwordStrength.score === 1 && 'Débil'}
                                    {passwordStrength.score === 2 && 'Moderada'}
                                    {passwordStrength.score === 3 && 'Fuerte'}
                                    {passwordStrength.score === 4 && 'Muy fuerte'}
                                </Typography>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Registrarse
                                </Button>
                            </>
                        ) : (
                            <>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="verificationCode"
                                    label="Código de Verificación"
                                    name="verificationCode"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
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
                            </>
                        )}
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default Registro;
