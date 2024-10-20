// src/components/Login.js
import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Link, IconButton } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import banner from '../assets/banner-login.png';
import { useMediaQuery } from '@mui/material';
import ReCAPTCHA from 'react-google-recaptcha';
import { iniciarSesion } from './SessionService'; // Importa el servicio de sesión
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('Student');
    const [recaptchaToken, setRecaptchaToken] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width: 600px)');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username.trim() || !password.trim()) {
            toast.warning('Por favor, complete todos los campos.');
            return;
        }

        if (!recaptchaToken) {
            toast.warning('La validación de reCAPTCHA es necesaria.');
            return;
        }

        try {
            // Validar reCAPTCHA
            await axios.post('https://prj-server.onrender.com/validate-recaptcha', {
                recaptchaToken,
            });

            // Si el reCAPTCHA es exitoso, proceder a validar las credenciales de usuario
            const loginResponse = await axios.post('https://prj-server.onrender.com/login', {
                username,
                password,
                type: userType,
            });

            if (loginResponse.status === 200) {
                toast.success(loginResponse.data.message);
                // Llama a la función iniciarSesion para establecer la cookie
                iniciarSesion(userType); // Aquí se establece la cookie
                onLogin(username);
                navigate('/index');
                setRecaptchaToken(null);
            }
        } catch (error) {
            if (error.response) {
                const errorMessage = error.response.data.message || 'Error en el proceso de inicio de sesión.';
                toast.warning(errorMessage);
            } else {
                toast.error('Error en el proceso de inicio de sesión.');
            }
        }
    };

    // Callback para cuando reCAPTCHA es exitoso
    const onRecaptchaChange = (token) => {
        setRecaptchaToken(token);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
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
                        alt="Banner PODAI"
                        style={{
                            borderRadius: 10,
                            maxHeight: 'auto',
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
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, color: '#fff' }}>
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
                            value={userType} // Actualizamos el valor del estado
                            onChange={(e) => setUserType(e.target.value)} // Control del estado
                        >
                            <option value="Student">Estudiante</option>
                            <option value="Admin">Admin</option>
                        </TextField>
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
                        <Box sx={{ position: 'relative' }}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Contraseña"
                                type={showPassword ? 'text' : 'password'} // Cambia el tipo según el estado
                                id="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <IconButton
                                color="inherit"
                                onClick={togglePasswordVisibility} // Pasar la función como referencia
                                sx={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}
                            >
                                {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                            </IconButton>
                        </Box>
                        <ReCAPTCHA
                            sitekey="6Le3YWUqAAAAAAsmFo9W0iT84R3qyVKtLuPJ9hhr"
                            onChange={onRecaptchaChange} // Callback para actualizar el token
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
                            <Link href="/forgot-password" sx={{ mr: 1, fontSize: 18, color: '#fff' }}>
                                ¿Olvidaste tu contraseña?
                            </Link>
                            O &nbsp;
                            <Link href="/SignUp" sx={{ mr: 1, fontSize: 18, color: '#fff' }}>
                                Regístrate
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default Login;
