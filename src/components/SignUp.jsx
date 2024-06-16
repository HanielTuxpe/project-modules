// src/components/Registro.js
import React, { useState } from 'react';

const Registro = ({ onRegister }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onRegister(username);
    };

    return (
        <div>
            <h2>Registro</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Usuario:</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div>
                    <label>Contraseña:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit">Registrarse</button>
            </form>
        </div>
    );
};

export default Registro;
