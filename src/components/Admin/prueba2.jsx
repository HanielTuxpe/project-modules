import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, Box, Container } from '@mui/material';

import Registro from './components/SignUp';
import Login from './components/LogIn';
import Crud from './components/Admin/Crud';
import Usuarios from './components/Admin/UsuariosBloqueados';
import BuscarRuta from './components/Index';
import ForgotPassword from './components/ForgotPassword';
import Header from './components/Header';
import Footer from './components/Footer';
import Index from './components/Index';
import { obtenerTipoUsuario, cerrarSesion } from './components/SessionService';
import PoliticasDePrivacidadPublico from './components/Crud/PoliticasDePrivacidadPublico';
import TerminosYCondicionesPublico from './components/Crud/TerminosYCondicionesPublico';
import DeslindeLegalPublico from './components/Crud/DeslindeLegalPublico';
import AcercaDePublico from './components/Crud/AcercaDePublico';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import getTheme from './theme';

const App = () => {
    const [usuario, setUsuario] = useState(null);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const savedUser = obtenerTipoUsuario();
        const savedTheme = localStorage.getItem('darkMode') === 'true';
        if (savedUser) {
            setUsuario(savedUser);
        }
        setDarkMode(savedTheme);
    }, []);

    const handleLogout = () => {
        cerrarSesion()
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        localStorage.setItem('darkMode', !darkMode);
    };

    const theme = getTheme(darkMode);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                    <Header usuario={usuario} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} darkMode={darkMode} />

                    <Container component="main" sx={{ mt: 2, mb: 2 }}>
                        <Routes>
                            <Route
                                path="/"
                                element={usuario ? <Navigate to="/index" /> : <Index />}
                            />
                            <Route
                                path="/SignUp"
                                element={usuario ? <Navigate to="/index" /> : <Registro />}
                            />
                            <Route
                                path="/login"
                                element={usuario ? <Navigate to="/index" /> : <Login />}
                            />

                            <Route
                                path="/forgot-password"
                                element={<ForgotPassword />}
                            />
                            <Route
                                path="/index"
                                element={usuario ? <BuscarRuta /> : <Navigate to="/" />}
                            />
                            <Route
                                path="/Crud"
                                element={usuario ? <Crud darkMode={darkMode} /> : <Navigate to="/" />}
                            />
                            <Route
                                path="/Usuarios"
                                element={usuario ? <Usuarios darkMode={darkMode} /> : <Navigate to="/" />}
                            />
                            <Route
                                path="/privacy-policy"
                                element={usuario ? <PoliticasDePrivacidadPublico darkMode={darkMode} /> : <PoliticasDePrivacidadPublico darkMode={darkMode} />}
                            />
                            <Route
                                path="/terms-conditions"
                                element={usuario ? <TerminosYCondicionesPublico darkMode={darkMode} /> : <TerminosYCondicionesPublico darkMode={darkMode} />}
                            />
                            <Route
                                path="/legal-disclaimer"
                                element={usuario ? <DeslindeLegalPublico darkMode={darkMode} /> : <DeslindeLegalPublico darkMode={darkMode} />}
                            />
                            <Route
                                path="/about"
                                element={usuario ? <AcercaDePublico darkMode={darkMode} /> : <AcercaDePublico darkMode={darkMode} />}
                            />



                        </Routes>
                    </Container>

                    <Footer />
                    <ToastContainer />
                </Box>
            </Router>
        </ThemeProvider>
    );
};

export default App;
