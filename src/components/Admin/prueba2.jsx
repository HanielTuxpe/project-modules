import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, IconButton, Button, Avatar, Tooltip, Select, MenuItem, ListItem, List } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';

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
    const [selectedPlatform, setSelectedPlatform] = useState('');
    const [isEditingLink, setIsEditingLink] = useState(false);
    const [currentEditIndex, setCurrentEditIndex] = useState(null);
    const [editedLink, setEditedLink] = useState({ platform: '', url: '' });

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
                if (empresa.redesSociales) {
                    setSocialLinks(empresa.redesSociales);
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
            const response = await fetch(`http://localhost:3001/InformacionEmpresa/${empresaId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ [campo]: valor }),
            });

            if (response.ok) {
                const data = await response.json();
                toast.success(`Campo ${campo} actualizado con éxito`);

                switch (campo) {
                    case 'nombreEmpresa':
                        setNombreEmpresa(data.empresa.nombreEmpresa);
                        break;
                    case 'descripcion':
                        setDescripcion(data.empresa.descripcion);
                        break;
                    case 'mision':
                        setMision(data.empresa.mision);
                        break;
                    case 'vision':
                        setVision(data.empresa.vision);
                        break;
                    case 'direccion':
                        setDireccion(data.empresa.direccion);
                        break;
                    case 'objetivo':
                        setObjetivo(data.empresa.objetivo);
                        break;
                    case 'imagen':
                        setImagen(data.empresa.imagen);
                        break;
                    case 'redesSociales':
                        setSocialLinks(data.empresa.redesSociales);
                        break;
                    default:
                        break;
                }
            } else {
                const errorData = await response.json();
                toast.error(`Error en el Campo ${campo}`);
                console.error('Error al actualizar el campo:', errorData.message);
            }
        } catch (error) {
            console.error('Error al actualizar la empresa:', error);
        }
    };

    const handleImageChange = async (e) => { 
        const file = e.target.files[0];
        if (file) {
            const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!validTypes.includes(file.type)) {
                toast.warning('Solo se permiten imágenes JPG, PNG y JPEG');
                return;
            }

            const maxSize = 2 * 1024 * 1024; // 2 MB
            if (file.size > maxSize) {
                toast.warning('El tamaño de la imagen debe ser de 2 MB o menos');
                return;
            }

            const formData = new FormData();
            formData.append('imagen', file);

            try {
                const response = await fetch(`http://localhost:3001/InformacionEmpresa/${empresaId}`, {
                    method: 'PATCH',
                    body: formData,
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    toast.error(`Error al actualizar la imagen: ${errorData.message || response.statusText}`);
                } else {
                    const updatedData = await response.json();
                    toast.success('Imagen actualizada con éxito');
                }
            } catch (error) {
                toast.error('Error al realizar la solicitud');
            }
        }
    };

    const handleEditNombre = () => {
        if (nuevoNombre.trim() === '') {
            toast.error('El campo Nombre no puede estar vacío');
        } else {
            actualizarEmpresa('nombreEmpresa', nuevoNombre);
            setIsEditingNombre(false);
        }
    };

    const toggleEditing = () => {
        if (isEditing) {
            if (
                nombreEmpresa.trim() === '' ||
                descripcion.trim() === '' ||
                mision.trim() === '' ||
                vision.trim() === '' ||
                direccion.trim() === '' ||
                objetivo.trim() === '' ||
                imagen.trim() === ''
            ) {
                toast.warning('Todos los campos deben estar completos antes de guardar.');
                return;
            }

            actualizarEmpresa('nombreEmpresa', nombreEmpresa);
            actualizarEmpresa('descripcion', descripcion);
            actualizarEmpresa('mision', mision);
            actualizarEmpresa('vision', vision);
            actualizarEmpresa('direccion', direccion);
            actualizarEmpresa('objetivo', objetivo);
            toast.success('Información actualizada con éxito');
        }

        setIsEditing(!isEditing);
    };

    const handleAddLink = () => {
        if (selectedPlatform && newLink) {
            const urlPattern = /^https:\/\/.+/;
            if (!urlPattern.test(newLink)) {
                toast.warning("El enlace debe comenzar con 'https://'.");
                return;
            }

            const newSocialLink = { nombre: selectedPlatform, link: newLink };
            const updatedLinks = Array.isArray(socialLinks) ? [...socialLinks, newSocialLink] : [newSocialLink];
            setSocialLinks(updatedLinks);
            actualizarEmpresa('redesSociales', updatedLinks);

            setNewLink('');
            setSelectedPlatform('');
        } else {
            toast.warning("Debe completar todos los campos.");
        }
    };

    const handleDeleteLink = (index) => {
        if (index >= 0 && index < socialLinks.length) {
            const updatedLinks = socialLinks.filter((_, i) => i !== index);
            setSocialLinks(updatedLinks);
            actualizarEmpresa('redesSociales', updatedLinks);
        } else {
            console.error('Error: No se puede eliminar el enlace, índice no válido.');
        }
    };

    const handleEditLink = (index) => {
        setIsEditingLink(true);
        setCurrentEditIndex(index);
        setEditedLink(socialLinks[index]);
    };

    const handleUpdateLink = () => {
        if (currentEditIndex !== null) {
            const updatedLinks = [...socialLinks];
            updatedLinks[currentEditIndex] = editedLink;
            setSocialLinks(updatedLinks);
            actualizarEmpresa('redesSociales', updatedLinks);

            setIsEditingLink(false);
            setEditedLink({ platform: '', url: '' });
            setCurrentEditIndex(null);
        } else {
            console.error('Error: No se puede actualizar el enlace, índice no válido.');
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditedLink({ ...editedLink, [name]: value });
    };

    if (loading) {
        return <div>Cargando datos de la empresa...</div>;
    }

    return (
        <Box sx={{ padding: 2 }}>
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <Typography variant="h4" color="primary" gutterBottom>
                    {isEditingNombre ? (
                        <TextField
                            value={nuevoNombre}
                            onChange={(e) => setNuevoNombre(e.target.value)}
                            onBlur={handleEditNombre}
                            autoFocus
                        />
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

            <Box mt={2}>
                <Typography variant="h6">Imagen:</Typography>
                {imagen && <Avatar src={`http://localhost:3001/${imagen}`} alt="Logo" sx={{ width: 56, height: 56 }} />}
                <input type="file" onChange={handleImageChange} />
            </Box>

            <Box mt={2}>
                <Typography variant="h6">Descripción:</Typography>
                {isEditing ? (
                    <TextField
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        fullWidth
                        multiline
                        rows={4}
                    />
                ) : (
                    <Typography>{descripcion}</Typography>
                )}
            </Box>

            <Box mt={2}>
                <Typography variant="h6">Misión:</Typography>
                {isEditing ? (
                    <TextField
                        value={mision}
                        onChange={(e) => setMision(e.target.value)}
                        fullWidth
                        multiline
                        rows={4}
                    />
                ) : (
                    <Typography>{mision}</Typography>
                )}
            </Box>

            <Box mt={2}>
                <Typography variant="h6">Visión:</Typography>
                {isEditing ? (
                    <TextField
                        value={vision}
                        onChange={(e) => setVision(e.target.value)}
                        fullWidth
                        multiline
                        rows={4}
                    />
                ) : (
                    <Typography>{vision}</Typography>
                )}
            </Box>

            <Box mt={2}>
                <Typography variant="h6">Dirección:</Typography>
                {isEditing ? (
                    <TextField
                        value={direccion}
                        onChange={(e) => setDireccion(e.target.value)}
                        fullWidth
                        multiline
                        rows={4}
                    />
                ) : (
                    <Typography>{direccion}</Typography>
                )}
            </Box>

            <Box mt={2}>
                <Typography variant="h6">Objetivo:</Typography>
                {isEditing ? (
                    <TextField
                        value={objetivo}
                        onChange={(e) => setObjetivo(e.target.value)}
                        fullWidth
                        multiline
                        rows={4}
                    />
                ) : (
                    <Typography>{objetivo}</Typography>
                )}
            </Box>

            <Box mt={2}>
                <Button variant="contained" onClick={toggleEditing}>
                    {isEditing ? 'Guardar Cambios' : 'Editar Información'}
                </Button>
            </Box>

            <Box mt={3}>
                <Typography variant="h6">Redes Sociales:</Typography>
                {isEditingLink ? (
                    <Box display="flex" gap={2}>
                        <Select
                            value={editedLink.platform}
                            name="platform"
                            onChange={handleEditChange}
                            fullWidth
                        >
                            <MenuItem value="Facebook">Facebook</MenuItem>
                            <MenuItem value="Twitter">Twitter</MenuItem>
                            <MenuItem value="Instagram">Instagram</MenuItem>
                        </Select>
                        <TextField
                            value={editedLink.url}
                            name="url"
                            onChange={handleEditChange}
                            fullWidth
                            label="URL"
                        />
                        <Button variant="contained" onClick={handleUpdateLink}>
                            Actualizar
                        </Button>
                    </Box>
                ) : (
                    <List>
                        {socialLinks.map((link, index) => (
                            <ListItem key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography>{link.nombre}: <a href={link.link} target="_blank" rel="noopener noreferrer">{link.link}</a></Typography>
                                <Box>
                                    <IconButton onClick={() => handleEditLink(index)} color="primary">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteLink(index)} color="secondary">
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            </ListItem>
                        ))}
                    </List>
                )}
                {!isEditingLink && (
                    <Box display="flex" gap={2}>
                        <Select
                            value={selectedPlatform}
                            onChange={(e) => setSelectedPlatform(e.target.value)}
                            fullWidth
                        >
                            <MenuItem value="Facebook">Facebook</MenuItem>
                            <MenuItem value="Twitter">Twitter</MenuItem>
                            <MenuItem value="Instagram">Instagram</MenuItem>
                        </Select>
                        <TextField
                            value={newLink}
                            onChange={(e) => setNewLink(e.target.value)}
                            fullWidth
                            label="URL"
                        />
                        <Button variant="contained" onClick={handleAddLink}>
                            Agregar Red Social
                        </Button>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default PerfilEmpresa;
