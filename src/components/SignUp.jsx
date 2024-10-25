import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, IconButton } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import banner from '../assets/banner-login.png'; // Reemplaza con la imagen correcta del registro
import { useMediaQuery } from '@mui/material';
import zxcvbn from 'zxcvbn';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const Registro = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // Nuevo estado para confirmar contraseña
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseña
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Estado para mostrar/ocultar confirmación de contraseña
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
        const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+.,;:])[A-Za-z\d!@#$%^&*()_+.,;:]{8,}$/;
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
                email,
                type: 'Student'
            });

            if (response.status === 200) {
                toast.success(response.data.message);
                setIsRegistered(true);
            } else if (response.status === 400) {
                toast.warning(response.data.message);
            }
        } catch (error) {
            if (error.response) {
                toast.warning(error.response.data.message);
            } else {
                toast.error('Error al registrar usuario');
            }
        }
    };

    const handleVerification = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('https://prj-server.onrender.com/verify', {
                username,
                code: Number(verificationCode)
            });

            if (response.status === 200) {
                toast.success(response.data.message);
                navigate('/login');
            } else if (response.status === 400) {
                toast.warning(response.data.message);
            }
        } catch (error) {
            if (error.response) {
                toast.warning(error.response.data.message);
            }
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
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
                    maxWidth: isMobile ? 'auto' : '100%',
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
                        width: isMobile ? '100%' : '90%', // Ajustar para móvil
                        alignItems: 'center',
                        backgroundColor: '#921F45',
                    }}
                >
                    <img
                        src={banner}
                        alt="Banner Registro"
                        style={{
                            borderRadius: 10,
                            width: '100%', // Ajustar imagen al ancho disponible
                            height: 'auto', // Ajustar la altura en móviles
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
                        width: isMobile ? '100%' : '50%', // Ajustar para móvil
                        padding: isMobile ? 2 : 4,
                        borderRadius: '0 8px 8px 0',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        {isRegistered ? 'Verificación de Código' : 'Registro'}
                    </Typography>
                    <Box component="form" onSubmit={isRegistered ? handleVerification : handleSubmit} sx={{ mt: 3, }}>
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
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    InputProps={{
                                        endAdornment: (
                                            <IconButton onClick={togglePasswordVisibility} edge="end">
                                                {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                            </IconButton>
                                        )
                                    }}
                                />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="confirmPassword"
                                    label="Confirmar Contraseña"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    InputProps={{
                                        endAdornment: (
                                            <IconButton onClick={toggleConfirmPasswordVisibility} edge="end">
                                                {showConfirmPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                            </IconButton>
                                        )
                                    }}
                                />
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontSize: 18,
                                        color: 
                                            passwordStrength.score === 0 ? 'red' :
                                            passwordStrength.score === 1 ? 'orange' :
                                            passwordStrength.score === 2 ? 'yellow' :
                                            passwordStrength.score === 3 ? 'green' :
                                            passwordStrength.score === 4 ? 'darkgreen' :
                                            'text.secondary'
                                    }}
                                >
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
