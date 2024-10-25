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
    const [editedLink, setEditedLink] = useState({ platform: '', url: '' });
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
                if (empresa.redesSociales) {
                    setSocialLinks(empresa.redesSociales);

                    console.log(empresa.redesSociales);
                }
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
            actualizarEmpresa('nombreEmpresa', nombreEmpresa);
            actualizarEmpresa('descripcion', descripcion);
            actualizarEmpresa('mision', mision);
            actualizarEmpresa('vision', vision);
            actualizarEmpresa('direccion', direccion);
            actualizarEmpresa('objetivo', objetivo);
        }
        setIsEditing(!isEditing);
    };

    const handleAddLink = () => {
        if (selectedPlatform && newLink) {
            const newSocialLink = { platform: selectedPlatform, url: newLink };
            setSocialLinks([...socialLinks, newSocialLink]);
            setNewLink('');
            setSelectedPlatform('');
            // Aquí puedes agregar la lógica para enviar el nuevo enlace al servidor si es necesario
        }
    };

    // Función para eliminar un enlace
    const handleDeleteLink = (index) => {
        const updatedLinks = socialLinks.filter((_, i) => i !== index);
        setSocialLinks(updatedLinks);
        // Aquí puedes agregar la lógica para eliminar el enlace del servidor si es necesario
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
        // Aquí puedes agregar la lógica para actualizar el enlace en el servidor si es necesario
    };

    // Función para manejar el cambio en los campos editables
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditedLink({ ...editedLink, [name]: value });
    };

    if (loading) {
        return <div>Cargando datos de la empresa...</div>;
    }

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
                        onChange={(e) => actualizarEmpresa('direccion', e.target.value)}
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
                        onChange={(e) => actualizarEmpresa('descripcion', e.target.value)}
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
                        onChange={(e) => actualizarEmpresa('mision', e.target.value)}
                        multiline
                        rows={3}
                        fullWidth
                        disabled={!isEditing}
                    />
                </Box>

                <Box mt={3}>
                    <Typography variant="h6">Visión</Typography>
                    <TextField
                        value={vision}
                        onChange={(e) => actualizarEmpresa('vision', e.target.value)}
                        multiline
                        rows={3}
                        fullWidth
                        disabled={!isEditing}
                    />
                </Box>

                <Box mt={3}>
                    <Typography variant="h6">Objetivo</Typography>
                    <TextField
                        value={objetivo}
                        onChange={(e) => actualizarEmpresa('objetivo', e.target.value)}
                        multiline
                        rows={3}
                        fullWidth
                        disabled={!isEditing}
                    />
                </Box>

                <Box mt={3} display="flex" justifyContent="center">
                    <Button variant="contained" onClick={toggleEditing}>
                        {isEditing ? 'Guardar Cambios' : 'Editar Información'}
                    </Button>
                </Box>
                

                <Box mt={3}>
                    <Typography variant="h6">Redes Sociales</Typography>
                    <Box display="flex" alignItems="center">
                        <Select
                            value={selectedPlatform}
                            onChange={(e) => setSelectedPlatform(e.target.value)}
                            sx={{
                                mr: 2, // Margen derecho
                                width: '300px', // Ancho específico, ajusta según tus necesidades
                            }}
                        >
                            <MenuItem value="">
                                <em>Seleccionar Plataforma</em>
                            </MenuItem>
                            <MenuItem value="Facebook">Facebook</MenuItem>
                            <MenuItem value="Twitter">Twitter</MenuItem>
                            <MenuItem value="Instagram">Instagram</MenuItem>
                            <MenuItem value="LinkedIn">LinkedIn</MenuItem>
                            <MenuItem value="Otro">Otro</MenuItem>
                        </Select>
                        <TextField
                            value={newLink}
                            onChange={(e) => setNewLink(e.target.value)}
                            placeholder="URL"
                            sx={{ ml: 2 }}
                            fullWidth
                        />
                        <Button onClick={handleAddLink} variant="contained" sx={{ ml: 2 }} >
                            Agregar Enlace
                        </Button>
                    </Box>

                </Box>
                <Box mt={3} display="flex" alignItems="center" >
                    {socialLinks.length === 0 ? (
                        <Typography variant="body2" color="text.secondary">
                            No hay enlaces de redes sociales.
                        </Typography>
                    ) : (
                        <Box mt={3} width="100%" >
                            {socialLinks.map((link, index) => (
                                <ListItem key={link._id}>
                                    <Box display="flex" alignItems="center" justifyContent="space-between" width="100%"  >

                                        {isEditingLink && currentEditIndex === index ? (
                                            <Box display="flex" alignItems="center" width="100%">
                                                <TextField
                                                    name="nombre"
                                                    value={editedLink.nombre}
                                                    onChange={handleEditChange}
                                                    InputProps={{
                                                        readOnly: true, // Esto hace que el campo no sea editable
                                                    }}
                                                    sx={{
                                                        mr: 2, // Margen derecho
                                                        width: '300px', // Ancho específico, ajusta según tus necesidades
                                                    }}
                                                    fullWidth
                                                />
                                                <TextField
                                                    name="link"
                                                    value={editedLink.link}
                                                    onChange={handleEditChange}
                                                    fullWidth
                                                />
                                                <Button onClick={handleUpdateLink} sx={{ ml: 1 }}>
                                                    Guardar
                                                </Button>
                                            </Box>
                                        ) : (
                                            <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                                                <Typography>
                                                    {link.nombre}: <a href={link.link} target="_blank" rel="noopener noreferrer">{link.link}</a>
                                                </Typography>
                                                <Box>

                                                    <Tooltip title="Editar" arrow>
                                                        <IconButton onClick={() => handleEditLink(index)} color="primary" sx={{ ml: 1 }}>
                                                            <EditIcon />
                                                        </IconButton>
                                                    </Tooltip>

                                                    <Tooltip title="Eliminar" arrow>
                                                        <IconButton onClick={() => handleDeleteLink(index)} color="primary" sx={{ ml: 1 }}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Tooltip>


                                                </Box>

                                            </Box>
                                        )}
                                    </Box>
                                </ListItem>
                            ))}
                        </Box>
                    )}
                </Box>

                <Box mt={3} display="flex" justifyContent="center">
                    <Button variant="contained" onClick={toggleEditing}>
                        {isEditing ? 'Guardar Cambios' : 'Editar Información'}
                    </Button>
                </Box>

            </Box>
        </>
    );
};

export default PerfilEmpresa;
