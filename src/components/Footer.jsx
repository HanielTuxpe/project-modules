import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                py: 3,
                px: 2,
                mt: 'auto',
                textAlign: 'center',
                backgroundColor: (theme) =>
                    theme.palette.mode === 'light' ? theme.palette.grey[400] : theme.palette.grey[900],
            }}
        >
            <Typography variant="body1">
                Universidad Tecnológica de la Huasteca Hidalguense
            </Typography>
        </Box>
    );
};

export default Footer;
