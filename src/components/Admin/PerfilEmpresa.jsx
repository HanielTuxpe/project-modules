import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, IconButton, Button, Avatar, Tooltip, Select, MenuItem, ListItem, useTheme ,CardMedia} from '@mui/material';
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

    const theme = useTheme();

    const cargarDatosEmpresa = async () => {
        try {
            const response = await fetch('https://prj-server.onrender.com/InformacionEmpresa');
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
            const response = await fetch(`https://prj-server.onrender.com/InformacionEmpresa/${empresaId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ [campo]: valor }),
            });



            if (response.ok) {
                const data = await response.json();
                //toast.success(`Campo ${campo} actualizado con éxito`);

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

    const handleImageChange = async (e) => { // Usar 'async' aquí
        const file = e.target.files[0];
        if (file) {
            // Validar tipo de archivo y tamaño...
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

            // Crear un FormData para enviar la imagen
            const formData = new FormData();
            formData.append('imagen', file); // 'imagen' es el nombre del campo

            // Hacer la solicitud para actualizar la imagen en la base de datos
            try {
                const response = await fetch(`https://prj-server.onrender.com/InformacionEmpresa/${empresaId}`, {
                    method: 'PATCH',
                    body: formData, // Enviamos el FormData con la imagen
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
            toast.error('El campo Nombre no puede estar vacío,');
        } else {
            actualizarEmpresa('nombreEmpresa', nuevoNombre);
            setIsEditingNombre(false);
        }


    };

    const toggleEditing = () => {
        if (isEditing) {
            // Verifica que todos los campos tengan contenido antes de guardar
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

                return; // No guarda si algún campo está vacío
            }

            // Guardar los cambios en todos los campos editados
            actualizarEmpresa('nombreEmpresa', nombreEmpresa);
            actualizarEmpresa('descripcion', descripcion);
            actualizarEmpresa('mision', mision);
            actualizarEmpresa('vision', vision);
            actualizarEmpresa('direccion', direccion);
            actualizarEmpresa('objetivo', objetivo);
            
            toast.success('Informacion actualizada con éxito');
           
        }

        // Alterna entre modo de edición y visualización
        setIsEditing(!isEditing);
    };


    const handleAddLink = () => {
        if (selectedPlatform && newLink) {
            // Verificar que el enlace comience con "https://"
            const urlPattern = /^https:\/\/.+/;
            if (!urlPattern.test(newLink)) {
                toast.warning("El enlace debe comenzar con 'https://'.");
                return; // No continúa si el enlace no es válido
            }

            // Crear el nuevo enlace
            const newSocialLink = { nombre: selectedPlatform, link: newLink };

            // Asegurarse de que socialLinks sea un arreglo antes de concatenar
            const updatedLinks = Array.isArray(socialLinks) ? [...socialLinks, newSocialLink] : [newSocialLink];

            // Actualizar el estado
            setSocialLinks(updatedLinks);

            // Actualizar en la base de datos
            actualizarEmpresa('redesSociales', updatedLinks);

            // Limpiar el formulario
            setNewLink('');
            setSelectedPlatform('');
        } else {
            toast.warning("Debe completar todos los campos.");
        }
    };


    const handleDeleteLink = (index) => {
        // Verifica si el índice es válido
        if (index >= 0 && index < socialLinks.length) {
            // Crea una copia del estado actual de socialLinks
            const updatedLinks = socialLinks.filter((_, i) => i !== index);

            // Actualiza el estado de socialLinks con el nuevo arreglo sin el enlace eliminado
            setSocialLinks(updatedLinks);

            // Llama a la función para actualizar la empresa en el backend
            actualizarEmpresa('redesSociales', updatedLinks);
        } else {
            console.error('Error: No se puede eliminar el enlace, índice no válido.');
        }
    };

    const handleEditLink = (index) => {
        setIsEditingLink(true);
        setCurrentEditIndex(index);
        setEditedLink(socialLinks[index]); // Carga el enlace a editar
    };

    const handleUpdateLink = () => {
        if (currentEditIndex !== null) {
            // Crea una copia del estado actual de socialLinks
            const updatedLinks = [...socialLinks];

            // Actualiza el enlace en el índice correspondiente
            updatedLinks[currentEditIndex] = editedLink;

            // Actualiza el estado de socialLinks con el nuevo arreglo
            setSocialLinks(updatedLinks);

            // Llama a la función para actualizar la empresa en el backend
            actualizarEmpresa('redesSociales', updatedLinks);

            // Restablece el estado de edición y el formulario
            setIsEditingLink(false);
            setEditedLink({ platform: '', url: '' }); // Limpia los valores del formulario
            setCurrentEditIndex(null); // Reinicia el índice de edición
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
            <Box display="flex" justifyContent="center"     alignItems="center" height="100%">
                <Typography variant="h4" color="primary" gutterBottom>
                    {isEditingNombre ? (
                        <TextField
                        InputProps={{
                            style: {
                              color: 'text.primary', // Cambia el color del texto
                            },
                          }}
                            value={nuevoNombre}
                            onChange={(e) => setNuevoNombre(e.target.value)}
                            onBlur={handleEditNombre}
                            autoFocus
                        />
                    ) : (
                        <Box display="flex" alignItems="center">
                            <Typography variant='h4'>
                            {nombreEmpresa}
                            </Typography>
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
               
                        
            <CardMedia
              component="img"
              image={imagen}
              alt={`${nombreEmpresa} logo`}
              sx={{
                width: '25%',
                objectFit: 'contain',
                filter: theme.custom.dropShadow, 
               // Opcional: redondea bordes
              }}
            />
            </Box>

            <input
                accept="image/*"
                style={{ display: 'none' }}
                id="upload-image"
                type="file"
                onChange={handleImageChange}

            />
            <label htmlFor="upload-image">
                <Button variant="contained" component="span" >
                    Cambiar Imagen
                </Button>
            </label>
            <Box mt={3} display="flex" justifyContent="center">
                <Button variant="contained" onClick={toggleEditing}>
                    {isEditing ? 'Guardar Cambios' : 'Editar Información'}
                </Button>
            </Box>

            <Box mt={3}>
                <Typography variant="h6">Dirección</Typography>
                <TextField
                   
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    multiline
                    rows={2}
                    fullWidth
                    disabled={!isEditing}
                    InputProps={{
                        style: {
                          color: 'text.primary', // Cambia el color del texto
                        },
                      }}
                />
            </Box>

            <Box mt={3}>
                <Typography variant="h6">Descripción</Typography>
                <TextField
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
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
                    onChange={(e) => setMision(e.target.value)}
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
                    onChange={(e) => setVision(e.target.value)}
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
                    onChange={(e) => setObjetivo(e.target.value)}
                    multiline
                    rows={3}
                    fullWidth
                    disabled={!isEditing}
                />
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
                            color: 'text.primary', 
                        }}
                    >
                        <MenuItem value=""sx={{color: 'text.primary'}}>
                            <em>Seleccionar Plataforma</em>
                        </MenuItem>
                        <MenuItem value="Facebook" sx={{color: 'text.primary'}}>Facebook</MenuItem>
                        <MenuItem value="WhatsApp" sx={{color: 'text.primary'}}>WhatsApp</MenuItem>
                        <MenuItem value="Instagram" sx={{color: 'text.primary'}}>Instagram</MenuItem>
                        <MenuItem value="YouTube" sx={{color: 'text.primary'}}>YouTube</MenuItem>
                        <MenuItem value="Twitter" sx={{color: 'text.primary'}}>Twitter</MenuItem>
                        <MenuItem value="LinkedIn" sx={{color: 'text.primary'}}>LinkedIn</MenuItem>
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
                {!Array.isArray(socialLinks) || socialLinks.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                        No hay enlaces de redes sociales.
                    </Typography>
                ) : (
                    <Box mt={3} width="100%">
                        {socialLinks.map((link, index) => (
                            <ListItem key={link._id}>
                                <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
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
                                                    mr: 2,
                                                    width: '300px',
                                                    color: 'text.primary'
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
                                            <Typography variant='subtitle1'>
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


        </Box>
    );
};

export default PerfilEmpresa;
