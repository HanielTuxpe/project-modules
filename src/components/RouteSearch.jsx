// src/components/BuscarRuta.js
import React, { useState } from 'react';

const BuscarRuta = ({ onBuscar }) => {
    const [direccion, setDireccion] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onBuscar(direccion);
    };

    return (
        <div>
            <h2>Buscar Ruta</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Dirección:</label>
                    <input type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} required />
                </div>
                <button type="submit">Buscar</button>
            </form>
        </div>
    );
};

export default BuscarRuta;
