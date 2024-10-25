import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
    Box,
    Button,
    CircularProgress,
    Grid,
} from '@mui/material';

const Politicas = () => {
    const [politicas, setPoliticas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [documentos, setDocumentos] = useState([]);

    // Obtener políticas
    useEffect(() => {
        const fetchPoliticas = async () => {
            try {
                const response = await fetch('https://prj-server.onrender.com/deslinde');
                const data = await response.json();
                setPoliticas(data);
            } catch (error) {
                console.error('Error al obtener políticas:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPoliticas();
    }, []);

    // Obtener documentos
    useEffect(() => {
        const fetchDocumentos = async () => {
            try {
                const response = await fetch('https://prj-server.onrender.com/deslinde/ConArchivo');
                const data = await response.json();
                setDocumentos(data); // Asegúrate de que la respuesta es un array de documentos
            } catch (error) {
                console.error('Error al obtener documentos:', error);
            }
        };

        fetchDocumentos();
    }, []);

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4, borderRadius: '8px', padding: '16px' }} justifyContent="center" alignItems="center">
            <Typography variant="h4" gutterBottom sx={{ color: '#921F45', textAlign: 'center' }}>
                Deslinde Legal
            </Typography>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
                    <CircularProgress />
                </Box>
            ) : (
                <Paper elevation={3} sx={{ mb: 3, p: 3, bgcolor: '#FFFFFF', borderRadius: '8px' }}>
                    {politicas.map((politica) => (
                        <Grid item xs={12} sm={6} md={4} key={politica._id}>
                           
                                <Typography variant="h5" gutterBottom sx={{ color: '#914F65' }}>
                                    {politica.titulo_deslinde}
                                </Typography>
                                <List>
                                    {politica.secciones.map((seccion) => (
                                        <ListItem key={seccion._id} sx={{ borderBottom: '1px solid #BC955B', mb: 2 }}>
                                            <ListItemText
                                                primary={<Typography sx={{ color: '#921F45', wordBreak: 'break-word' }}>{seccion.titulo_seccion}</Typography>}
                                                secondary={
                                                    <>
                                                        <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-word' }}>
                                                            {seccion.description}
                                                        </Typography>
                                                        <List dense>
                                                            {seccion.list.map((item, index) => (
                                                                <ListItem key={index}>
                                                                    <ListItemText primary={<Typography sx={{ color: '#000000', wordBreak: 'break-word' }}>{item}</Typography>} />
                                                                </ListItem>
                                                            ))}
                                                        </List>
                                                    </>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                          
                        </Grid>
                    ))}
                </Paper>
            )}

            <Paper elevation={3} sx={{ mb: 3, p: 3, bgcolor: '#FFFFFF', borderRadius: '8px' }}>
                {/* Sección de Documentos */}
                {documentos.length > 0 && (
                    <Box mt={4}>
                        <Typography variant="h6" gutterBottom sx={{ color: '#914F65' }}>
                            Documentos Adjuntos
                        </Typography>
                        <List>
                            {documentos
                                .filter(doc => doc.estado === true) // Filtra solo los documentos cuyo estado es true
                                .map((doc) => (
                                    <ListItem key={doc.id} sx={{ borderBottom: '1px solid #BC955B', mb: 1 }}>
                                        <ListItemText
                                            primary={
                                                <Typography sx={{ color: '#921F45', wordBreak: 'break-word' }}>
                                                    {doc.nombre}
                                                </Typography>
                                            }
                                            secondary={
                                                <Box>
                                                    <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-word' }}>
                                                        Fecha de Subida: {new Date(doc.fechaSubida).toLocaleString()}
                                                    </Typography>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        sx={{
                                                            bgcolor: '#BC955B',
                                                            '&:hover': { bgcolor: '#921F45' },
                                                            color: '#FFFFFF',
                                                            mt: 1,
                                                        }}
                                                        href={`data:${doc.tipo};base64,${doc.archivo}`}
                                                        download={doc.nombre}
                                                    >
                                                        Descargar
                                                    </Button>
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                ))}
                        </List>
                    </Box>
                )}
            </Paper>
        </Container>
    );
};

export default Politicas;
