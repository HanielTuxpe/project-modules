// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Registro from './components/SignUp';
import Login from './components/LogIn';
import BuscarRuta from './components/RouteSearch';
import ForgotPassword from './components/ForgotPassword'; // Importa el nuevo componente
import Header from './components/Header';
import Footer from './components/Footer';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const App = () => {
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        const savedUser = localStorage.getItem('usuario');
        if (savedUser) {
            setUsuario(savedUser);
        }
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

    return (
        <Router>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Header usuario={usuario} onLogout={handleLogout} />
                <Container component="main" sx={{ mt: 8, mb: 2 }}>
                    <Routes>
                        <Route
                            path="/"
                            element={usuario ? <Navigate to="/mis-rutas" /> : <Registro onRegister={handleRegister} />}
                        />
                        <Route
                            path="/login"
                            element={usuario ? <Navigate to="/mis-rutas" /> : <Login onLogin={handleLogin} />}
                        />
                        <Route
                            path="/forgot-password"
                            element={<ForgotPassword />} // Nueva ruta para recuperar contraseña
                        />
                        <Route
                            path="/mis-rutas"
                            element={usuario ? <BuscarRuta /> : <Navigate to="/" />}
                        />
                    </Routes>
                </Container>
                <Footer />
                <ToastContainer />
            </Box>
        </Router>
    );
};

export default App;
