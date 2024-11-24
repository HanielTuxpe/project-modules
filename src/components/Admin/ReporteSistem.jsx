import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Container, Divider, CircularProgress } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';

const ReportesErroresAdmin = () => {
  const [errores, setErrores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme(); // Obtén el tema global

  // Función para obtener los errores desde la API
  useEffect(() => {
    const fetchErrores = async () => {
      try {
        const response = await fetch('https://prj-server.onrender.com/ReportesSystem');
        if (!response.ok) {
          throw new Error('Error al obtener los datos de la API.');
        }
        const data = await response.json();
        setErrores(data); // Asume que la API devuelve un arreglo de errores
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchErrores();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Container
        maxWidth="lg"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          mt: 4,
          mb: 4,
        }}
      >
        {/* Título */}
        <Typography variant="h4" textAlign="center" sx={{ mb: 2, color: theme.palette.text.primary }}>
          Reportes del Sistema
        </Typography>

        {/* Carga de datos */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography variant="h6" textAlign="center" color="error">
            {error}
          </Typography>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              alignItems: 'center',
            }}
          >
            {errores.length > 0 ? (
              errores.map((error, index) => (
                <Paper
                  key={error._id} // Usamos _id como key para evitar problemas con índices
                  elevation={3}
                  sx={{
                    p: 3,
                    width: '100%',
                    maxWidth: 800,
                    backgroundColor: theme.palette.background.paper,
                  }}
                >
                  {/* Cabecera del reporte */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="h6" color="error" fontWeight="bold">
                      {`Reporte ${index + 1}`}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: theme.palette.text.secondary }}
                    >
                      {new Date(error.fecha).toLocaleDateString()} {/* Convertir fecha */}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />

                  {/* Detalles del error */}
                  <Typography variant="body1" sx={{ mb: 1, color: theme.palette.text.primary }}>
                    <strong>Descripción:</strong> {error.mensaje}
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                    <strong>Módulo:</strong> {error.modulo}
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                    <strong>Proceso:</strong> {error.proceso}
                  </Typography>
                </Paper>
              ))
            ) : (
              <Typography variant="h6" textAlign="center" color="text.secondary">
                No se encontraron errores registrados en el sistema.
              </Typography>
            )}
          </Box>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default ReportesErroresAdmin;
