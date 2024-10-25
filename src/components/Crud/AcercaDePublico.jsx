import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Link,
} from '@mui/material';
import { styled } from '@mui/system';
import { Facebook, Twitter, Instagram, LinkedIn , WhatsApp, YouTube} from '@mui/icons-material'; // Import icons

const colors = {
  primary: '#921F45',
  secondary: '#914F65',
  accent: '#BC955B',
  white: '#FFFFFF',
  lightBlue: '#E1EDFF',
  black: '#000000', // Added black for text
};

// Styles for the ProfileCard
const ProfileCard = styled(Card)(({ theme }) => ({
  backgroundColor: colors.white,
  borderRadius: '12px',
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', // Enhanced shadow
  transition: 'transform 0.3s, box-shadow 0.3s', // Transition for shadow and scale
  '&:hover': {
    transform: 'scale(1.05)', // Scale on hover
    boxShadow: '0 16px 32px rgba(0, 0, 0, 0.4)', // Deeper shadow on hover
  },
}));

// Icon mapping for social media links
const iconMapping = {
    facebook: <Facebook />,
    twitter: <Twitter />,
    instagram: <Instagram />,
    linkedin: <LinkedIn />,
    whatsapp: <WhatsApp />,
    youtube: <YouTube />,
};

const Profile = () => {
  const [nombreEmpresa, setNombreEmpresa] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [mision, setMision] = useState('');
  const [vision, setVision] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [direccion, setDireccion] = useState('');
  const [imagen, setImagen] = useState('');
  const [redesSociales, setRedesSociales] = useState([]);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await fetch('https://prj-server.onrender.com/InformacionEmpresa');
        const data = await response.json();

        if (data.length > 0) {
          const companyInfo = data[0];
          setNombreEmpresa(companyInfo.nombreEmpresa);
          setDescripcion(companyInfo.descripcion);
          setMision(companyInfo.mision);
          setVision(companyInfo.vision);
          setObjetivo(companyInfo.objetivo);
          setDireccion(companyInfo.direccion);
          setImagen(companyInfo.imagen);
          setRedesSociales(companyInfo.redesSociales || []);
        }
      } catch (error) {
        console.error('Error fetching company data:', error);
      }
    };

    fetchCompanyData();
  }, []);

  if (!nombreEmpresa) {
    return <Typography variant="h6" color={colors.black}>Cargando...</Typography>;
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={6}>
          <ProfileCard>
            <CardMedia
              component="img"
              image={imagen}
              alt={`${nombreEmpresa} logo`}
              sx={{ height: 200, objectFit: 'contain' }}
            />
            <CardContent>
              <Typography variant="h4" color={colors.black}>
                {nombreEmpresa}
              </Typography>
              <Typography variant="body1" color={colors.black}>
                {descripcion}
              </Typography>
              <Typography variant="h6" color={colors.primary}>
                Misión
              </Typography>
              <Typography variant="body2" color={colors.black}>
                {mision}
              </Typography>
              <Typography variant="h6" color={colors.primary}>
                Visión
              </Typography>
              <Typography variant="body2" color={colors.black}>
                {vision}
              </Typography>
              <Typography variant="h6" color={colors.primary}>
                Objetivo
              </Typography>
              <Typography variant="body2" color={colors.black}>
                {objetivo}
              </Typography>
              <Typography variant="h6" color={colors.primary}>
                Dirección
              </Typography>
              <Typography variant="body2" color={colors.black}>
                {direccion}
              </Typography>
              <Box mt={2}>
                <Typography variant="h6" color={colors.primary}>
                  Redes Sociales
                </Typography>
                <Box display="flex" flexWrap="wrap" mt={1}>
                  {Array.isArray(redesSociales) && redesSociales.length > 0 ? (
                    redesSociales.map((red, index) => (
                      <Link
                        href={red.link}
                        target="_blank"
                        rel="noopener"
                        color={colors.black}
                        key={index}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          marginRight: 2,
                          textDecoration: 'none',
                          '&:hover': {
                            color: colors.primary, // Change color on hover
                          },
                        }}
                      >
                        {iconMapping[red.nombre.toLowerCase()] || <span>{red.nombre}</span>}
                        <Typography variant="body2" sx={{ marginLeft: 0.5 }}>
                          {red.nombre}
                        </Typography>
                      </Link>
                    ))
                  ) : (
                    <Typography variant="body2" color={colors.black}>
                      No hay redes sociales disponibles.
                    </Typography>
                  )}
                </Box>
              </Box>
            </CardContent>
          </ProfileCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
