// src/components/Login.js
import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Link } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import banner from '../assets/banner-login.png'
import { useMediaQuery } from '@mui/material';
import { blue } from '@mui/material/colors';
<<<<<<< Updated upstream
import ReCAPTCHA from 'react-google-recaptcha';
=======
import ReCAPTCHA from 'react-google-recaptcha'
import{.eve}
>>>>>>> Stashed changes

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [recaptchaToken, setRecaptchaToken] = useState(null); // Captura del token
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

        // Validar reCAPTCHA
        try {
            const recaptchaResponse = await axios.post('https://prj-server.onrender.com/validate-recaptcha', {
                recaptchaToken
            });

            // Si el reCAPTCHA es exitoso, proceder a validar las credenciales de usuario
            const loginResponse = await axios.post('https://prj-server.onrender.com/login', {
                username,
                password
            });

            if (loginResponse.status === 200) {
                toast.success('Inicio de sesión exitoso');
                onLogin(username);
                navigate('/index');
            } else {
                toast.warning(loginResponse.data.message);
            }

        } catch (error) {
            toast.error('Error en el proceso de inicio de sesión.');
        }
    };

    // Callback para cuando reCAPTCHA es exitoso
    const onRecaptchaChange = (token) => {
        console.log("Token reCAPTCHA:", token);
        setRecaptchaToken(token);
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
<<<<<<< Updated upstream
                         <ReCAPTCHA
                            sitekey={"6Le3YWUqAAAAAAsmFo9W0iT84R3qyVKtLuPJ9hhr"}
                            onChange={onRecaptchaChange} // Callback para actualizar el token
                        />
=======

>>>>>>> Stashed changes
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Acceder
                        </Button>
<<<<<<< Updated upstream
                       
=======
                        <ReCAPTCHA sitekey={env.REACT_APP_SITE_KEY} />
>>>>>>> Stashed changes
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
