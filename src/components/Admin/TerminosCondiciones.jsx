import { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, IconButton, TextField, Button, Card, CardContent } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { toast } from 'react-toastify';

const API_URL = 'https://prj-server.onrender.com/terminos'; // Cambia por la URL de tu API

const TerminosYCondiciones = () => {
    const [items, setItems] = useState([]);
    const [newPolicy, setNewPolicy] = useState('');
    const [sections, setSections] = useState([]);
    const [newSectionTitle, setNewSectionTitle] = useState('');
    const [newSectionDescription, setNewSectionDescription] = useState('');
    const [newSectionList, setNewSectionList] = useState([]);
    const [newListItem, setNewListItem] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editingSectionIndex, setEditingSectionIndex] = useState(null);
    const [editingListItemIndex, setEditingListItemIndex] = useState(null); // Nuevo estado para editar el ítem
    const [editingPolicyId, setEditingPolicyId] = useState(null);
    const [politicasArchivos, setPoliticasArchivos] = useState([]);
    const [mostrarArchivos, setMostrarArchivos] = useState(true);

    const [file, setFile] = useState(null); // Guardar el archivo seleccionado

    const handleFileChange = (e) => {
        setFile(e.target.files[0]); // Capturar el archivo seleccionado
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('archivo', file); // Agregar el archivo al FormData

        try {
            // Enviar el archivo al backend usando fetch
            const response = await fetch(`${API_URL}/subirArchivo`, {
                method: 'POST',
                body: formData, // El cuerpo de la petición es el FormData con el archivo
            });

            if (response.ok) {
                toast.success('Archivo subido con éxito');
                setFile(null);
            } else {
                toast.warning('Error al subir el archivo');
            }
        } catch (error) {
            toast.warning('Error al subir el archivo');
        }

    };

    const handleDownload = (archivoBase64, nombreArchivo) => {
        // Crear un enlace temporal
        const link = document.createElement('a');
        link.href = `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${archivoBase64}`;
        link.download = nombreArchivo;

        // Agregar el enlace al DOM y hacer clic en él para iniciar la descarga
        document.body.appendChild(link);
        link.click();

        // Limpiar el enlace del DOM
        document.body.removeChild(link);
    };

    useEffect(() => {

        const fetchPoliticasConArchivo = async () => {
            try {
                const response = await fetch(`${API_URL}/ConArchivo`);
                if (!response.ok) {
                    toast.warning('Error al obtener los Terminos y Condiciones');
                }

                const politicas = await response.json();
                setPoliticasArchivos(politicas);

            } catch (error) {
                toast.warning('Error');
            }
        };

        const fetchPolicies = async () => {
            try {
                const response = await fetch(API_URL);
                const data = await response.json();
                if (Array.isArray(data)) {
                    setItems(data);
                }
            } catch (error) {
                toast.warning('Error al Cargar Terminos y Condiciones');
            }
        };


        fetchPoliticasConArchivo();

        fetchPolicies();
    }, []);

    const addPolicy = async () => {
        if (newPolicy.trim() === '' || sections.length === 0) {
            toast.warning('Por favor, ingresa un nombre para el termino y agrega al menos una sección.');
            return;
        }

        const newPolicyObj = { titulo_politica: newPolicy, secciones: sections };
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newPolicyObj),
        });

        if (response.ok) {
            const createdPolicy = await response.json();
            setItems((prevItems) => [...prevItems, createdPolicy]);
            clearForm();
            toast.success('Termino Agregada');
        } else {
            toast.warning('Error al agregar el Termino.');

        }
    };

    const deletePolicy = async (index) => {
        const policyToDelete = items[index];
        const response = await fetch(`${API_URL}/${policyToDelete._id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            setItems((prevItems) => prevItems.filter((_, i) => i !== index));
            toast.success('Termino Eliminado');
        } else {
            toast.warning('Error al eliminar el Termino.');
        }
    };

    const addSection = async () => {
        if (newSectionTitle.trim() === '' || newSectionDescription.trim() === '') {
            toast.warning('Por favor, ingresa un título y una descripción para la sección.');
            return;
        }

        const newSection = {
            titulo_seccion: newSectionTitle,
            description: newSectionDescription,
            list: newSectionList,
        };

        if (editingSectionIndex !== null) {
            const updatedSections = [...sections];
            updatedSections[editingSectionIndex] = newSection;
            setSections(updatedSections);
            setEditingSectionIndex(null);
        } else {
            setSections((prevSections) => [...prevSections, newSection]);
        }
        clearSectionForm();
    };

    const deleteSection = (index) => {
        const updatedSections = sections.filter((_, i) => i !== index);
        setSections(updatedSections);
    };

    const editSection = (index) => {
        const section = sections[index];
        setNewSectionTitle(section.titulo_seccion);
        setNewSectionDescription(section.description);
        setNewSectionList(section.list); // Actualizar con la lista de la sección editada
        setEditingSectionIndex(index);
    };

    const addListItem = () => {
        if (newListItem.trim() === '') {
            toast.warning('Por favor, ingresa un ítem para la lista.');
            return;
        }

        if (editingListItemIndex !== null) {
            // Si está editando un ítem, lo actualiza
            const updatedList = [...newSectionList];
            updatedList[editingListItemIndex] = newListItem;
            setNewSectionList(updatedList);
            setEditingListItemIndex(null); // Resetear el índice de edición
        } else {
            // Si no está editando, lo agrega
            setNewSectionList((prevList) => [...prevList, newListItem]);
        }
        setNewListItem('');

    };

    const deleteListItem = (index) => {
        const updatedList = newSectionList.filter((_, i) => i !== index);
        setNewSectionList(updatedList);
    };

    const editListItem = (index) => {
        const listItem = newSectionList[index];
        setNewListItem(listItem);
        setEditingListItemIndex(index); // Guardar el índice del ítem que se está editando
    };

    const editPolicy = (index) => {
        setIsEditing(true);
        setEditingIndex(index);
        const policy = items[index];

        if (policy) {
            setNewPolicy(policy.titulo_politica);
            setSections(policy.secciones);
            setEditingPolicyId(policy._id);
        }
    };

    const updatePolicy = async () => {
        if (editingPolicyId === null) return;

        try {
            const response = await fetch(`${API_URL}/${editingPolicyId}`, {
                method: 'PATCH', // Asegúrate de usar PATCH ya que esa es la ruta correcta en tu backend
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    titulo_politica: newPolicy,  // Cambiamos el campo a 'name' para que coincida con lo que espera la API
                    secciones: sections,
                }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const updatedPolicy = await response.json();
            const updatedItems = items.map((item, index) =>
                index === editingIndex ? updatedPolicy : item
            );

            setItems(updatedItems);
            clearForm();
        } catch (error) {
            toast.warning('Error al actualizar el Termino');
        }
    };

    const saveChanges = async () => {
        if (isEditing) {
            await updatePolicy();
        } else {
            await addPolicy();
        }
    };

    const clearForm = () => {
        setNewPolicy('');
        setSections([]);
        setIsEditing(false);
        setEditingIndex(null);
        setEditingPolicyId(null);
    };

    const clearSectionForm = () => {
        setNewSectionTitle('');
        setNewSectionDescription('');
        setNewSectionList([]);
    };

    const handleDeleteArchivo = (id) => {
        // Confirmar si el usuario desea eliminar el archivo
        if (window.confirm("¿Estás seguro de que deseas eliminar este archivo?")) {
            // Realiza la petición de eliminación
            fetch(`${API_URL}/DeletArchivoTermino/${id}`, {
                method: 'DELETE',
            })
                .then((response) => {
                    if (response.ok) {
                        // Elimina el archivo de la lista en el frontend
                        setPoliticasArchivos((prevArchivos) => prevArchivos.filter((archivo) => archivo.id !== id));
                        alert("Archivo eliminado con éxito.");
                    } else {
                        alert("Hubo un error al eliminar el archivo.");
                    }
                })
                .catch((error) => {
                    console.error("Error eliminando el archivo:", error);
                    alert("Ocurrió un error inesperado.");
                });
        }
    };

    const handleSetActual = (id) => {
        // Confirmar si el usuario desea establecer este archivo como vigente
        if (window.confirm("¿Estás seguro de que deseas establecer este archivo como vigente?")) {
            // Realiza la petición de actualización
            fetch(`${API_URL}/ActualArchivoTermino/${id}`, {
                method: 'PATCH', // Usamos PATCH para actualizar el estado
            })
                .then((response) => {
                    if (response.ok) {
                        // Actualiza el estado del archivo en la lista en el frontend
                        setPoliticasArchivos((prevArchivos) => 
                            prevArchivos.map((archivo) => 
                                archivo.id === id ? { ...archivo, estado: true } : { ...archivo, estado: false }
                            )
                        );
                        alert("Archivo actualizado como vigente con éxito.");
                    } else {
                        alert("Hubo un error al actualizar el archivo.");
                    }
                })
                .catch((error) => {
                    console.error("Error actualizando el archivo:", error);
                    alert("Ocurrió un error inesperado.");
                });
        }
    };
    

    const toggleVista = () => {
        setMostrarArchivos(!mostrarArchivos);
    };

    return (
        <Box>
            <Button variant="contained" onClick={toggleVista}>
                {mostrarArchivos ? 'Ver Archivos' : 'Ver Termino Y Condiciones Resumidas'}
            </Button>
    
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' }, // Cambiar a columna en móviles
                    justifyContent: 'space-between',
                    padding: '20px',
                    minHeight: '100vh',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                }}
            >
                {mostrarArchivos ? (
                    <>
                        <Box sx={{ flex: 1, overflowY: 'auto', marginBottom: { xs: '20px', sm: '0' } }}>
                            {/* Sección para agregar/editar políticas */}
                            <Card
                                sx={{
                                    borderRadius: '16px',
                                    boxShadow: '0 6px 18px rgba(0, 0, 0, 0.1)',
                                    transition: 'all 0.3s ease-in-out',
                                }}
                            >
                                <CardContent>
                                    <Typography variant="h5" color="primary" gutterBottom>
                                        {isEditing ? 'Editar Termino' : 'Agregar Nuevo Termino'}
                                    </Typography>
                                    <TextField
                                        label="Título del Termino"
                                        variant="outlined"
                                        value={newPolicy}
                                        onChange={(e) => setNewPolicy(e.target.value)}
                                        fullWidth
                                        sx={{ marginBottom: '20px' }}
                                    />
                                    <Button variant="contained" color="primary" onClick={saveChanges}>
                                        {isEditing ? 'Actualizar Termino' : 'Agregar Termino'}
                                    </Button>
                                </CardContent>
                            </Card>
    
                            {/* Secciones */}
                            <Card
                                sx={{
                                    borderRadius: '16px',
                                    boxShadow: '0 6px 18px rgba(0, 0, 0, 0.1)',
                                    marginTop: '20px',
                                }}
                            >
                                <CardContent>
                                    <Typography variant="h5" color="primary" gutterBottom>
                                        Secciones
                                    </Typography>
                                    <List sx={{ marginTop: '20px' }}>
                                        {sections.map((section, index) => (
                                            <ListItem key={index}>
                                                <ListItemText
                                                    primary={section.titulo_seccion}
                                                    secondary={`Descripción: ${section.description}`}
                                                />
                                                <IconButton onClick={() => editSection(index)}>
                                                    <EditIcon color="primary" />
                                                </IconButton>
                                                <IconButton onClick={() => deleteSection(index)}>
                                                    <DeleteIcon color="error" />
                                                </IconButton>
                                            </ListItem>
                                        ))}
                                    </List>
                                    <TextField
                                        label="Título de la Sección"
                                        variant="outlined"
                                        value={newSectionTitle}
                                        onChange={(e) => setNewSectionTitle(e.target.value)}
                                        fullWidth
                                        sx={{ marginBottom: '10px' }}
                                    />
                                    <TextField
                                        label="Descripción de la Sección"
                                        variant="outlined"
                                        value={newSectionDescription}
                                        onChange={(e) => setNewSectionDescription(e.target.value)}
                                        fullWidth
                                        sx={{ marginBottom: '10px' }}
                                    />
                                    <List>
                                        {newSectionList.map((item, index) => (
                                            <ListItem key={index}>
                                                <ListItemText primary={item} />
                                                <IconButton onClick={() => editListItem(index)}>
                                                    <EditIcon color="primary" />
                                                </IconButton>
                                                <IconButton onClick={() => deleteListItem(index)}>
                                                    <DeleteIcon color="error" />
                                                </IconButton>
                                            </ListItem>
                                        ))}
                                    </List>
                                    <TextField
                                        label="Ítem de Lista"
                                        variant="outlined"
                                        value={newListItem}
                                        onChange={(e) => setNewListItem(e.target.value)}
                                        fullWidth
                                        sx={{ marginBottom: '10px' }}
                                    />
                                    <Button variant="contained" color="secondary" onClick={addListItem}>
                                        {editingListItemIndex !== null ? 'Actualizar Item' : 'Agregar Item'}
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={addSection}
                                        sx={{ marginLeft: '10px' }}
                                    >
                                        {editingSectionIndex !== null ? 'Actualizar Sección' : 'Agregar Sección'}
                                    </Button>
                                </CardContent>
                            </Card>
                        </Box>
    
                        {/* Sección para mostrar las políticas */}
                        <Box sx={{ flex: 1, overflowY: 'auto' }}>
                            <Card
                                sx={{
                                    borderRadius: '16px',
                                    boxShadow: '0 6px 18px rgba(0, 0, 0, 0.1)',
                                }}
                            >
                                <CardContent>
                                    <Typography variant="h5" color="primary" gutterBottom>
                                        Terminos y Condiciones
                                    </Typography>
                                    <List>
                                        {items.map((policy, index) => (
                                            <ListItem key={policy._id} alignItems="flex-start">
                                                <ListItemText
                                                    primary={policy.titulo_politica}
                                                    secondary={
                                                        <Box>
                                                            {policy.secciones &&
                                                                policy.secciones.map((section) => (
                                                                    <Box key={section._id} mb={2}>
                                                                        <Typography variant="subtitle1" color="textSecondary">
                                                                            Sección: {section.titulo_seccion}
                                                                        </Typography>
                                                                        <Typography variant="body2" color="textSecondary">
                                                                            Descripción: {section.description}
                                                                        </Typography>
                                                                        <List dense>
                                                                            {section.list &&
                                                                                section.list.map((listItem, listItemIndex) => (
                                                                                    <ListItem key={listItemIndex}>
                                                                                        <ListItemText primary={listItem} />
                                                                                    </ListItem>
                                                                                ))}
                                                                        </List>
                                                                    </Box>
                                                                ))}
                                                        </Box>
                                                    }
                                                />
                                                <IconButton onClick={() => editPolicy(index)}>
                                                    <EditIcon color="primary" />
                                                </IconButton>
                                                <IconButton onClick={() => deletePolicy(index)}>
                                                    <DeleteIcon color="error" />
                                                </IconButton>
                                            </ListItem>
                                        ))}
                                    </List>
                                </CardContent>
                            </Card>
                        </Box>
                    </>
                ) : (
                    <>
                        {/* Sección para agregar archivo de políticas */}
                        <Box sx={{ flex: 1, overflowY: 'auto', marginBottom: { xs: '20px', sm: '0' } }}>
                            <Card
                                sx={{
                                    borderRadius: '16px',
                                    boxShadow: '0 6px 18px rgba(0, 0, 0, 0.1)',
                                    padding: '20px',
                                }}
                            >
                                <Typography variant="h5" color="primary" gutterBottom>
                                    Agregar Archivo De Terminos
                                </Typography>
                                <form onSubmit={handleSubmit}>
                                    <TextField
                                        type="file"
                                        variant="outlined"
                                        fullWidth
                                        onChange={handleFileChange}
                                        sx={{ marginBottom: '20px' }}
                                    />
                                    <Button variant="contained" color="primary" type="submit">
                                        Subir Archivo
                                    </Button>
                                </form>
                            </Card>
                        </Box>
    
                        {/* Sección para mostrar archivos de políticas */}
                        <Box sx={{ flex: 1, overflowY: 'auto' }}>
                            <Card
                                sx={{
                                    borderRadius: '16px',
                                    boxShadow: '0 6px 18px rgba(0, 0, 0, 0.1)',
                                }}
                            >
                                <Typography variant="h5" color="primary" gutterBottom>
                                    Historial De Terminos
                                </Typography>
                                <div>
                                    {politicasArchivos.length > 0 ? (
                                        politicasArchivos
                                            .sort((a, b) => new Date(b.fechaSubida) - new Date(a.fechaSubida)) // Ordena archivos por fecha más reciente primero
                                            .map((archivo, index) => (
                                                <Card key={archivo.id} sx={{ marginBottom: '20px', padding: '20px' }}>
                                                    <Typography variant="h6">
                                                        {archivo.nombre}
                                                        {archivo.estado ? (
                                                            <Typography variant="subtitle1" color="primary">
                                                                Termino Actual
                                                            </Typography>
                                                        ) : (
                                                            <Typography variant="subtitle1" color="textSecondary">
                                                                No vigente
                                                            </Typography>
                                                        )}
                                                    </Typography>
                                                    <>
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={() => handleDownload(archivo.archivo)}
                                                        >
                                                            Descargar
                                                        </Button>
                                                        {archivo.estado ? (
                                                            <Button
                                                                variant="contained"
                                                                color="secondary"
                                                                onClick={() => handleDeleteArchivo(archivo.id)} // Función para eliminar si es actual
                                                            >
                                                                No vigente
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                variant="contained"
                                                                color="secondary"
                                                                onClick={() => handleSetActual(archivo.id)} // Función para establecer como política actual
                                                            >
                                                                Establecer vigencia
                                                            </Button>
                                                        )}
                                                        <Typography variant="body2" color="textSecondary">
                                                            {new Date(archivo.fechaSubida).toLocaleString('es-ES', {
                                                                hour: 'numeric',
                                                                minute: 'numeric',
                                                                day: 'numeric',
                                                                month: 'numeric',
                                                                year: 'numeric',
                                                            })}
                                                        </Typography>

                                                        <Typography variant="body2" color="textSecondary">
                                                            Versión: {archivo.version}
                                                        </Typography>

                                                    </>
                                                </Card>
                                            ))
                                    ) : (
                                        <Typography variant="body1" color="textSecondary">
                                            No hay archivos de Terminos disponibles.
                                        </Typography>
                                    )}
                                </div>
                            </Card>
                        </Box>
                    </>
                )}
            </Box>
        </Box>
    );
    


};

export default TerminosYCondiciones;
