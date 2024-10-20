import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, Box, Container } from '@mui/material';

import Registro from './components/SignUp';
import Login from './components/LogIn';
import Crud from './components/Admin/Crud';
import BuscarRuta from './components/Index';
import ForgotPassword from './components/ForgotPassword';
import Header from './components/Header';
import Footer from './components/Footer';
import Index from './components/Index';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import getTheme from './theme';

const App = () => {
    const [usuario, setUsuario] = useState(null);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const savedUser = localStorage.getItem('usuario');
        const savedTheme = localStorage.getItem('darkMode') === 'true';
        if (savedUser) {
            setUsuario(savedUser);
        }
        setDarkMode(savedTheme);
    }, []);

    const handleRegister = (username) => {
        setUsuario(username);
        localStorage.setItem('usuario', username);
    };

    const handleLogin = (username) => {
        setUsuario(username);
        localStorage.setItem('usuario', username);
    };

    const handleLogout = () => {
        setUsuario(null);
        localStorage.removeItem('usuario');
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
                                element={usuario ? <Navigate to="/index" /> : <Registro onRegister={handleRegister} />}
                            />
                            <Route
                                path="/login"
                                element={usuario ? <Navigate to="/index" /> : <Login onLogin={handleLogin} />}
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
