import React, { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, Typography, TextField, MenuItem, Grid } from '@mui/material';
import { toast } from 'react-toastify';
import { useTheme } from '@mui/material/styles';

const BlockedUsers = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [filter, setFilter] = useState('all'); // Filtro: all, blocked, unblocked
    const [config, setConfig] = useState(null); // Inicializar como null
    const theme = useTheme(); // Obtén el tema global

    // Obtener configuración global
    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const response = await fetch('https://prj-server.onrender.com/GlobalConfiguracionUser');
                if (!response.ok) {
                    throw new Error('Error al obtener la configuración global');
                }
                const data = await response.json();
                setConfig(data);
            } catch (error) {
                toast.error('Error al obtener la configuración global');
                //console.error(error);
            }
        };

        fetchConfig();
    }, []);

    // Obtener lista de usuarios
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('https://prj-server.onrender.com/usuarios');
                if (!response.ok) {
                    throw new Error('Error al obtener los datos de usuarios');
                }
                const data = await response.json();
                setUsuarios(data);
            } catch (error) {
                toast.error('Error al obtener los datos de usuarios');
                //console.error(error);
            }
        };

        fetchUsers();
    }, []);

    // Guardar la configuración actualizada
    const saveConfig = async () => {
        try {
            const response = await fetch('https://prj-server.onrender.com/GlobalConfiguracionUser', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(config),
            });
            if (!response.ok) {
                throw new Error('Error al guardar la configuración');
            }
            toast.success('Configuración guardada con éxito');
        } catch (error) {
            toast.error('Error al guardar la configuración');
            //console.error(error);
        }
    };

    // Desbloquear usuario manualmente
    const desbloquearUsuario = async (usuarioId) => {
        try {
            const response = await fetch(`https://prj-server.onrender.com/usuarios/${usuarioId}/desbloquear`, {
                method: 'PATCH',
            });
            if (!response.ok) {
                throw new Error('Error al desbloquear el usuario');
            }
            toast.success('Usuario desbloqueado');
            setUsuarios((prevUsuarios) =>
                prevUsuarios.map((usuario) =>
                    usuario._id === usuarioId ? { ...usuario, bloqueado: false, intentosFallidos: 0 } : usuario
                )
            );
        } catch (error) {
            toast.error('Error al desbloquear el usuario');
            //console.error(error);
        }
    };

    // Bloquear usuario manualmente
    const bloquearUsuario = async (usuarioId) => {
        try {
            const response = await fetch(`https://prj-server.onrender.com/UsuarioBloqueado/${usuarioId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.mensaje || 'Error al bloquear el usuario');
            }
    
            toast.success('usuario Bloqueado');
    
            // Actualizar el estado local
            setUsuarios((prevUsuarios) =>
                prevUsuarios.map((usuario) =>
                    usuario._id === usuarioId ? { ...usuario, bloqueado: true } : usuario
                )
            );
        } catch (error) {
            toast.error(`Error al bloquear el usuario`);
            //console.error('Detalles del error:', error);
        }
    };

    // Filtrar usuarios
    const handleFilterChange = (e) => setFilter(e.target.value);

    const filteredUsers = usuarios.filter((usuario) => {
        if (filter === 'blocked') return usuario.bloqueado;
        if (filter === 'unblocked') return !usuario.bloqueado;
        return true;
    });

    return (
        <Box>
            {/* Configuración de Seguridad */}
            <Card sx={{ marginBottom: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Configuración de Seguridad
                    </Typography>
                    {config ? (
                        <Box component="form" sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                            <TextField
                                label="Número máximo de intentos fallidos"
                                type="number"
                                value={config.maxIntentosFallidos}
                                onChange={(e) =>
                                    setConfig({ ...config, maxIntentosFallidos: parseInt(e.target.value, 10) })
                                }
                                InputProps={{ inputProps: { min: 1 } }}
                                fullWidth
                            />
                            <TextField
                                label="Tiempo de desbloqueo automático (minutos)"
                                type="number"
                                value={config.tiempoDesbloqueoAutomatico}
                                onChange={(e) =>
                                    setConfig({ ...config, tiempoDesbloqueoAutomatico: parseInt(e.target.value, 10) })
                                }
                                InputProps={{ inputProps: { min: 1 } }}
                                fullWidth
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={saveConfig}
                                sx={{ alignSelf: 'flex-start' }}
                                fullWidth
                            >
                                Guardar Configuración
                            </Button>
                            <TextField
                                select
                                label="Filtrar usuarios"
                                value={filter}
                                fullWidth
                                onChange={handleFilterChange}
                            >
                                <MenuItem sx={{ color: theme.palette.text.primary }} value="all">Todos</MenuItem>
                                <MenuItem  sx={{ color: theme.palette.text.primary }} value="blocked">Bloqueados</MenuItem>
                                <MenuItem sx={{ color: theme.palette.text.primary }} value="unblocked">No bloqueados</MenuItem>
                            </TextField>
                        </Box>
                    ) : (
                        <Typography>Cargando configuración...</Typography>
                    )}
                </CardContent>
            </Card>

            {/* Lista de usuarios */}
            <Box>
                <Typography variant="h6">Usuarios</Typography>
                {filteredUsers.map((usuario) => (
                    <Card key={usuario._id} sx={{ marginBottom: 2 }}>
                        <CardContent>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={4}>
                                    <Typography variant="h6" gutterBottom>
                                        Usuario: {usuario.username}
                                    </Typography>
                                    <Typography variant="body2">Correo: {usuario.email}</Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography variant="body2">
                                        Intentos fallidos: {usuario.intentosVerificacion}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    {usuario.bloqueado ? (
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => desbloquearUsuario(usuario._id)}
                                        >
                                            Desbloquear Usuario
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={() => bloquearUsuario(usuario._id)}
                                        >
                                            Bloquear Usuario
                                        </Button>
                                    )}
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Box>
    );
};

export default BlockedUsers;
