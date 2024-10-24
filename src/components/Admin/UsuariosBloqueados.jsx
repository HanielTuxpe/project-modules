import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';

const BlockedUsers = () => {
    const [usuariosBloqueados, setUsuariosBloqueados] = useState([]);

    useEffect(() => {
        // Función para obtener los datos de los usuarios bloqueados
        const fetchBlockedUsers = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/usuarios`); // Asegúrate de que tu API esté configurada
                const blockedUsersData = response.data;

                console.log(blockedUsersData);
                // Asignar los datos recibidos a los estados
                setUsuariosBloqueados(blockedUsersData);
            } catch (error) {
                console.error('Error al obtener los datos de usuarios bloqueados:', error);
            }
        };

        fetchBlockedUsers();
    }, []);

    // Haz que la función sea asincrónica
    const resetIncidencias = async (usuarioId) => {
        try {
            const response = await fetch(`http://localhost:3001/usuarios/${usuarioId}/reset-intentos`, {
                method: 'PATCH', // Método de la solicitud
                headers: {
                    'Content-Type': 'application/json', // Especifica el tipo de contenido
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`); // Manejo de errores si la respuesta no es exitosa
            }

            const data = await response.json(); // Parsear la respuesta como JSON
            console.log('Usuario actualizado:', data);
            // Aquí puedes actualizar el estado si es necesario
        } catch (error) {
            console.error('Error al actualizar el usuario:', error);
        }
    };

    return (
        <>
            <Box>
                <Typography variant="h5" color="primary" gutterBottom>
                    Usuarios Bloqueados
                </Typography>
            </Box>

            <Box>
                {usuariosBloqueados.map((usuario) => (
                    <Card key={usuario._id} sx={{ marginBottom: 2 }}>
                        <CardContent sx={{ backgroundColor: '#E1EDFF', borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="h5" component="div" gutterBottom sx={{ color: 'black' }}>
                                        Usuario: {usuario._doc.username} {/* Acceso a username */}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'black' }}>
                                        Número de incidencias: {usuario._doc.intentosVerificacion} {/* Acceso a intentosVerificacion */}
                                    </Typography>
                                </Box>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="h5" component="div" gutterBottom sx={{ color: 'black' }}>
                                        Correo Electronico: {usuario._doc.email}
                                    </Typography>
                                </Box>
                                <Button variant="contained" color="primary" onClick={() => resetIncidencias(usuario._id)}>
                                    Resetear Contador
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </>
    );
};

export default BlockedUsers;