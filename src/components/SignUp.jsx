import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, IconButton, Checkbox, FormControlLabel, LinearProgress } from '@mui/material';
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
    const [acceptPolicies, setAcceptPolicies] = useState(false); // Estado para el checkbox
    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width: 600px)');

    const passwordStrength = zxcvbn(password);
    const strengthPercent = (passwordStrength.score / 4) * 100; // Convertir la puntuación a porcentaje

    // Función para calcular el progreso de la fortaleza de la contraseña
    const calculatePasswordProgress = () => {
        let progress = 0;

        // Validación de longitud mínima
        if (password.length >= 8) progress += 20;

        // Validación de al menos una letra
        if (/[a-z]/.test(password)) progress += 20;

        // Validación de al menos una letra Mayuscula
        if (/[A-Z]/.test(password)) progress += 20;

        // Validación de al menos un número
        if (/\d/.test(password)) progress += 20;

        // Validación de al menos un carácter especial
        if (/[!@#$%^&*()_+.,;:]/.test(password)) progress += 20;

        return progress;
    };

    const passwordProgress = calculatePasswordProgress();

    const getProgressColor = () => {
        if (passwordProgress === 0) return '#FFFFFF'; // Blanco
        if (passwordProgress === 20) return '#FF0000'; // Rojo
        if (passwordProgress === 40) return '#FFFF00'; // Amarillo
        if (passwordProgress === 60) return '#FFA500'; // Entre amarillo y anaranjado
        if (passwordProgress === 80) return '#FF7F50'; // Anaranjado
        if (passwordProgress === 100) return '#00FF00'; // Verde
        return '#FFFFFF'; // Color por defecto
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username.trim() || !password.trim() || !email.trim() || !confirmPassword.trim()) {
            toast.warning('Por favor, complete todos los campos.');
            return;
        }

        if (!acceptPolicies) {
            toast.warning('Debes aceptar las políticas de privacidad para continuar.');
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
                                    label="Contraseña"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    InputProps={{
                                        endAdornment: (
                                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                            </IconButton>
                                        )
                                    }}
                                />
                                <LinearProgress
                                    variant="determinate"
                                    value={passwordProgress}
                                    sx={{
                                        height: 10,
                                        borderRadius: 5,
                                        mt: 2,
                                        backgroundColor: '#E0E0E0',
                                        '& .MuiLinearProgress-bar': {
                                            backgroundColor: getProgressColor(),
                                        },
                                    }}
                                />
                                <Typography variant="body1" sx={{ mt: 1 }}>
                                    {passwordProgress === 0 && ''}
                                    {passwordProgress === 20 && 'Muy débil'}
                                    {passwordProgress === 40 && 'Débil'}
                                    {passwordProgress === 60 && 'Moderada'}
                                    {passwordProgress === 80 && 'Fuerte'}
                                    {passwordProgress === 100 && 'Contraseña segura'}
                                </Typography>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Confirmar Contraseña"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    InputProps={{
                                        endAdornment: (
                                            <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                                                {showConfirmPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                            </IconButton>
                                        )
                                    }}
                                />

                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={acceptPolicies}
                                            onChange={(e) => setAcceptPolicies(e.target.checked)}
                                        />
                                    }
                                    label={
                                        <Typography variant="body1" >
                                            Acepto las <a href="/privacy-policy">Políticas de Privacidad</a>.
                                        </Typography>
                                    }
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
