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
        cerrarSesion();
        setUsuario(null);
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        localStorage.setItem('darkMode', !darkMode);
    };

    const theme = getTheme(darkMode);

    // Componente para Layout Base con dependencias
    const Layout = ({ children }) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header
                usuario={usuario} // Depende del estado de usuario
                onLogout={handleLogout}
                toggleDarkMode={toggleDarkMode}
                darkMode={darkMode}
            />
            <Container component="main" sx={{ mt: 2, mb: 2, flexGrow: 1 }}>
                {children}
            </Container>
            <Footer />
        </Box>
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Layout key={usuario ? 'authenticated' : 'guest'}>
                    <Routes>
                        {/* Rutas Públicas */}
                        <Route path="/" element={usuario ? <Navigate to="/index" /> : <Index />} />
                        <Route path="/SignUp" element={usuario ? <Navigate to="/index" /> : <Registro />} />
                        <Route path="/login" element={usuario ? <Navigate to="/index" /> : <Login />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />

                        {/* Rutas Privadas */}
                        <Route path="/index" element={usuario ? <BuscarRuta /> : <Navigate to="/" />} />
                        <Route path="/Crud" element={usuario ? <Crud darkMode={darkMode} /> : <Navigate to="/" />} />
                        <Route path="/Usuarios" element={usuario ? <Usuarios darkMode={darkMode} /> : <Navigate to="/" />} />

                        {/* Páginas informativas públicas */}
                        <Route
                            path="/privacy-policy"
                            element={<PoliticasDePrivacidadPublico darkMode={darkMode} />}
                        />
                        <Route
                            path="/terms-conditions"
                            element={<TerminosYCondicionesPublico darkMode={darkMode} />}
                        />
                        <Route
                            path="/legal-disclaimer"
                            element={<DeslindeLegalPublico darkMode={darkMode} />}
                        />
                        <Route
                            path="/about"
                            element={<AcercaDePublico darkMode={darkMode} />}
                        />
                    </Routes>
                </Layout>
                <ToastContainer />
            </Router>
        </ThemeProvider>
    );
};

export default App;
