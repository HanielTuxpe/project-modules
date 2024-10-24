import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, CardContent, IconButton, List, Card, ListItem, Avatar, Tooltip, Button } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

import { styled } from '@mui/material/styles';
import { MenuItem, Select } from '@mui/material';

const PerfilEmpresa = () => {
    const [nombreEmpresa, setNombreEmpresa] = useState('Nombre de la Empresa');
    const [imagen, setImagen] = useState(null);
    const [descripcion, setDescripcion] = useState('Descripción de la empresa.');
    const [mision, setMision] = useState('Misión de la empresa.');
    const [vision, setVision] = useState('Visión de la empresa.');
    const [direccion, setDireccion] = useState('Dirección de la empresa.');
    const [objetivo, setObjetivo] = useState('Objetivo de la empresa.');
    const [nuevoNombre, setNuevoNombre] = useState('');

    const [loading, setLoading] = useState(true);
    const [empresaId, setEmpresaId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingNombre, setIsEditingNombre] = useState(false);

    const [socialLinks, setSocialLinks] = useState([]);
    const [newLink, setNewLink] = useState('');
    const [isEditingLink, setIsEditingLink] = useState(false);
    const [currentEditIndex, setCurrentEditIndex] = useState(null);
    const [editedLink, setEditedLink] = useState('');
    const [selectedPlatform, setSelectedPlatform] = useState('');

    const cargarDatosEmpresa = async () => {
        try {
            const response = await fetch('http://localhost:3001/InformacionEmpresa');
            const data = await response.json();

            if (response.ok && data.length > 0) {
                const empresa = data[0];
                setNombreEmpresa(empresa.nombreEmpresa);
                setImagen(empresa.imagen);
                setDescripcion(empresa.descripcion);
                setMision(empresa.mision);
                setVision(empresa.vision);
                setDireccion(empresa.direccion);
                setObjetivo(empresa.objetivo);
                setEmpresaId(empresa._id);
                setNuevoNombre(empresa.nombreEmpresa);
            } else {
                console.error('No se encontraron datos de la empresa');
            }
        } catch (error) {
            console.error('Error al cargar los datos de la empresa:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarDatosEmpresa();
    }, []);

    const actualizarEmpresa = async (campo, valor) => {
        try {
            const response = await fetch(`http://localhost:3001/informacionEmpresa/${empresaId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ [campo]: valor }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(`Campo ${campo} actualizado con éxito`, data);

                switch (campo) {
                    case 'nombreEmpresa':
                        setNombreEmpresa(data.nombreEmpresa);
                        break;
                    case 'descripcion':
                        setDescripcion(data.descripcion);
                        break;
                    case 'mision':
                        setMision(data.mision);
                        break;
                    case 'vision':
                        setVision(data.vision);
                        break;
                    case 'direccion':
                        setDireccion(data.direccion);
                        break;
                    case 'objetivo':
                        setObjetivo(data.objetivo);
                        break;
                    case 'imagen':
                        setImagen(data.imagen);
                        break;
                    default:
                        break;
                }
            } else {
                const errorData = await response.json();
                console.error('Error al actualizar el campo:', errorData.message);
            }
        } catch (error) {
            console.error('Error al actualizar la empresa:', error);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const nuevaImagen = reader.result;
                setImagen(nuevaImagen);
                actualizarEmpresa('imagen', nuevaImagen);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEditNombre = () => {
        actualizarEmpresa('nombreEmpresa', nuevoNombre);
        setIsEditingNombre(false);
    };

    const toggleEditing = () => {
        if (isEditing) {
            // Guardar los cambios en todos los campos editados
            handleFieldChange('nombreEmpresa', nombreEmpresa);
            handleFieldChange('descripcion', descripcion);
            handleFieldChange('mision', mision);
            handleFieldChange('vision', vision);
            handleFieldChange('direccion', direccion);
            handleFieldChange('objetivo', objetivo);
        }
        setIsEditing(!isEditing);
    };

    const handleFieldChange = (campo, valor) => {
        actualizarEmpresa(campo, valor);
    };

    if (loading) {
        return <div>Cargando datos de la empresa...</div>;
    }



    const handleAddLink = () => {
        const newSocialLink = { platform: selectedPlatform, url: newLink };
        setSocialLinks([...socialLinks, newSocialLink]);
        setNewLink('');
        setSelectedPlatform('');
    };

  // Función para eliminar un enlace
const handleDeleteLink = (index) => {
    const updatedLinks = socialLinks.filter((_, i) => i !== index);
    setSocialLinks(updatedLinks);
};

// Función para iniciar la edición de un enlace
const handleEditLink = (index) => {
    setIsEditingLink(true);
    setCurrentEditIndex(index);
    setEditedLink(socialLinks[index]); // Carga el enlace a editar
};

// Función para actualizar un enlace
const handleUpdateLink = () => {
    const updatedLinks = [...socialLinks];
    updatedLinks[currentEditIndex] = editedLink; // Actualiza el enlace con los nuevos valores
    setSocialLinks(updatedLinks);
    setIsEditingLink(false);
    setEditedLink({ platform: '', url: '' }); // Limpia los valores del formulario
    setCurrentEditIndex(null);
};

// Función para manejar el cambio en los campos editables
const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedLink({ ...editedLink, [name]: value });
};

    return (
        <>
            <Box sx={{ padding: 2 }}>
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                    <Typography variant="h4" color="primary" gutterBottom>
                        {isEditingNombre ? (
                            <Box display="flex" alignItems="center">
                                <TextField
                                    value={nuevoNombre}
                                    onChange={(e) => setNuevoNombre(e.target.value)}
                                    onBlur={handleEditNombre}
                                    autoFocus
                                />
                            </Box>
                        ) : (
                            <Box display="flex" alignItems="center">
                                {nombreEmpresa}
                                <Tooltip title="Editar Nombre" arrow>
                                    <IconButton onClick={() => setIsEditingNombre(true)} color="primary" sx={{ ml: 1 }}>
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        )}
                    </Typography>
                </Box>

                <Box display="flex" justifyContent="center" mb={2}>
                    <Avatar
                        src={imagen}
                        alt="Imagen de la empresa"
                        sx={{
                            width: 200,
                            height: 200,
                            border: '2px solid #ccc',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                        }}
                    />
                </Box>

                <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="upload-image"
                    type="file"
                    onChange={handleImageChange}
                    disabled={!isEditing}
                />
                <label htmlFor="upload-image">
                    <Button variant="contained" component="span" disabled={!isEditing}>
                        Cambiar Imagen
                    </Button>
                </label>

                <Box mt={3}>
                    <Typography variant="h6">Dirección</Typography>
                    <TextField
                        value={direccion}
                        onChange={(e) => handleFieldChange('direccion', e.target.value)}
                        multiline
                        rows={2}
                        fullWidth
                        disabled={!isEditing}
                    />
                </Box>

                <Box mt={3}>
                    <Typography variant="h6">Descripción</Typography>
                    <TextField
                        value={descripcion}
                        onChange={(e) => handleFieldChange('descripcion', e.target.value)}
                        multiline
                        rows={3}
                        fullWidth
                        disabled={!isEditing}
                    />
                </Box>

                <Box mt={3}>
                    <Typography variant="h6">Misión</Typography>
                    <TextField
                        value={mision}
                        onChange={(e) => handleFieldChange('mision', e.target.value)}
                        multiline
                        rows={2}
                        fullWidth
                        disabled={!isEditing}
                    />
                </Box>

                <Box mt={3}>
                    <Typography variant="h6">Visión</Typography>
                    <TextField
                        value={vision}
                        onChange={(e) => handleFieldChange('vision', e.target.value)}
                        multiline
                        rows={2}
                        fullWidth
                        disabled={!isEditing}
                    />
                </Box>

                <Box mt={3}>
                    <Typography variant="h6">Objetivo</Typography>
                    <TextField
                        value={objetivo}
                        onChange={(e) => handleFieldChange('objetivo', e.target.value)}
                        multiline
                        rows={2}
                        fullWidth
                        disabled={!isEditing}
                    />
                </Box>

                <Button variant="contained" onClick={toggleEditing} sx={{ mt: 3 }}>
                    {isEditing ? 'Guardar' : 'Editar Información'}
                </Button>
            </Box>
            <Card sx={{ mt: 4 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>Gestión de Redes Sociales</Typography>

                    <Box display="flex" alignItems="center" mb={2}>
                        {/* Select para elegir la red social */}
                        <Select
                            value={selectedPlatform}
                            onChange={(e) => setSelectedPlatform(e.target.value)}
                            displayEmpty
                            sx={{
                                mr: 2, // Margen derecho
                                width: '300px', // Ancho específico, ajusta según tus necesidades
                            }}
                            fullWidth
                        >
                            <MenuItem value="" disabled>Seleccionar Red Social</MenuItem>
                            <MenuItem value="Facebook">Facebook</MenuItem>
                            <MenuItem value="Twitter">Twitter</MenuItem>
                            <MenuItem value="Instagram">Instagram</MenuItem>
                            <MenuItem value="LinkedIn">LinkedIn</MenuItem>
                            {/* Agrega más redes sociales si es necesario */}
                        </Select>

                        <TextField
                            label="Agregar nuevo enlace de red social"
                            value={newLink}
                            onChange={(e) => setNewLink(e.target.value)}
                            fullWidth
                        />

                        <Button
                            onClick={handleAddLink}
                            variant="contained"
                            color="primary"
                            sx={{ ml: 2 }}
                            disabled={!selectedPlatform || !newLink} // Desactiva el botón si no hay plataforma o enlace
                        >
                            Agregar
                        </Button>
                    </Box>

                    {socialLinks.length > 0 && (
                        <List>
                            {socialLinks.map((link, index) => (
                                <ListItem key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    {isEditingLink && currentEditIndex === index ? (
                                        <>
                                            <TextField
                                                label="Red Social"
                                                name="platform"
                                                value={editedLink.platform}
                                                onChange={handleEditChange}
                                                fullWidth
                                                InputProps={{
                                                    readOnly: true, // Esto hace que el campo no sea editable
                                                }}                                                
                                            />
                                            <TextField
                                                label="Enlace"
                                                name="url"
                                                value={editedLink.url}
                                                onChange={handleEditChange}
                                                fullWidth
                                            />
                                        </>
                                    ) : (
                                        <Typography>{link.platform}: {link.url}</Typography> // Muestra la plataforma y el enlace
                                    )}

                                    <Box>
                                        {isEditingLink && currentEditIndex === index ? (
                                            <Button onClick={handleUpdateLink} variant="contained" color="primary" sx={{ ml: 2 }}>
                                                Actualizar
                                            </Button>
                                        ) : (
                                            <>
                                                <Tooltip title="Editar enlace" arrow>
                                                    <IconButton onClick={() => handleEditLink(index)} color="primary" sx={{ ml: 1 }}>
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Eliminar enlace" arrow>
                                                    <IconButton onClick={() => handleDeleteLink(index)} color="secondary" sx={{ ml: 1 }}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </>
                                        )}
                                    </Box>
                                </ListItem>
                            ))}
                        </List>
                    )}
                </CardContent>
            </Card>
        </>

    );
};

export default PerfilEmpresa;
