// src/App.js
import React, { useState } from 'react';
import Registro from './components/SignUp';
import BuscarRuta from './components/RouteSearch';
import Ruta from './components/Route';
import './App.css';

const App = () => {
    const [usuario, setUsuario] = useState(null);
    const [rutas, setRutas] = useState([]);

    const handleRegister = (username) => {
        setUsuario(username);
    };

    const handleBuscar = (direccion) => {
        // Simulando la búsqueda de rutas
        const rutasDisponibles = [
            { direccion: 'Centro', ruta: 'Ruta 1, Ruta 2' },
            { direccion: 'Mercado', ruta: 'Ruta 3, Ruta 4' },
            // Añadir más rutas simuladas según sea necesario
        ];

        const rutasEncontradas = rutasDisponibles
            .filter(r => r.direccion.toLowerCase().includes(direccion.toLowerCase()))
            .map(r => r.ruta);

        setRutas(rutasEncontradas);
    };

    return (
        <div className="App">
            {!usuario ? (
                <Registro onRegister={handleRegister} />
            ) : (
                <div>
                    <h1>Bienvenido, {usuario}</h1>
                    <BuscarRuta onBuscar={handleBuscar} />
                    {rutas.length > 0 ? (
                        rutas.map((ruta, index) => <Ruta key={index} ruta={ruta} />)
                    ) : (
                        <p>No se encontraron rutas</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default App;
